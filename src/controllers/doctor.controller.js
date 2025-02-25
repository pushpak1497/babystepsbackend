import { Appointment } from "../models/appointment.model.js";
import { Doctor } from "../models/doctor.model.js";
import {
  endOfDay,
  isBefore,
  setHours,
  setMinutes,
  startOfDay,
  addMinutes,
  format,
  isAfter,
} from "date-fns";

export const createDoctor = async (req, res) => {
  const newDoctor = await Doctor.create(req.body);
  if (!newDoctor) {
    throw new Error("Error creating doctor");
  }
  res.status(201).json({ newDoctor, message: "Doctor created successfully" });
};

export const getDoctors = async (req, res) => {
  const doctors = await Doctor.find();
  if (!doctors) {
    throw new Error("No doctors found");
  }
  res.status(200).json({ doctors, message: "Doctors found successfully" });
};

export const getDoctorSlots = async (req, res) => {
  const { id } = req.params;
  const { date } = req.query;
  // console.log(date);
  // console.log(id);

  try {
    const doctor = await Doctor.findById(id);
    // console.log(doctor);

    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const appointments = await Appointment.find({
      doctorId: id,
      date: {
        $gte: startOfDay(new Date(date)),
        $lte: endOfDay(new Date(date)),
      },
    });

    const slots = [];
    const interval = 30;
    const [startHour, startMinute] = doctor.workingHours.start
      .split(":")
      .map(Number);
    // console.log(startHour, startMinute);

    const [endHour, endMinute] = doctor.workingHours.end.split(":").map(Number);
    // console.log(endHour, endMinute);

    let slotTime = setMinutes(setHours(new Date(date), startHour), startMinute);
    const endTime = setMinutes(setHours(new Date(date), endHour), endMinute);

    while (isBefore(slotTime, endTime)) {
      let slotEndTime = addMinutes(slotTime, interval);

      const overlapping = appointments.some((appointment) => {
        // console.log(appointment);
        const appointmentStart = new Date(appointment.date);
        const appointmentEnd = addMinutes(
          appointmentStart,
          appointment.duration
        );
        return (
          isBefore(slotTime, appointmentEnd) &&
          isAfter(slotEndTime, appointmentStart)
        );
      });

      if (!overlapping) {
        slots.push(format(slotTime, "HH:mm"));
      }

      slotTime = slotEndTime;
    }

    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
