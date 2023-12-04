import Exercise from "../models/exercise.js";


export const createExercise = async (req, res) => {
  try {
    const exerciseData = new Exercise(req.body);
    const result = await exerciseData.save();
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find();
    res.json(exercises);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getOneExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.exerciseId);
    if (!exercise) {
      return res.status(404).json({ error: "Exercise not found" });
    }
    res.json(exercise);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const updateOneExercise = async (req, res) => {
  try {
    const updatedExercise = await ExerciseModel.findByIdAndUpdate(
      req.params.exerciseId,
      req.body,
      { new: true }
    );
    if (!updatedExercise) {
      return res.status(404).json({ error: "Exercise not found" });
    }
    res.json(updatedExercise);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const deleteOneExercise = async (req, res) => {
  try {
    const deletedExercise = await ExerciseModel.findByIdAndDelete(req.params.exerciseId);
    if (!deletedExercise) {
      return res.status(404).json({ error: "Exercise not found" });
    }
    res.json("Exercise deleted!");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getExercisesByModule = async (req, res) => {
  try {
    const moduleId = req.params.moduleId;
    const exercises = await ExerciseModel.find({ moduleId });
    res.json(exercises);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};




