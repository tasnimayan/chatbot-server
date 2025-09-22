import dotenv from "dotenv";

// Load environment variables
dotenv.config();

interface Config {
  NODE_ENV: string;
  PORT: number;
  API_VERSION: string;
  ALLOWED_ORIGINS: string[];
  JWT_SECRET: string;
  API_KEY: string;
}

const config: Config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "8000", 10),
  API_VERSION: process.env.API_VERSION || "v1",
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"],
  JWT_SECRET: process.env.JWT_SECRET || "secret-jwt-key",
  API_KEY: process.env.API_KEY || "secret-api-key",
};

export default config;
