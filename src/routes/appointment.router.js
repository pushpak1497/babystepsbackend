import { Router } from "express";
import {
  createAppointment,
  deleteAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
} from "../controllers/appointment.controller.js";

const router = Router();

router.route("/appointments").get(getAllAppointments);
router.route("/appointments/:id").get(getAppointmentById);
router.route("/appointments").post(createAppointment);
router.route("/appointments/:id").delete(deleteAppointment);
router.route("/appointments/:id").put(updateAppointment);

export default router;
