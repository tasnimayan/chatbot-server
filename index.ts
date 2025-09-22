import { ApolloServer } from "@apollo/server";
import express, { json } from "express";
import { expressMiddleware } from "@as-integrations/express5";
const cors = require("cors");
import dotenv from "dotenv";
import { typeDefs } from "./src/schema";
dotenv.config();

async function startServer() {
  // Express app
  const app = express();

  // Middlewares
  app.use(cors());

  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers: {},
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

  // Apply middleware
  app.use(
    "/graphql",
    cors(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const token = req.headers.authorization?.split(" ")[1];
        return { token };
      },
    })
  );

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/graphql`);
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
