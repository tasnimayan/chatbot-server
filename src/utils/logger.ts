import fs from "fs";
import path from "path";
import pino from "pino";

class Logger {
  private static logDir = path.join(process.cwd(), "logs");

  static init() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private static streams = pino.multistream([
    {
      level: "info",
      stream: fs.createWriteStream(path.join(Logger.logDir, "info.log"), {
        flags: "a",
      }),
    },
    {
      level: "warn",
      stream: fs.createWriteStream(path.join(Logger.logDir, "warn.log"), {
        flags: "a",
      }),
    },
    {
      level: "error",
      stream: fs.createWriteStream(path.join(Logger.logDir, "error.log"), {
        flags: "a",
      }),
    },
    { level: "info", stream: process.stdout }, // console output for all logs
  ]);

  private static logger = pino(
    {
      base: null, // removes default pid/hostname
      timestamp: pino.stdTimeFunctions.isoTime,
      formatters: {
        level(label) {
          return { level: label.toUpperCase() };
        },
      },
    },
    Logger.streams
  );
  static info(message: string, meta?: any) {
    Logger.logger.info(meta || {}, message);
  }

  static warn(message: string, meta?: any) {
    Logger.logger.warn(meta || {}, message);
  }

  static error(message: string, meta?: any) {
    Logger.logger.error(meta || {}, message);
  }
}

Logger.init();
export default Logger;
