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

// import {
//   createExercise,
//   deleteOneExercise,
//   getExercises,
//   getOneExercise,
//   updateOneExercise,
//   getExercisesByModule,
// } from "./controllers/exerciseController.js";

import { registerValidation } from "./validations/auth.js";
import { loginValidation } from "./validations/login.js";

import checkAuth from "./utils/checkAuth.js";
import { register, login, getMe } from "./controllers/userController.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";
//import Exercise from "./models/exercise.js";

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
//app.post("/modules", createModule);
// Роут для отримання всіх модулів
app.get("/modules", getModules);
// Роут для отримання конкретного модуля за його ідентифікатором
app.get("/modules/:moduleId", getOneModule);
// Роут для оновлення модуля за його ідентифікатором
app.put("/modules/:moduleId", updateOneModule);
// Роут для видалення модуля за його ідентифікатором
app.delete("/modules/:moduleId", deleteOneModule);

// // New route for exercises related to a specific module
// app.get("/modules/:moduleId/exercises", getExercisesByModule);

// // Routes for exercises
// app.post("/exercises", createExercise);
// app.get("/exercises", getExercises);
// app.get("/exercises/:exerciseId", getOneExercise);
// app.put("/exercises/:exerciseId", updateOneExercise);
// app.delete("/exercises/:exerciseId", deleteOneExercise);

const taskSchema = new mongoose.Schema({
  content: String,
  solution: String,
});

const Task = mongoose.model("Task", taskSchema);

app.post("/exercises", async (req, res) => {
  try {
    const { instruction, tasks } = req.body;

    // Create tasks
    const createdTasks = await Task.insertMany(tasks);
    // After creating tasks
    console.log("createdTasks:", createdTasks);

    // Extract task IDs
    const taskIds = createdTasks.map((task) => task._id);
    // After extracting task IDs
    console.log("taskIds:", taskIds);

    // Create exercise with associated task IDs
    const exerciseData = new Exercise({
      instruction,
      tasks: taskIds,
    });
    // After creating exercise with associated task IDs
    console.log("exerciseData:", exerciseData);

    const createdExercise = await exerciseData.save();

    // After saving exercise
    console.log("createdExercise:", createdExercise);

    // Populate the tasks field in the created exercise
    // const populatedExercise = await Exercise.findById(
    //   createdExercise._id
    // ).populate("tasks");

    // res.status(201).json(populatedExercise);

    // Populate the tasks field in the created exercise
    const populatedExercise = await Exercise.findById(createdExercise._id)
      .populate("tasks")
      .lean();

    res.status(201).json(populatedExercise);
  } catch (error) {
    console.error("Error creating exercise:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const exerciseSchema = new mongoose.Schema({
  instruction: String,
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
});

const Exercise = mongoose.model("Exercise", exerciseSchema);

const vocabularySchema = new mongoose.Schema({
  word: String,
  translation: String,
});

const Vocabulary = mongoose.model("Vocabulary", vocabularySchema);

const moduleSchema = new mongoose.Schema({
  name: String,
  text: {
    title: String,
    content: String,
  },
  moduleGrammar: [String],
  videos: [String],
  vocabulary: [Vocabulary.schema],
  exercises: [{ type: mongoose.Schema.Types.ObjectId, ref: "Exercise" }],
});

// app.post("/modules", async (req, res) => {
//   try {
//     const { name, text, moduleGrammar, videos, vocabulary, exercises } =
//       req.body;

//     // Create exercises
//     const createdExercises = await Exercise.insertMany(exercises);

//     // Extract exercise IDs
//     const exerciseIds = createdExercises.map((exercise) => exercise._id);

//     // Create module with associated exercise IDs
//     const moduleData = new Module({
//       name,
//       text,
//       moduleGrammar,
//       videos,
//       vocabulary,
//       exercises: exerciseIds,
//     });

//     const createdModule = await moduleData.save();

//     // Respond with the created module, including populated exercises
//     const populatedModule = await Module.findById(createdModule._id).populate(
//       "exercises"
//     );

//     res.status(201).json(populatedModule);
//   } catch (error) {
//     console.error("Error creating module:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

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
