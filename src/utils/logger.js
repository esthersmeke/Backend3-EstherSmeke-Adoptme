// Importar Winston y configurar el logger
import winston from "winston";

// Crear diferentes niveles de logging
const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "red",
    warning: "yellow",
    info: "green",
    http: "magenta",
    debug: "blue",
  },
};

// Configuración del logger para el entorno de desarrollo
const devLogger = winston.createLogger({
  levels: customLevels.levels,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [new winston.transports.Console({ level: "debug" })],
});

// Configuración del logger para el entorno de producción
const prodLogger = winston.createLogger({
  levels: customLevels.levels,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({ level: "info" }),
    new winston.transports.File({ filename: "errors.log", level: "error" }),
  ],
});

// Exportar el logger adecuado según el entorno
const logger = process.env.NODE_ENV === "production" ? prodLogger : devLogger;

export default logger;
