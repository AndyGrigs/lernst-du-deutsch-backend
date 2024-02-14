import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import mongoose from "mongoose";

import {
  createModule,
  deleteOneModule,
  getModuleExercises,
  getModules,
  getOneModule,
  updateOneModule,
} from "./controllers/moduleController.js";

import {
  createExercise,
  updateExerciseField,
  updateOneExercise,
  getExercises,
  getOneExercise,
  deleteOneExercise,
} from "./controllers/exerciseController.js";

import { registerValidation } from "./validations/auth.js";
import { loginValidation } from "./validations/login.js";

import checkAuth from "./utils/checkAuth.js";
import {
  register,
  login,
  getMe,
  updateExerciseProgress,
  createExerciseProgress,
  getUserExerciseProgressByExerciseId,
  createModuleProgress,
  updateModuleProgress,
} from "./controllers/userController.js";
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

app.post("/add-module", createModule);
app.get("/modules", getModules);
app.get("/modules/:moduleId", getOneModule);
app.get("/modules/:moduleId/exercises", getModuleExercises);
app.put("/modules/edit/:moduleId", updateOneModule);
app.delete("/modules/delete/:moduleId", deleteOneModule);

app.post("/exercises", createExercise);
app.get("/exercises", getExercises);
app.get("/exercises/:exerciseId", getOneExercise);
app.put("/exercises/:exerciseId", updateOneExercise);
app.put("/exercises/:exerciseId/:taskId/update-field", updateExerciseField);
app.delete("/exercises/:exerciseId", deleteOneExercise);

//app.get("/progress/module/:userId", getUserModuleProgress);
//app.post("/progress/module/update/:userId", updateUserModuleProgress);

app.post("/progress/exercise/create/:userId", createExerciseProgress);
app.put("/progress/exercise/update/:userId", updateExerciseProgress);
app.get(
  "/progress/exercise/:userId/:exerciseId",
  getUserExerciseProgressByExerciseId
);
app.post("/progress/module/create/:userId", createModuleProgress);
app.put("/progress/module/update/:userId", updateModuleProgress);

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
