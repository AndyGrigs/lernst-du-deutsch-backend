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

export const createExerciseProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    const { exerciseId, exrciseNumber, progress, completed } = req.body;

    // Find the user by ID
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Create a new progress object based on the schema
    const newProgress = {
      exerciseId,
      exrciseNumber,
      progress,
      completed,
    };

    // Use the $push operator to append the new progress object to the user's exerciseProgress array
    await UserModel.updateOne(
      { _id: userId },
      { $push: { exerciseProgress: newProgress } }
    );
    const updatedUser = await UserModel.findById(userId);

    // Send the updated user object as a response
    res.status(200).json(updatedUser);
    // // Send a success response
    // res.status(200).send("success");
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
    const { exerciseId, progress, completed } = req.body;

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

export const getUserExerciseProgress = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    res.json(user.exerciseProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateModuleProgress = async (req, res) => {};
