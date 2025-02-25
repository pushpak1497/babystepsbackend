import Router from "express";
import {
  createDoctor,
  getDoctors,
  getDoctorSlots,
} from "../controllers/doctor.controller.js";

const router = Router();
router.route("/doctors").get(getDoctors);
router.route("/doctors").post(createDoctor);
router.route("/doctors/:id/slots").get(getDoctorSlots);

export default router;
