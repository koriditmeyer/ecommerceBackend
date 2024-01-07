import { Router } from "express";
import passport from "passport";
import { appendJwtAsCookie } from "../../middlewares/authentication.js";

export const sessionsRouter = Router();

sessionsRouter.get("/login", async (req, res) => {
  /* Render view */
  res.render("login", {
    title: "Login",
  });
});

//local
// sessionsRouter.post(
//   "/login",
//   passport.authenticate("local-login", {
//     successRedirect: "/profile",
//     failureRedirect: "/login",
//   })
// );

//github
sessionsRouter.get(
  "/githublogin",
  passport.authenticate("github", { scope: ["user:email"] })
);

sessionsRouter.get(
  "/githubcallback",
  passport.authenticate("github", {
    failWithError: true,
  }),
  appendJwtAsCookie,
  (req, res) => {
    res.redirect("/profile");
  },
  (error, req, res, next) => {
    console.log(error.message)
    res.redirect("/login");
  }
);

// sessionsRouter.get(
//   "/githubcallback",
//   passport.authenticate("github", {
//     successRedirect: "/profile",
//     failureRedirect: "/login",
//   })
// );

sessionsRouter.post("/logout", (req, res) => {
  req.logout((error) => {
    if (error) {
      console.log(error);
    }
    res.redirect("/login");
  });
});
