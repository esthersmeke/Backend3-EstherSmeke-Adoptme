import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import usersRouter from "./routes/users.router.js";
import petsRouter from "./routes/pets.router.js";
import adoptionsRouter from "./routes/adoption.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import mocksRouter from "./routes/mocks.router.js"; // Importar mocks.router.js
import logger from "./utils/logger.js";

const app = express();
const PORT = process.env.PORT || 8080;

mongoose.set("strictQuery", true);

mongoose
  .connect("mongodb://localhost:27017/adoptme", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info("Connected to MongoDB");
  })
  .catch((error) => {
    logger.error("Error connecting to MongoDB:", error);
  });

app.use(express.json());
app.use(cookieParser());

app.use("/api/users", usersRouter);
app.use("/api/pets", petsRouter);
app.use("/api/adoptions", adoptionsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/mocks", mocksRouter); // Configurar la ruta para mocks

// Manejador de errores global
app.use((err, req, res, next) => {
  logger.error(`${err.message}`);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(PORT, () => logger.info(`Listening on ${PORT}`));

// Exportar la aplicación para usarla en las pruebas
export default app;
