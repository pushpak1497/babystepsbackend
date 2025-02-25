import express from "express";
import cors from "cors";
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json({ limit: "30mb" }));
import doctorRouter from "./src/routes/doctor.routes.js";
import appointmentRouter from "./src/routes/appointment.router.js";
app.use("/api", doctorRouter, appointmentRouter);

export { app };
