import mongoose, { Schema } from "mongoose";

const doctorSchema = new Schema(
  {
    name: { type: String, required: true },
    workingHours: {
      start: { type: String, required: true },
      end: { type: String, required: true },
    },
    specialization: { type: String, default: "General" },
  },
  { timestamps: true }
);

export const Doctor = mongoose.model("Doctor", doctorSchema);
