import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import mongoose from "mongoose";

import Module from "./models/module.js";

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
// app.post("/modules", async (req, res) => {
//   try {
//     const newModule = await Module.create(req.body);
//     res.json(newModule);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.post("/modules", async (req, res) => {
//   try {
//     // Convert strings to ObjectId
//     const moduleGrammarIds = req.body.moduleGrammar.map((id) =>
//       mongoose.Types.ObjectId(id)
//     );
//     const exercisesIds = req.body.exercises.map((id) =>
//       mongoose.Types.ObjectId(id)
//     );

// Replace the string IDs with ObjectId

app.all("/test", (req, res) => {
  // console.log(req.query);
  // console.log(req.query.name);
  // res.send(req.query);
  // console.log(req.params);
  // res.send(req.params);
  console.log(req.body);
  res.send(req.body);
});

app.post("/modules", async (req, res) => {
  try {
    console.log(req.body);
    const moduleData = new Module({
      name: req.body.name,
      moduleGrammar: req.body.moduleGrammar,
      videos: req.body.videos,
      text: {
        title: req.body.text.title,
        content: req.body.text.content,
      },
      vocabulary: req.body.vocabulary,
      exercises: req.body.exercises,
    });

    moduleData
      .save()
      .then((result) => {
        console.log(result);
        res.send(result);
      })
      .catch((err) => console.log(err));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Роут для отримання всіх модулів
app.get("/modules", async (req, res) => {
  try {
    const modules = await Module.find();
    res.json(modules);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Роут для отримання конкретного модуля за його ідентифікатором
app.get("/modules/:moduleId", async (req, res) => {
  try {
    const module = await Module.findById(req.params.moduleId);
    if (!module) {
      return res.status(404).json({ error: "Module not found" });
    }
    res.json(module);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Роут для оновлення модуля за його ідентифікатором
app.put("/modules/:moduleId", async (req, res) => {
  try {
    const updatedModule = await Module.findByIdAndUpdate(
      req.params.moduleId,
      req.body,
      { new: true }
    );
    if (!updatedModule) {
      return res.status(404).json({ error: "Module not found" });
    }
    res.json(updatedModule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Роут для видалення модуля за його ідентифікатором
app.delete("/modules/:moduleId", async (req, res) => {
  try {
    const deletedModule = await Module.findByIdAndDelete(req.params.moduleId);
    if (!deletedModule) {
      return res.status(404).json({ error: "Module not found" });
    }
    res.json(deletedModule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

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
