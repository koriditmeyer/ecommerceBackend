import { Router } from "express";
import { User } from "../../models/User.js";
import { onlyLoggedInAPI } from "../../middlewares/auth.js";

export const usersRouter = Router();

/*
 *
 * MIDDLEWARE AT ROUTER LEVEL
 *
 */

usersRouter.post(
  "/",
  // DIVIDE MIDDLEWARE IN 2 FUNCTIONS
  // 1st FUNCTION
  async (req, res, next) => {
    try {
      req.userData = await User.register(req.body);
      next();
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ status: "error", message: error.message });
    }
  },
  // 2nd FUNCTION of success
  (req, res) => {
    res.status(201).json({ status: "success", payload: req.userData });
  }
);

// We need to integrate a middleware of AUTHORIZATION of so that only allowed user can access to that
usersRouter.get("/profile", onlyLoggedInAPI, async (req, res) => {
  const user = await User.findOne(
    { email: req.session["user"].email },
    { password: 0 } //not include password
  ).lean();
  res.json({ status: "success", payload: user });
});

usersRouter.put(
  "/",
  // DIVIDE MIDDLEWARE IN 2 FUNCTIONS
  // 1st FUNCTION
  async (req, res, next) => {
    const { email, password } = req.body;
    try {
      req.userUpdated = User.resetPassword(email, password);
      next();
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ status: "error", message: error.message });
    }
  },
  // 2nd FUNCTION of success
  (req, res) => {
    res.status(201).json({ status: "success", payload: req.userUpdated});
  }
);
