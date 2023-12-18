import { Router } from "express";
import { User } from "../../models/User.js";
import { onlyLoggedInAPI } from "../../middlewares/sessions.js";
import { hash } from "../../utils/crypto.js";

export const usersRouter = Router();

usersRouter.get("/register", async (req, res) => {
  res.render("register.handlebars", {
    pageTitle: "Register",
  });
});

usersRouter.post("/register", async (req, res) => {
  try {
    //! encrypt password!
    req.body.password = hash(req.body.password);

    await User.create(req.body);
    res.redirect("/login");
  } catch (error) {
    res.redirect("/register");
    console.log(error.message);
  }
});

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

usersRouter.post("/resetpassword", async (req, res) => {
  try {
    //! encrypt password!
    req.body.password = hash(req.body.password);

    const updatedUser = await User.updateOne(
      { email: req.body.email },
      { $set: { password: req.body.password } },
      { new: true }
    ).lean();

    if (updatedUser.matchedCount === 0) {
      console.log("User not found");
    } else if (updatedUser.modifiedCount === 0) {
      console.log("User found but no changes were made");
    } else {
      console.log("User password updated successfully");
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error);
    res.redirect("/resetpassword");
  }
});
