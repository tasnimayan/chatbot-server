export interface Action {
  _id: string;
  createdAt: number;
  updatedAt?: number;
  name: string;
  description?: string;
  functionString?: string;
  resourceTemplateId?: string;
}

export interface Trigger {
  _id: string;
  createdAt: number;
  updatedAt?: number;
  name: string;
  description?: string;
  functionString?: string;
  resourceTemplateId?: string;
}

export interface ResponseVariation {
  name: string;
  responses: Record<string, any>;
}

export interface ResponseLocaleGroup {
  localeGroupId: string;
  variations: ResponseVariation[];
}

export interface ResponsePlatform {
  integrationId?: string;
  build?: number;
  localeGroups?: ResponseLocaleGroup[];
}

export interface Response {
  _id: string;
  createdAt: number;
  updatedAt?: number;
  name: string;
  description?: string;
  platforms?: ResponsePlatform[];
}

export interface ResourceTemplate {
  _id: string;
  createdAt: number;
  updatedAt?: number;
  name: string;
  description?: string;
  schema?: Record<string, any>;
  integrationId?: string;
  functionString?: string;
  key?: string;
}

export interface NodeObject {
  _id: string;
  createdAt: number;
  updatedAt?: number;
  name: string;
  description?: string;
  parentIds?: string[];
  root?: boolean;
  triggerId?: string;
  responseIds?: string[];
  actionIds?: string[];
  priority?: number;
  compositeId?: string;
  global?: boolean;
  colour?: string;
}

export interface AuthToken {
  token: string;
  userId: string;
  name: string;
  permissions: string[];
  createdAt: string;
}

export interface User {
  id: string;
  token: string;
  permissions: string[];
}

export interface AppData {
  nodes: NodeObject[];
  actions: Action[];
  triggers: Trigger[];
  responses: Response[];
  resourceTemplates: ResourceTemplate[];
  tokens: AuthToken[];
}

export interface GraphQLContext {
  data: AppData;
  user: User | null;
  isAuthenticated: boolean;
}

export interface QueryArgs {
  nodeId?: string;
}

export interface PaginationArgs {
  limit?: number;
  offset?: number;
}
