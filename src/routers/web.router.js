import { Router } from "express";
import upload from "../middlewares/multer.js";

export const webRouter = Router();

webRouter.post("/uploads", upload.single("image"), (req, res) => {
  res.json({
    file: req.file,
  });
});
