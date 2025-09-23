import { GraphQLScalarType } from "graphql";

// Custom scalar types for Long and JSON types
const LongType = new GraphQLScalarType({
  name: "Long",
  serialize: (value: unknown): number => {
    if (typeof value === "number") return value;
    if (typeof value === "string") return parseInt(value, 10);
    throw new Error("Value must be a number or string");
  },
  parseValue: (value: unknown): number => {
    if (typeof value === "number") return value;
    if (typeof value === "string") return parseInt(value, 10);
    throw new Error("Value must be a number or string");
  },
  parseLiteral: (ast: any): number => {
    return parseInt(ast.value, 10);
  },
});

const JSONType = new GraphQLScalarType({
  name: "JSON",
  serialize: (value: unknown): any => value,
  parseValue: (value: unknown): any => value,
  parseLiteral: (ast: any): any => JSON.parse(ast.value),
});

export { LongType, JSONType };
