import mongoose from "mongoose";

const ProgressSchema = new mongoose.Schema(
  {
    id: String,
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    completed: {
      type: String,
      enum: ["in_progress", "completed", "not_started"],
      default: "not_started",
    },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },

    moduleProgress: [
      {
        moduleId: { type: String, required: true },
        moduleNumber: { type: Number },
        progress: {
          type: Number,
          min: 0,
          max: 100,
          default: 0,
        },
        completed: {
          type: String,
          enum: ["in_progress", "completed", "not_started"],
          default: "not_started",
        },
      },
    ],
    exerciseProgress: [
      {
        exerciseId: { type: String, required: true },
        exerciseNumber: { type: Number },
        progress: {
          type: Number,
          min: 0,
          max: 100,
          default: 0,
        },
        completed: {
          type: String,
          enum: ["in_progress", "completed", "not_started"],
          default: "not_started",
        },
      },
    ],

    avatarUrl: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
