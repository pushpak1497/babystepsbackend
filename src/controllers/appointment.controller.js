import { Appointment } from "../models/appointment.model.js";
import { startOfDay, endOfDay, addMinutes, isBefore, isAfter } from "date-fns";

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createAppointment = async (req, res) => {
  // console.log(req.body);
  const { appointmentData } = req.body;
  // console.log(appointmentData);

  const { id, date, duration, appointmentType, patientName, notes } =
    appointmentData;
  // console.log(typeof date);

  try {
    const appointmentStart = new Date(date);
    const appointmentEnd = addMinutes(appointmentStart, duration);

    const existingAppointments = await Appointment.find({
      id,
      date: {
        $gte: startOfDay(appointmentStart),
        $lte: endOfDay(appointmentStart),
      },
    });
    // console.log(existingAppointments);

    const overlapping = existingAppointments.some((app) => {
      const existingStart = new Date(app.date);
      const existingEnd = addMinutes(existingStart, app.duration);
      return (
        isBefore(appointmentStart, existingEnd) &&
        isAfter(appointmentEnd, existingStart)
      );
    });
    // console.log(overlapping);

    if (overlapping) {
      return res.status(400).json({ message: "Time slot is Already Booked" });
    }

    const newAppointment = await Appointment.create({
      doctorId: id,
      date,
      duration,
      appointmentType,
      patientName,
      notes,
    });
    // console.log(newAppointment);

    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const { doctorId, date, duration, appointmentType, patientName, notes } =
    req.body;

  try {
    const appointmentStart = new Date(date);
    const appointmentEnd = addMinutes(appointmentStart, duration);

    const existingAppointments = await Appointment.find({
      doctorId,
      _id: { $ne: id },
      date: {
        $gte: startOfDay(appointmentStart),
        $lte: endOfDay(appointmentStart),
      },
    });

    const overlapping = existingAppointments.some((app) => {
      const existingStart = new Date(app.date);
      const existingEnd = addMinutes(existingStart, app.duration);
      return (
        isBefore(appointmentStart, existingEnd) &&
        isAfter(appointmentEnd, existingStart)
      );
    });

    if (overlapping) {
      return res.status(400).json({ message: "Time slot is already Booked" });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { doctorId, date, duration, appointmentType, patientName, notes },
      { new: true }
    );
    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Appointment deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
