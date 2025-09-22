import { Request } from "express";
import { User, AuthToken } from "../types";
import { parseJsonFile } from "../utils";

// Extract Bearer token from header
function extractToken(authHeader: string | undefined) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
}

// Authenticate user
export function authenticate(req: Request): User | null {
  try {
    const authHeader = req.headers.authorization;
    const token = extractToken(authHeader);

    if (!token) {
      return null;
    }

    // Load tokens data
    const tokens = parseJsonFile<AuthToken>("tokens.json");

    // Find matching token
    const validToken = tokens.find((t) => t.token === token);

    if (!validToken) {
      console.log("Invalid token provided");
      return null;
    }

    console.log(`Authenticated user: ${validToken.userId || "Unknown"}`);
    return {
      id: validToken.userId,
      token: validToken.token,
      permissions: validToken.permissions || [],
    };
  } catch (error) {
    console.error("Authentication error:", (error as Error).message);
    return null;
  }
}
