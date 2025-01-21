// models/App.js
import mongoose from "mongoose";
import User from "@/models/User";
import Subject from "@/models/Subject";

const ExamPaperSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    year: {
      type: String,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Subject,
      required: true,
    },
    banner_url: {
      type: String,
    },
    is_published: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.ExamPaper ||
  mongoose.model("ExamPaper", ExamPaperSchema);
