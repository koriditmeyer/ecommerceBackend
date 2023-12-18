import { Router } from "express";
import { User } from "../../models/User.js";
import { onlyLoggedInAPI } from "../../middlewares/sessions.js";
import { hash } from "../../utils/crypto.js";

export const usersRouter = Router();

/*
 *
 * MIDDLEWARE AT ROUTER LEVEL
 *
 */

usersRouter.post("/", async (req, res) => {
  try {
    //! encrypt password!
    req.body.password = hash(req.body.password);

    const user = await User.create(req.body);
    res.status(201).json({ status: "success", payload: user });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

// We need to integrate a middleware of AUTHORIZATION of so that only allowed user can access to that
usersRouter.get("/profile", onlyLoggedInAPI, async (req, res) => {
  const user = await User.findOne(
    { email: req.session["user"].email },
    { password: 0 } //not include password
  ).lean();
  res.json({ status: "success", payload: user });
});

usersRouter.put("/", async function (req, res) {
  try {
    //! encrypt password!
    req.body.password = hash(req.body.password);

    const updatedUser = await User.updateOne(
      { email: req.body.email },
      { $set: { password: req.body.password } },
      { new: true }
    );

    if (updatedUser.matchedCount === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "user not found" });
    } else if (updatedUser.modifiedCount === 0) {
      return res.status(404).json({
        status: "error",
        message: "user found but no changes where made",
      });
    } else {
      res.status(201).json({ status: "success", payload: updatedUser });
    }
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});
