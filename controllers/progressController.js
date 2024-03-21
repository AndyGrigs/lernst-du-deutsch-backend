import UserModel from "../models/user.js";

export const createExerciseProgress = async (req, res) => {
  try {
    // Extract data from the request body
    const {
      exerciseId,
      exerciseNumber,
      moduleName,
      exerciseAnswers,
      progress,
      completed,
    } = req.body;
    const userId = req.params.userId;
    console.log(exerciseId);
    if (!exerciseId || !exerciseNumber || !progress) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find the user by ID
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const exerciseProgress = {
      exerciseId,
      moduleName,
      exerciseNumber,
      exerciseAnswers,
      progress,
      completed,
    };

    user.exerciseProgress.push(exerciseProgress);

    await user.save();

    res.status(201).json({
      message: "Exercise progress created successfully",
      exerciseProgress,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while creating exercise progress" });
  }
};

export const getUserExerciseProgress = async (req, res) => {
  try {
    const userId = req.params.userId;
    const exerciseId = req.params.exerciseId;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const progressObject = user.exerciseProgress.find(
      (progressObj) => progressObj.exerciseId === exerciseId
    );

    if (!progressObject) {
      return res.status(404).json({ message: "Exercise progress not found" });
    }

    res.status(200).json(progressObject);
  } catch (error) {
    console.error("Error in getUserExerciseProgress", error);
    res.status(500).json({
      message: "An error occurred while retrieving exercise progress",
    });
  }
};

export const getAllExerciseProgress = async (req, res) => {
  try {
    // Extract the user ID from the request parameters
    const userId = req.params.userId;

    // Find the user by ID
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the exerciseProgress array
    res.status(200).json(user.exerciseProgress);
  } catch (error) {
    console.error("Error in getAllExerciseProgress:", error);
    res.status(500).json({
      message: "An error occurred while retrieving exercise progress",
      error,
    });
  }
};

export const updateExerciseProgress = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { exerciseId, progress, exerciseAnswers, completed } = req.body;
    if (!exerciseId || !exerciseAnswers || !progress) {
      return res.status(404).send("Missing field!");
    }
    // Find the user by ID
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Locate the progress object for the given exerciseId
    const progressIndex = user.exerciseProgress.findIndex(
      (progressObj) => progressObj.exerciseId === exerciseId
    );

    // If the progress object is not found, return an error
    if (progressIndex === -1) {
      return res.status(404).send("Exercise progress not found");
    }

    // Update the progress and completed fields
    user.exerciseProgress[progressIndex].progress = progress;
    user.exerciseProgress[progressIndex].completed = completed;
    user.exerciseProgress[progressIndex].exerciseAnswers = exerciseAnswers;

    // Save the updated user document
    await user.save();

    // Retrieve the updated user document
    const updatedUser = await UserModel.findById(userId);

    // Send the updated user object as a response
    res.status(200).json(updatedUser);
  } catch (error) {
    // Handle errors
    console.error("Error in updateExerciseProgress:", error);
    res.status(500).send({
      message: "An error occurred while updating exercise progress",
      error,
    });
  }
};

// export const updateExerciseAnswers = async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const exerciseId = req.params.exerciseId;
//     const { exerciseAnswers } = req.body;

//     // Validate the data
//     if (!userId || !exerciseId || !exerciseAnswers) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // Find the user by ID
//     const user = await UserModel.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Locate the progress object for the given exerciseId
//     const progressIndex = user.exerciseProgress.findIndex(
//       (progressObj) => progressObj.exerciseId === exerciseId
//     );

//     // If the progress object is not found, return an error
//     if (progressIndex === -1) {
//       return res.status(404).json({ message: "Exercise progress not found" });
//     }

//     // Update the exerciseAnswers field
//     user.exerciseProgress[progressIndex].exerciseAnswers = exerciseAnswers;

//     // Save the updated user document
//     await user.save();

//     // Retrieve the updated user document
//     const updatedUser = await UserModel.findById(userId);

//     // Send the updated user object as a response
//     res.status(200).json(updatedUser);
//   } catch (error) {
//     console.error("Error in updateExerciseAnswers:", error);
//     res.status(500).send({
//       message: "An error occurred while updating exercise answers",
//       error,
//     });
//   }
// };

export const createModuleProgress = async (req, res) => {
  try {
    const { moduleId, moduleNumber, progress, completed } = req.body;
    const userId = req.params.userId;
    if (!moduleId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const moduleProgress = {
      moduleId,
      moduleNumber,
      progress,
      completed,
    };

    user.moduleProgress.push(moduleProgress);

    await user.save();

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while creating exercise progress" });
  }
};

export const getUserModuleProgress = async (req, res) => {
  try {
    const userId = req.params.userId;
    const moduleId = req.params.exerciseId;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const progressObject = user.moduleProgress.find(
      (progressObj) => progressObj.moduleId === moduleId
    );

    if (!progressObject) {
      return res.status(404).json({ message: "module progress not found" });
    }

    res.status(200).json(progressObject);
  } catch (error) {
    console.error("Error in getUserExerciseProgress", error);
    res.status(500).json({
      message: "An error occurred while retrieving exercise progress",
    });
  }
};

export const getAllModuleProgress = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.moduleProgress);
  } catch (error) {
    console.error("Error in getAllModuleProgress:", error);
    res.status(500).json({
      message: "An error occurred while retrieving exercise progress",
      error,
    });
  }
};

export const updateModuleProgress = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { moduleId, progress, completed } = req.body;

    // Find the user by ID
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Locate the progress object for the given exerciseId
    const progressIndex = user.moduleProgress.findIndex(
      (progressObj) => progressObj.moduleId === moduleId
    );

    // If the progress object is not found, return an error
    if (progressIndex === -1) {
      return res.status(404).send("module progress not found");
    }

    // Update the progress and completed fields
    user.moduleProgress[progressIndex].progress = progress;
    user.moduleProgress[progressIndex].completed = completed;

    // Save the updated user document
    await user.save();

    // Retrieve the updated user document
    const updatedUser = await UserModel.findById(userId);

    // Send the updated user object as a response
    res.status(200).json(updatedUser);
  } catch (error) {
    // Handle errors
    console.error("Error in updateExerciseProgress:", error);
    res.status(500).send({
      message: "An error occurred while updating exercise progress",
      error,
    });
  }
};
