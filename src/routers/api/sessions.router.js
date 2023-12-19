import { Router } from "express";
import { User } from "../../models/User.js";

export const sessionsRouter = Router();

/*
 *
 * MIDDLEWARE AT ROUTER LEVEL
 *
 */
sessionsRouter.post("/login",
  // DIVIDE MIDDLEWARE IN 2 FUNCTIONS
  // 1st FUNCTION
  async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const userData = await User.authenticate(email, password);
      req.session["user"] = userData;
      next();
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({ status: "error", message: "login failed" });
    }
  },
  // 2nd FUNCTION of success
  (req, res) => {
    res.status(201).json({ status: "success", message: "login success" });
  }

);


// IF SESSION EXIST
sessionsRouter.get("/current", (req, res) => {
  if (req.session["user"]) {
    return res.json(req.session["user"]);
  }
  res.status(400).json({ status: "error", message: "Please login!" });
});

sessionsRouter.post("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({status: "logout error",body: error.message});
    }
    res.status(201).json({status: "success",message: "Logout OK"});
  });
});
