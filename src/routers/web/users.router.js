import { Router } from "express";
import passport from "passport";
import { usersManager } from "../../models/index.js";
import { 
  // onlyLoggedInWeb, 
  usersOnly } from "../../middlewares/authorization.js";
import { JWT_PRIVATE_KEY } from "../../config/config.js";

export const usersRouter = Router();

usersRouter.get("/register", async (req, res) => {
  res.render("register.handlebars", {
    pageTitle: "Register",
  });
});

// usersRouter.post(
//   "/register",
//   passport.authenticate("register", {
//     successRedirect: "/profile",
//     failureRedirect: "/register",
//   })
// );

// We need to integrate a middleware of AUTHORIZATION of so that only allowed user can access to that
usersRouter.get(
  "/profile",
  passport.authenticate("jwt", {
    failWithError: true,
    session: false,
  }),
  usersOnly,
  async (req, res) => {
    // let session;
    try {
      //   const rawSessionId = req.cookies["connect.sid"];
      //   console.log(rawSessionId)
      //   if (rawSessionId) {
      //     // URL-decode and extract the signature part
      //     const decodedSessionId = decodeURIComponent(rawSessionId);
      //     const signature = decodedSessionId.split(".")[1]; // Assuming the format is always correct
      //     session = {
      //       sessionID: req.sessionID,
      //       signature: signature,
      //       cookie: req.cookies["connect.sid"],
      //     };
      //   }

      // Accessing the JWT token from the cookie
      const jwtToken = req.signedCookies["authorization"];
      let userDB;
      try {
        userDB = await usersManager.findOne({ email: req.user.email }).lean();
      } catch (error) {
        console.log(error.message);
      }
      req.user
      res.render("profile.handlebars", {
        pageTitle: "Profile",
        user: {email: req.user.email,
              name: req.user.name, 
              role: req.user.role, 
              iat: new Date(req.user.iat * 1000).toLocaleString(), 
              exp: new Date(req.user.exp * 1000).toLocaleString()},
        //session: session,
        token: jwtToken,
        userDB: userDB,
      });
    } catch (error) {
      console.error("Error in /profile route:", error);
      res.redirect("/login");
    }
  }
);

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
      await usersManager.resetPassword(email, password);
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
