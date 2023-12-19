import { Router } from "express";
import passport from "passport";

export const sessionsRouter = Router();

sessionsRouter.get("/login", async (req, res) => {
  /* Render view */
  res.render("login", {
    title: "Login",
  });
});

//same as API but instead of json return views
sessionsRouter.post(
  "/login",
  passport.authenticate("login", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  })
);

sessionsRouter.post("/logout", (req, res) => {
  req.logout((error) => {
    if (error) {
      console.log(error);
    }
    res.redirect("/login");
  });
});
