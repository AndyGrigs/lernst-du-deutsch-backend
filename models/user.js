import mongoose from "mongoose";

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
          type: Boolean,
          default: false,
        },
      },
    ],
    exerciseProgress: [
      {
        exerciseId: { type: String, required: true },
        exerciseNumber: { type: Number },
        exerciseAnswers: {
          type: Map,
          of: Boolean,
          default: {},
        },
        progress: {
          type: Number,
          min: 0,
          max: 100,
          default: 0,
        },
        completed: {
          type: Boolean,
          default: false,
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
