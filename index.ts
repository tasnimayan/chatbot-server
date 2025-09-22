import { ApolloServer } from "@apollo/server";
import express from "express";
import { expressMiddleware } from "@as-integrations/express5";
import cors from "cors";
import { typeDefs } from "./src/schema";
import config from "./src/utils/config";
import { authenticate } from "./src/middlewares/auth";
import { GraphQLContext } from "./src/types";
import { loadJsonData } from "./src/utils/loadJsonData";
import { resolvers } from "./src/resolvers";
import { createUserAuthToken } from "./src/controller/jwtTokenGenerator";

async function startServer() {
  // Express app
  const app = express();
  const data = loadJsonData();

  // Middlewares
  app.use(
    cors({
      origin: "*",
      // origin: (origin: string, callback: any) => {
      //   if (!origin || config.ALLOWED_ORIGINS?.includes(origin)) {
      //     callback(null, true);
      //   } else {
      //     callback(new Error("Not allowed by CORS"));
      //   }
      // },
      credentials: true,
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  app.use(express.json({ limit: "10mb" }));
  app.post("/auth/generate-token", createUserAuthToken);

  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (error) => {
      console.error("GraphQL Error:", error);
      return {
        message: error.message,
        code: error.extensions?.code || "INTERNAL_ERROR",
        path: error.path,
      };
    },
  });

  await server.start();

  // Apollo Server middleware
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }): Promise<GraphQLContext> => {
        // Add authentication to context
        const user = authenticate(req);
        return {
          data,
          user,
          isAuthenticated: !!user,
        };
      },
    })
  );

  app.listen(config.PORT, () => {
    console.log(`Server running on http://localhost:${config.PORT}/graphql`);
  });
}

// Handle uncaught exceptions
process.on("uncaughtException", (error: Error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (error: Error) => {
  console.error("Unhandled Rejection:", error);
  process.exit(1);
});

startServer().catch((error: Error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
