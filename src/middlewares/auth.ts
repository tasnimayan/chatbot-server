import { Request } from "express";
import { User, AuthToken } from "../types";
import { parseJsonFile } from "../utils";
import { Logger } from "../utils/logger";

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
      return null;
    }

    return {
      id: validToken.userId,
      token: validToken.token,
      permissions: validToken.permissions || [],
    };
  } catch (error) {
    Logger.error("Authentication error:", (error as Error).message);
    return null;
  }
}
