import * as fs from "fs";
import * as path from "path";
import { Logger } from "./logger";

// Load and parse JSON data files
function parseJsonFile<T>(filename: string): T[] {
  try {
    const filePath = path.join(__dirname, "..", "data", filename);
    const fileContent = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContent) as T[];
  } catch (error) {
    Logger.error(`Error loading ${filename}:`, (error as Error).message);
    return [];
  }
}

export { parseJsonFile };
