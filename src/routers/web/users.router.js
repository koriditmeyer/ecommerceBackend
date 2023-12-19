import { Router } from "express";
import { User } from "../../models/User.js";
import { onlyLoggedInAPI } from "../../middlewares/auth.js";

export const usersRouter = Router();

usersRouter.get("/register", async (req, res) => {
  res.render("register.handlebars", {
    pageTitle: "Register",
  });
});

usersRouter.post(
  "/register",
  // DIVIDE MIDDLEWARE IN 2 FUNCTIONS
  // 1st FUNCTION
  async (req, res, next) => {
    try {
      await User.register(req.body);
      next();
    } catch (error) {
      console.log(error.message);
      res.redirect("/register");
    }
  },
  // 2nd FUNCTION of success
  (req, res) => {
    res.redirect("/login");
  }
);

// We need to integrate a middleware of AUTHORIZATION of so that only allowed user can access to that
usersRouter.get("/profile", onlyLoggedInAPI, async (req, res) => {
  try {
    res.render("profile.handlebars", {
      pageTitle: "Profile",
      user: req.session["user"],
    });
  } catch (error) {
    res.redirect("/login");
  }
});

usersRouter.get("/resetpassword", (req, res) => {
  res.render("resetpassword.handlebars", {
    pageTitle: "Reset password",
  });
});

usersRouter.post(
  "/resetpassword",
  async (req, res, next) => {
    const { email, password } = req.body;
    try {
      await User.resetPassword(email, password);
      next();
    } catch (error) {
      console.log(error);
      res.redirect("/resetpassword");
    }
  },
  (req, res) => {
    res.redirect("/login");
  }
);
