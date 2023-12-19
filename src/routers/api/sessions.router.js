import { Router } from "express";
import passport from "passport";

export const sessionsRouter = Router();

/*
 *
 * MIDDLEWARE AT ROUTER LEVEL
 *
 */
sessionsRouter.post(
  "/login",
  passport.authenticate("login", {
    failWithError: true,
  }),
  function (req, res) {
    res.status(201).json({ status: "success", payload: req.user });
  },
  function (error, req, res, next) {
    res.status(401).json({
      status: "error",
      message: "login failed",
    });
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
  req.logout((error) => {
    if (error) {
      return res
        .status(500)
        .json({ status: "logout error", body: error });
    }
    res.status(201).json({ status: "success", message: "Logout OK" });
  });
});
