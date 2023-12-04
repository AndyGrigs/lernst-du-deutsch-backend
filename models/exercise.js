import mongoose from "mongoose";

const gapSchema = new mongoose.Schema({
  placeholder: String,
  correctAnswer: String,
});

const sentenceSchema = new mongoose.Schema({
  original: String,
  translations: [String], // Changed to an array of strings
  gaps: [gapSchema],
});

const exerciseSchema = new mongoose.Schema({
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Module",
    required: true,
  },
  sentences: [sentenceSchema],
});

const ExerciseModel = mongoose.model("Exercise", exerciseSchema);

export default ExerciseModel;
