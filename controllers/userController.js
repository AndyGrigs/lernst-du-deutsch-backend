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

export const getUserModuleProgress = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    res.json(user.progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Angenommen, diese Funktionen sind Teil eines Express-Routers

// Funktion zum Aktualisieren des Übungsfortschritts
/*
export const updateExerciseProgress = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { exerciseId, newProgress } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      console.log(`User with ID ${userId} not found.`);
      return res.status(404).send("Benutzer nicht gefunden");
    }

    console.log(`Received exerciseId: ${exerciseId}`);
    console.log(
      `Current exerciseProgress keys: ${Array.from(
        user.exerciseProgress.keys()
      )}`
    );

    let exerciseProgress = user.exerciseProgress.get(exerciseId);
    if (!exerciseProgress) {
      console.log(
        `Exercise with ID ${exerciseId} not found in user's exerciseProgress. Creating a new entry.`
      );
      exerciseProgress = {
        exerciseId: exerciseId,
        progress: 0,
        completed: "not_started",
      };
      user.exerciseProgress.set(exerciseId, exerciseProgress);
    }

    exerciseProgress.progress = newProgress;
    exerciseProgress.completed =
      newProgress >= 100 ? "completed" : "in_progress";

    await user.save();
    return res.status(200).send("Übungsfortschritt erfolgreich aktualisiert.");
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Übungsfortschritts:", error);
    return res.status(500).send("Interner Serverfehler");
  }
};*/
/*

export const createExerciseProgress = async (req, res) => {
  const { userId } = req.params;
  const { exerciseId, progress, completed } = req.body;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    const exerciseProgressEntry = {
      id: exerciseId,
      progress,
      completed,
    };

    user.exerciseProgress.set(exerciseId, exerciseProgressEntry);
    await user.save();

    res
      .status(200)
      .send({ message: "Exercise progress created successfully." });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error creating exercise progress.", error });
  }
};
*/

export const createExerciseProgress = async (req, res) => {
  try {
    // Log the request body to verify the structure
    console.log("Request Body:", req.body);

    const { userId } = req.params;
    const { exerciseId, progress, completed } = req.body;

    // Validate the input data
    if (
      typeof exerciseId === "undefined" ||
      typeof progress === "undefined" ||
      typeof completed === "undefined"
    ) {
      console.log("Validation failed:", { exerciseId, progress, completed });
      return res.status(400).send("Missing required fields");
    }

    // Find the user by ID
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Create a new progress object based on the schema
    const newProgress = {
      exerciseId,
      progress,
      completed,
    };
    console.log(user.exerciseProgress);
    // Send a success response
    res.status(200).send("success");
  } catch (error) {
    // Handle errors
    console.error("Error in createExerciseProgress:", error);
    res.status(500).send({
      message: "An error occurred while creating exercise progress",
      error,
    });
  }
};
export const updateExerciseProgress = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { exerciseId, newProgress } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      console.log(`User with ID ${userId} not found.`);
      return res.status(404).send("Benutzer nicht gefunden");
    }

    console.log(`Received exerciseId: ${exerciseId}`);
    console.log(
      `Current exerciseProgress keys: ${Array.from(
        user.exerciseProgress.keys()
      )}`
    );

    let exerciseProgress = user.exerciseProgress.get(exerciseId);
    if (!exerciseProgress) {
      console.log(
        `Exercise with ID ${exerciseId} not found in user's exerciseProgress. Creating a new entry.`
      );
      exerciseProgress = {
        exerciseId: exerciseId,
        progress: 0,
        completed: "not_started",
      };
      user.exerciseProgress.set(exerciseId, exerciseProgress);
    }

    exerciseProgress.progress = newProgress;
    exerciseProgress.completed =
      newProgress >= 100 ? "completed" : "in_progress";

    await user.save();
    return res.status(200).send("Übungsfortschritt erflgreich aktualisiert.");
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Übungsfortschritts:", error);
    return res.status(500).send("Interner Serverfehler");
  }
};
// Funktion zum Aktualisieren des Modulfortschritts
export const updateModuleProgress = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { moduleId, newProgress } = req.body; // Angenommen, diese Daten werden im Body gesendet

    // Hier würde Ihre Logik zur Suche des Benutzers und Aktualisierung des Fortschritts stehen
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).send("Benutzer nicht gefunden");
    }

    const moduleProgress = user.moduleProgress.get(moduleId);
    if (!moduleProgress) {
      return res.status(404).send("Modul nicht gefunden");
    }

    moduleProgress.progress = newProgress;
    moduleProgress.completed = newProgress >= 100;

    await user.save();
    return res.status(200).send("Modulfortschritt erfolgreich aktualisiert.");
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Modulfortschritts:", error);
    return res.status(500).send("Interner Serverfehler");
  }
};

/*
export const updateUserModuleProgress = async (req, res) => {
  try {
    const { moduleId, progress, completed } = req.body;
    const user = await UserModel.findById(req.params.userId);

    user.progress.set(moduleId, { moduleId, progress, completed });
    await user.save();

    res.status(200).json({ message: "Progress updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateModuleProgress = async (userId, moduleId, newProgress) => {
  try {
    const user = await User.findById(userId);
    const moduleIndex = user.moduleProgress.findIndex(
      (mp) => mp.id === moduleId
    );

    if (moduleIndex !== -1) {
      user.moduleProgress[moduleIndex].progress = newProgress;
      user.moduleProgress[moduleIndex].completed = newProgress >= 100;
      await user.save();
      return "Modulfortschritt erfolgreich aktualisiert.";
    } else {
      return "Modul nicht gefunden.";
    }
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Modulfortschritts:", error);
    throw error;
  }
};

export const updateExerciseProgress = async (
  userId,
  exerciseId,
  newProgress
) => {
  try {
    const user = await User.findById(userId);
    const exerciseIndex = user.exerciseProgress.findIndex(
      (ep) => ep.id === exerciseId
    );

    if (exerciseIndex !== -1) {
      user.exerciseProgress[exerciseIndex].progress = newProgress;
      user.exerciseProgress[exerciseIndex].completed = newProgress >= 100;
      await user.save();
      return "Übungsfortschritt erfolgreich aktualisiert.";
    } else {
      return "Übung nicht gefunden.";
    }
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Übungsfortschritts:", error);
    throw error;
  }
};
*/
/*
export const updateExerciseProgress = async (req, res) => {
  try {
    const { userId, exercise } = req.body;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.exerciseProgress.set(exercise.moduleId, {
      moduleId: exercise.moduleId,
      progress: exercise.progress,
      completed: exercise.completed
    });

    await user.save();
    res.status(200).json({ message: 'Exercise progress created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserExerciseProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.findById(userId).select('+exerciseProgress');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.exerciseProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
*/
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

// export const updateUserProgress = async (req, res) => {
//   try {
//     const { moduleId, exerciseId, exerciseProgress, exerciseCompleted } = req.body;
//     const user = await UserModel.findById(req.params.userId);

//     // Find the module and check if the exerciseId exists in the exercises array
//     const module = user.progress.get(moduleId);
//     if (!module || !module.exercises.includes(exerciseId)) {
//       return res.status(404).json({ message: "Module or exercise not found!" });
//     }

//     // Fetch the exercise details from the "exercises" collection
//     const exercise = await ExerciseModel.findById(exerciseId);
//     if (!exercise) {
//       return res.status(404).json({ message: "Exercise not found!" });
//     }

//     // Update the exercise with the new progress and completion status
//     exercise.progress = exerciseProgress;
//     exercise.completed = exerciseCompleted;

//     // Save the updated exercise back to the database
//     await exercise.save();

//     // Update the user's progress map with the new exercise details
//     // Since the exercises are stored as IDs, you would typically not store the exercise details in the user's progress map
//     // Instead, you might store a reference to the exercise ID and fetch the details when needed
//     // For demonstration purposes, let's assume you want to store the exercise details in the user's progress map
//     const exerciseDetails = {
//       exerciseId: exercise._id,
//       progress: exerciseProgress,
//       completed: exerciseCompleted
//     };
//     module.exercises = module.exercises.map(id => id === exerciseId ? exerciseDetails : id);

//     // Mark the progress map as modified so that Mongoose knows to save the changes
//     user.markModified('progress');

//     // Save the updated user document
//     await user.save();

//     res.status(200).json({ message: "Exercise progress updated successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
