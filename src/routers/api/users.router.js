import { Router } from "express";
import { User } from "../../models/User.js";
import { onlyLoggedInAPI } from "../../middlewares/sessions.js";

export const usersRouter = Router();

/*
 *
 * MIDDLEWARE AT ROUTER LEVEL
 *
 */

usersRouter.post("/", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ status: "success", payload: user });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

// We need to integrate a middleware of AUTHORIZATION of so that only allowed user can access to that
usersRouter.get("/current", onlyLoggedInAPI, async (req, res) => {
  const user = await User.findOne(
    { email: req.session["user"].email },
    { password: 0 } //not include password
  ).lean();
  res.json({ status: "success", payload: user });
});
