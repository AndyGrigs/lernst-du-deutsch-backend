import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    content: String,
    solution: [String],
  }
  // {
  //   _id: false,
  // }
);

const exerciseSchema = new mongoose.Schema({
  number: Number,
  instruction: String,
  example: { type: String, default: "" },
  tasks: [taskSchema],
});

const Exercise = mongoose.model("Exercise", exerciseSchema);

export default Exercise;
