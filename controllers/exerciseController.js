import { Exercise } from "../models/exercise.js";

export const createExercise = async (req, res) => {
  try {
    const exerciseData = new Exercise({
      instruction: req.body.instruction,
      content: req.body.content,
      // Add other fields as needed
    });

    const result = await exerciseData.save();
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
