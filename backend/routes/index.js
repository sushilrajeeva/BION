import express from "express";
import authRoutes from "./auth_routes.js";

const router = express.Router();

router.use("/", authRoutes);

router.use("*", (req, res) => {
  res.sendStatus(404);
});

export default router;
