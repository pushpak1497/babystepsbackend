import mongoose, { Schema } from "mongoose";

const appointmentSchema = new Schema(
  {
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    date: { type: Date, required: true },
    duration: { type: Number, required: true },
    appointmentType: { type: String, required: true },
    patientName: { type: String, required: true },
    notes: { type: String },
  },
  { timestamps: true }
);
export const Appointment = mongoose.model("Appointment", appointmentSchema);
