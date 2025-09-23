import config from "../utils/config";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import { Request, Response } from "express";
import { randomBytes } from "crypto";
import { AuthToken } from "../types";
import { Logger } from "../utils/logger";

const createUserAuthToken = (req: Request, res: Response) => {
  try {
    const apiKeyHeader = req.headers["x-api-key"];
    if (!apiKeyHeader || apiKeyHeader !== config.API_KEY) {
      return res.status(403).json({ success: false, error: "Invalid API key" });
    }

    const { name, permissions } = req.body;
    const userId = randomBytes(8).toString("hex"); // generates 16 characters unique UUID

    if (!name) {
      return res
        .status(400)
        .json({ success: false, error: "name is required" });
    }

    // Create JWT
    const token = jwt.sign({ userId, name }, config.JWT_SECRET);

    // Prepare token entry
    const tokenEntry = {
      userId,
      name,
      permissions: permissions || ["read"],
      token,
      createdAt: new Date().toISOString(),
    };

    const tokensFile = path.join(__dirname, "..", "data", "tokens.json");

    let tokens: AuthToken[] = [];
    if (fs.existsSync(tokensFile)) {
      const raw = fs.readFileSync(tokensFile, "utf8");
      tokens = raw ? JSON.parse(raw) : [];
    }

    // Append new token
    tokens.push(tokenEntry);
    fs.writeFileSync(tokensFile, JSON.stringify(tokens, null, 2));

    return res.json({ success: true, data: tokenEntry });
  } catch (err: any) {
    Logger.error("Token generation failed:", err);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

export { createUserAuthToken };
