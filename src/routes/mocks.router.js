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
// Endpoint para generar usuarios y mascotas y eliminarlos antes de insertar nuevos
router.post("/generateData", async (req, res) => {
  logger.info("Accediendo al endpoint /generateData");

  try {
    const { users, pets } = req.body;

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
    const generatedPets = await Pet.insertMany(petPromises);
    logger.info(`${generatedPets.length} mascotas generadas e insertadas`);

    res.json({ generatedUsers, generatedPets });
  } catch (err) {
    logger.error(`Error al generar datos: ${err.message}`);
    res.status(500).json({ error: "Error al generar datos" });
  }
});

export default router;
