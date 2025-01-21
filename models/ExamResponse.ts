// models/App.js
import mongoose from "mongoose";
import User from "@/models/User";
import ExamQuestion from "@/models/ExamQuestion";

const ExamResponseSchema = new mongoose.Schema(
  {
    responder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    answerWorking: {
      type: String,
      required: true,
    },
    cornerstoneNotes: {
      type: String,
      required: true,
    },
    supplementalNotes: {
      type: String,
      required: true,
    },
    examQuestion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: ExamQuestion,
      required: true,
    },
    is_published: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.ExamResponse ||
  mongoose.model("ExamResponse", ExamResponseSchema);
