import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import mongoose from "mongoose";

import {
  createModule,
  deleteOneModule,
  getModules,
  getOneModule,
  updateOneModule,
} from "./controllers/moduleController.js";

import {
  createExercise,
  deleteOneExercise,
  getExercises,
  getOneExercise,
  updateOneExercise,
  getExercisesByModule,
} from "./controllers/exerciseController.js";

import { registerValidation } from "./validations/auth.js";
import { loginValidation } from "./validations/login.js";

import checkAuth from "./utils/checkAuth.js";
import { register, login, getMe } from "./controllers/userController.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";

dotenv.config();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("db works");
  })
  .catch((err) => {
    console.log("db error", err);
  });

const app = express();

app.use(express.json());
app.use(cors());

// // Роут для створення нового модуля
app.post("/modules", createModule);
// Роут для отримання всіх модулів
app.get("/modules", getModules);
// Роут для отримання конкретного модуля за його ідентифікатором
app.get("/modules/:moduleId", getOneModule);
// Роут для оновлення модуля за його ідентифікатором
app.put("/modules/:moduleId", updateOneModule);
// Роут для видалення модуля за його ідентифікатором
app.delete("/modules/:moduleId", deleteOneModule);

// New route for exercises related to a specific module
app.get("/modules/:moduleId/exercises", getExercisesByModule);

// Routes for exercises
app.post("/exercises", createExercise);
app.get("/exercises", getExercises);
app.get("/exercises/:exerciseId", getOneExercise);
app.put("/exercises/:exerciseId", updateOneExercise);
app.delete("/exercises/:exerciseId", deleteOneExercise);


app.post("/auth/login", loginValidation, handleValidationErrors, login);
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  register
);
app.get("/auth/me", checkAuth, getMe);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server works");
});
