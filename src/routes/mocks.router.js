import { Router } from "express";
import bcrypt from "bcrypt";
import User from "../dao/models/User.js";
import Pet from "../dao/models/Pet.js";

const router = Router();

// Endpoint para generar 100 mascotas mock
router.get("/mockingpets", (req, res) => {
  const pets = [];

  for (let i = 0; i < 100; i++) {
    pets.push({
      name: `Pet${i}`,
      specie: "Dog", // Cambiar species por specie
      adopted: false,
      owner: null,
    });
  }

  res.json(pets);
});

// Endpoint para generar 50 usuarios mock
router.get("/mockingusers", async (req, res) => {
  const users = [];
  const saltRounds = 10;

  for (let i = 0; i < 50; i++) {
    const hashedPassword = await bcrypt.hash("coder123", saltRounds);
    const randomSuffix = Math.floor(Math.random() * 10000); // Generar un sufijo aleatorio

    users.push({
      username: `User${i}`,
      email: `user${i}_${randomSuffix}@example.com`, // Email con sufijo aleatorio
      first_name: `FirstName${i}`,
      last_name: `LastName${i}`,
      password: hashedPassword,
      role: i % 2 === 0 ? "admin" : "user",
      pets: [],
    });
  }

  res.json(users);
});

router.post("/generateData", async (req, res) => {
  const { users, pets } = req.body;

  const generatedUsers = [];
  for (let i = 0; i < users; i++) {
    const hashedPassword = await bcrypt.hash("coder123", 10);
    const newUser = new User({
      username: `User${i}`,
      email: `user${i}@example.com`, // Agregar email
      first_name: `FirstName${i}`, // Agregar nombre
      last_name: `LastName${i}`, // Agregar apellido
      password: hashedPassword,
      role: i % 2 === 0 ? "admin" : "user",
      pets: [],
    });
    await newUser.save();
    generatedUsers.push(newUser);
  }

  const generatedPets = [];
  for (let i = 0; i < pets; i++) {
    const newPet = new Pet({
      name: `Pet${i}`,
      specie: "Dog", // Cambiar species por specie
      adopted: false,
      owner: null,
    });
    await newPet.save();
    generatedPets.push(newPet);
  }

  res.json({ generatedUsers, generatedPets });
});

export default router;
