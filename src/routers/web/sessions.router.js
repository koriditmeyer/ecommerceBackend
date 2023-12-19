import { Router } from "express";
import { User } from "../../models/User.js";

export const sessionsRouter = Router();

sessionsRouter.get("/login", async (req, res) => {
  /* Render view */
  res.render("login", {
    title: "Login",
  });
});

//same as API but instead of json return views
sessionsRouter.post("/login",
  // DIVIDE MIDDLEWARE IN 2 FUNCTIONS
  // 1st FUNCTION
  async (req, res, next) => {
    const { email, password } = req.body;
    let userData;
    try {
      userData = await User.authenticate(email, password);
      req.session["user"] = userData;
      next();
    } catch (error) {
      console.log(error.message);
      res.redirect("/login");
    }
  },
  // 2nd FUNCTION of success
  (req, res) => {
    res.redirect("/profile");
  }
);

sessionsRouter.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    res.redirect("/login");
  });
});
