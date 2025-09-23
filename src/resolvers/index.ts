import { GraphQLError } from "graphql";
import {
  GraphQLContext,
  QueryArgs,
  NodeObject,
  Action,
  Trigger,
  Response,
  ResourceTemplate,
} from "../types";
import { JSONType, LongType } from "./customScalers";

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

    nodes: (parent: any, args: any, context: GraphQLContext): NodeObject[] => {
      requireAuth(context);
      return context.data.nodes;
    },
  },

  NodeObject: {
    parents: (
      parent: NodeObject,
      args: any,
      context: GraphQLContext
    ): NodeObject[] => {
      if (!parent.parentIds || parent.parentIds.length === 0) {
        return [];
      }

      return context.data.nodes.filter((node) =>
        parent.parentIds!.includes(node.compositeId)
      );
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
      args: any,
      context: GraphQLContext
    ): Response[] => {
      if (!parent.responseIds || parent.responseIds.length === 0) {
        return [];
      }

      return context.data.responses.filter((response) =>
        parent.responseIds!.includes(response._id)
      );
    },

    actions: (
      parent: NodeObject,
      args: any,
      context: GraphQLContext
    ): Action[] => {
      if (!parent.actionIds || parent.actionIds.length === 0) {
        return [];
      }

      return context.data.actions.filter((action) =>
        parent.actionIds!.includes(action._id)
      );
    },
  },

  Response: {
    platforms: (
      parent: Response,
      args: any,
      context: GraphQLContext
    ): any[] => {
      return parent.platforms || [];
    },
  },

  ResponsePlatform: {
    localeGroups: (parent: any, args: any, context: GraphQLContext): any[] => {
      // Handle both 'localeGroups' and 'localeGroup' properties from the data
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
