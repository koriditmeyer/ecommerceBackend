import { Router } from "express";
import passport from "passport";

import { User } from "../../models/User.js";
import { onlyLoggedInWeb } from "../../middlewares/auth.js";

export const usersRouter = Router();

usersRouter.get("/register", async (req, res) => {
  res.render("register.handlebars", {
    pageTitle: "Register",
  });
});

usersRouter.post(
  "/register",
  passport.authenticate("register", {
    successRedirect: "/profile",
    failureRedirect: "/register",
  })
);

// We need to integrate a middleware of AUTHORIZATION of so that only allowed user can access to that
usersRouter.get("/profile", onlyLoggedInWeb, async (req, res) => {
  let session
  try {
    const rawSessionId = req.cookies['connect.sid'];
    if (rawSessionId) {
      // URL-decode and extract the signature part
      const decodedSessionId = decodeURIComponent(rawSessionId);
      const signature = decodedSessionId.split('.')[1]; // Assuming the format is always correct
      session ={
        sessionID: req.sessionID,
        signature: signature,
        cookie: req.cookies['connect.sid']
      }
    }
    let userDB
    try {
      userDB = await User.findOne({ email: req.user.email }).lean();
    } catch (error) {
      console.log(error.message)
    }

    res.render("profile.handlebars", {
      pageTitle: "Profile",
      user: req.user,
      session: session,
      userDB: userDB
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
