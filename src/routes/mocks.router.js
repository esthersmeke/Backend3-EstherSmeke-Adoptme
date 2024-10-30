import { Router } from "express";
import bcrypt from "bcrypt";
import User from "../dao/models/User.js";
import Pet from "../dao/models/Pet.js";
import logger from "../utils/logger.js";

const router = Router();

// Endpoint para generar 100 mascotas mock
router.get("/mockingpets", (req, res) => {
  logger.info("Accediendo al endpoint /mockingpets");
  try {
    const pets = [];

    for (let i = 0; i < 100; i++) {
      pets.push({
        name: `Pet${i}`,
        species: "Dog",
        adopted: false,
        owner: null,
      });
    }

    res.json(pets);
  } catch (err) {
    logger.error(`Error al generar mascotas: ${err.message}`);
    res.status(500).json({ error: "Error al generar mascotas" });
  }
});

// Endpoint para generar 50 usuarios mock
router.get("/mockingusers", async (req, res) => {
  logger.info("Accediendo al endpoint /mockingusers");
  try {
    const users = [];
    const saltRounds = 10;

    for (let i = 0; i < 50; i++) {
      const hashedPassword = await bcrypt.hash("coder123", saltRounds);

      users.push({
        username: `User${i}`,
        email: `user${i}@example.com`,
        first_name: `FirstName${i}`,
        last_name: `LastName${i}`,
        password: hashedPassword,
        role: i % 2 === 0 ? "admin" : "user",
        pets: [],
      });
    }

    res.json(users);
  } catch (err) {
    logger.error(`Error al generar usuarios: ${err.message}`);
    res.status(500).json({ error: "Error al generar usuarios" });
  }
});

// Endpoint para generar usuarios y mascotas y eliminarlos antes de insertar nuevos
router.post("/generateData", async (req, res) => {
  logger.info("Accediendo al endpoint /generateData");

  try {
    const { users, pets } = req.body;

    // Validación de entrada
    if (!users || !pets) {
      throw new Error("Los parámetros 'users' y 'pets' son obligatorios");
    }

    if (typeof users !== "number" || typeof pets !== "number") {
      throw new Error("'users' y 'pets' deben ser números");
    }

    // Eliminar datos existentes
    await User.deleteMany({});
    await Pet.deleteMany({});
    logger.info("Usuarios y mascotas existentes eliminados");

    // Generar usuarios
    const userPromises = [];
    for (let i = 0; i < users; i++) {
      const hashedPassword = await bcrypt.hash("coder123", 10);
      userPromises.push({
        username: `User${i}`,
        email: `user${i}@example.com`,
        first_name: `FirstName${i}`,
        last_name: `LastName${i}`,
        password: hashedPassword,
        role: i % 2 === 0 ? "admin" : "user",
        pets: [],
      });
    }

    // Insertar usuarios generados en la base de datos
    const generatedUsers = await User.insertMany(userPromises);
    logger.info(`${generatedUsers.length} usuarios generados e insertados`);

    // Generar mascotas
    const petPromises = [];
    for (let i = 0; i < pets; i++) {
      petPromises.push({
        name: `Pet${i}`,
        species: "Dog",
        adopted: false,
        owner: null,
      });
    }

    // Insertar mascotas generadas en la base de datos
    const generatedPets = await Pet.insertMany(petPromises);
    logger.info(`${generatedPets.length} mascotas generadas e insertadas`);

    // Responder con los usuarios y mascotas generados
    res.status(200).json({ generatedUsers, generatedPets });
  } catch (err) {
    logger.error(`Error al generar datos: ${err.message}`);
    res.status(400).json({ error: err.message });
  }
});

// Endpoint para probar los diferentes niveles de log
router.get("/loggerTest", (req, res) => {
  logger.debug("Este es un mensaje de debug");
  logger.http("Este es un mensaje de http");
  logger.info("Este es un mensaje de info");
  logger.warning("Este es un mensaje de warning");
  logger.error("Este es un mensaje de error");
  logger.fatal("Este es un mensaje de fatal");

  res.send(
    "Prueba de niveles de logger realizada, revisa la consola y el archivo de logs."
  );
});

export default router;
