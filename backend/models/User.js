import mongoose from "mongoose";

// ---------------- User Schema ----------------
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "" },
    socialLinks: { type: [String], default: [] },

    contestsParticipated: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Contest" },
    ],
    problemSolved: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
    contestHistory: [
      { type: mongoose.Schema.Types.ObjectId, ref: "ContestResult" },
    ],
  },
  { timestamps: true }
);

// ---------------- Question Schema ----------------
const QuestionSchema = new mongoose.Schema(
  {
    quesNo: { type: Number, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },

    testcases: [{ type: mongoose.Schema.Types.ObjectId, ref: "Testcase" }],
    attemptedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    solvedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    tags: { type: [String], default: [] },
    constraints: { type: [String], default: [] },
    points: { type: Number, required: true },

    templateCode: {
      Python: { type: String, default: "" },
      Java: { type: String, default: "" },
      Cpp: { type: String, default: "" },
    },
    wrapperCode: {
      Python: { type: String, default: "" },
      Java: { type: String, default: "" },
      Cpp: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

// ---------------- Testcase Schema ----------------
const TestcaseSchema = new mongoose.Schema(
  {
    input: { type: [String], required: true },
    output: { type: String, required: true },
    explanation: { type: String, default: "" },
    forQuestion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
  },
  { timestamps: true }
);

// ---------------- Contest Schema ----------------
const ContestSchema = new mongoose.Schema(
  {
    contestNumber: { type: Number, required: true, unique: true, index: true },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
    contestDate: { type: Date, required: true },

    attemptedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    registeredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    status: {
      type: String,
      enum: ["upcoming", "current", "completed"],
      default: "upcoming",
    },
  },
  { timestamps: true }
);

// ---------------- ContestResult Schema ----------------
const ContestResultSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    contest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contest",
      required: true,
    },
    score: { type: Number, required: true },
    solvedQuestions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
    totalTime: { type: Number },
    rank: { type: Number },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);
export const Question = mongoose.model("Question", QuestionSchema);
export const Testcase = mongoose.model("Testcase", TestcaseSchema);
export const Contest = mongoose.model("Contest", ContestSchema);
export const ContestResult = mongoose.model(
  "ContestResult",
  ContestResultSchema
);
