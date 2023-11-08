import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const products = {};
  } catch (error) {
    res.json({
      status: "error",
      message: error.message,
    });
  }
});

export default router;
