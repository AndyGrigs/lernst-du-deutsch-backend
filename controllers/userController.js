import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/user.js";
import ExerciseModel from "../models/exercise.js";

export const register = async (req, res) => {
  try {
    const existingUser = await UserModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: "E-Mail bereits registriert" });
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      passwordHash: hash,
      fullName: req.body.fullName,
      progress: new Map(),
    });
    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret999",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Ragistration failed",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ _id: user._id }, "secret999", {
      expiresIn: "30d",
    });

    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Login failed" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User is not found!",
      });
    }

    const { passwordHash, ...userData } = user._doc;
    res.json(userData);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "some error",
    });
  }
};

export const getUserProgress = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    res.json(user.progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// export const updateUserProgress = async (req, res) => {
//   try {
//     const { moduleId, progress, completed } = req.body;
//     const user = await UserModel.findById(req.params.userId);

//     user.progress.set(moduleId, { moduleId, progress, completed });
//     await user.save();

//     res.status(200).json({ message: "Progress updated successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const updateUserProgress = async (req, res) => {
//   try {
//     const { moduleId, exerciseId, exerciseProgress, exerciseCompleted } = req.body;
//     const user = await UserModel.findById(req.params.userId);

//     // Find the module and the exercise within the module
//     const module = user.progress.get(moduleId);
//     if (!module) {
//       return res.status(404).json({ message: "Module not found!" });
//     }

//     const exerciseIndex = module.exercises.findIndex(e => e.exerciseId === exerciseId);
//     if (exerciseIndex === -1) {
//       return res.status(404).json({ message: "Exercise not found!" });
//     }

//     // Update the exercise progress
//     module.exercises[exerciseIndex].progress = exerciseProgress;
//     module.exercises[exerciseIndex].completed = exerciseCompleted;

//     // Update the overall module progress based on the exercise updates
//     // This logic depends on how you define "completed" for the module
//     // For example, you might consider the module complete if all exercises are complete
//     // const allExercisesComplete = module.exercises.every(e => e.completed);
//     // module.completed = allExercisesComplete;
//     // Calculate the average progress of the exercises
//     const totalExerciseProgress = module.exercises.reduce((sum, exercise) => sum + exercise.progress, 0);
//     const averageExerciseProgress = totalExerciseProgress / module.exercises.length;

//     // Update the module's progress with the average exercise progress
//     module.progress = averageExerciseProgress;

//     // Save the updated user data
//     await user.save();

//     res.status(200).json({ message: "Exercise progress updated successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


export const updateUserProgress = async (req, res) => {
  try {
    const { moduleId, exerciseId, exerciseProgress, exerciseCompleted } = req.body;
    const user = await UserModel.findById(req.params.userId);

    // Find the module and check if the exerciseId exists in the exercises array
    const module = user.progress.get(moduleId);
    if (!module || !module.exercises.includes(exerciseId)) {
      return res.status(404).json({ message: "Module or exercise not found!" });
    }

    // Fetch the exercise details from the "exercises" collection
    const exercise = await ExerciseModel.findById(exerciseId);
    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found!" });
    }

    // Update the exercise with the new progress and completion status
    exercise.progress = exerciseProgress;
    exercise.completed = exerciseCompleted;

    // Save the updated exercise back to the database
    await exercise.save();

    // Update the user's progress map with the new exercise details
    // Since the exercises are stored as IDs, you would typically not store the exercise details in the user's progress map
    // Instead, you might store a reference to the exercise ID and fetch the details when needed
    // For demonstration purposes, let's assume you want to store the exercise details in the user's progress map
    const exerciseDetails = {
      exerciseId: exercise._id,
      progress: exerciseProgress,
      completed: exerciseCompleted
    };
    module.exercises = module.exercises.map(id => id === exerciseId ? exerciseDetails : id);

    // Mark the progress map as modified so that Mongoose knows to save the changes
    user.markModified('progress');

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: "Exercise progress updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};