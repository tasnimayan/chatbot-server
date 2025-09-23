import { GraphQLError } from "graphql";
import {
  GraphQLContext,
  QueryArgs,
  NodeObject,
  Action,
  Trigger,
  Response,
  ResourceTemplate,
  PaginationArgs,
} from "../types";
import { JSONType, LongType } from "./customScalers";

const MAX_LIMIT = 500;

// Authentication helper
const requireAuth = (context: GraphQLContext): void => {
  if (!context.isAuthenticated) {
    throw new GraphQLError("Authentication required", {
      extensions: {
        code: "UNAUTHENTICATED",
        http: { status: 401 },
      },
    });
  }
};

const sanitizeNonNegative = (n: number | undefined, fallback: number) => {
  const v = typeof n === "number" && Number.isFinite(n) ? n : fallback;
  return v < 0 ? 0 : v;
};

const paginate = <T>(arr: T[], { limit, offset }: PaginationArgs): T[] => {
  const safeOffset = sanitizeNonNegative(offset, 0);
  const safeLimit = sanitizeNonNegative(
    typeof limit === "number" ? Math.min(limit, MAX_LIMIT) : MAX_LIMIT,
    MAX_LIMIT
  );
  return arr.slice(safeOffset, safeOffset + safeLimit);
};

export const resolvers = {
  Long: LongType,
  JSON: JSONType,

  Query: {
    node: (
      parent: any,
      { nodeId }: QueryArgs,
      context: GraphQLContext
    ): NodeObject | null => {
      requireAuth(context);

      if (!nodeId) {
        return null;
      }

      return context.data.nodes.find((node) => node._id === nodeId) || null;
    },

    nodes: (
      parent: any,
      args: PaginationArgs,
      context: GraphQLContext
    ): NodeObject[] => {
      requireAuth(context);
      return paginate(context.data.nodes, args);
    },
  },

  NodeObject: {
    parents: (
      parent: NodeObject,
      args: PaginationArgs,
      context: GraphQLContext
    ): NodeObject[] => {
      if (!parent.parentIds || parent.parentIds.length === 0) {
        return [];
      }

      const list = context.data.nodes.filter((node) =>
        parent.parentIds!.includes(node.compositeId)
      );

      return paginate(list, args);
    },

    trigger: (
      parent: NodeObject,
      args: any,
      context: GraphQLContext
    ): Trigger | null => {
      if (!parent.triggerId) {
        return null;
      }

      return (
        context.data.triggers.find(
          (trigger) => trigger._id === parent.triggerId
        ) || null
      );
    },

    responses: (
      parent: NodeObject,
      args: PaginationArgs,
      context: GraphQLContext
    ): Response[] => {
      if (!parent.responseIds || parent.responseIds.length === 0) {
        return [];
      }

      const list = context.data.responses.filter((response) =>
        parent.responseIds!.includes(response._id)
      );
      return paginate(list, args);
    },

    actions: (
      parent: NodeObject,
      args: PaginationArgs,
      context: GraphQLContext
    ): Action[] => {
      if (!parent.actionIds || parent.actionIds.length === 0) {
        return [];
      }

      const list = context.data.actions.filter((action) =>
        parent.actionIds!.includes(action._id)
      );
      return paginate(list, args);
    },
  },

  Response: {
    platforms: (
      parent: Response,
      args: PaginationArgs,
      context: GraphQLContext
    ): any[] => {
      const list = parent.platforms || [];
      return paginate(list, args);
    },
  },

  ResponsePlatform: {
    localeGroups: (parent: any, args: any, context: GraphQLContext): any[] => {
      if (parent.localeGroups) {
        return parent.localeGroups.map((group: any) => ({
          localeGroupId: group.localeGroup || group.localeGroupId,
          variations: group.variations || [],
        }));
      }
      return [];
    },
  },

  Action: {
    resourceTemplate: (
      parent: Action,
      args: any,
      context: GraphQLContext
    ): ResourceTemplate | null => {
      if (!parent.resourceTemplateId) {
        return null;
      }

      return (
        context.data.resourceTemplates.find(
          (template) => template._id === parent.resourceTemplateId
        ) || null
      );
    },
  },

  Trigger: {
    resourceTemplate: (
      parent: Trigger,
      args: any,
      context: GraphQLContext
    ): ResourceTemplate | null => {
      if (!parent.resourceTemplateId) {
        return null;
      }

      return (
        context.data.resourceTemplates.find(
          (template) => template._id === parent.resourceTemplateId
        ) || null
      );
    },
  },
};
