// models/App.js
import mongoose from "mongoose";
import User from "@/models/User";
import ExamPaper from "@/models/ExamPaper";

const ExamQuestionSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    examPaper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: ExamPaper,
      required: true,
    },
    is_published: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.ExamQuestion ||
  mongoose.model("ExamQuestion", ExamQuestionSchema);
