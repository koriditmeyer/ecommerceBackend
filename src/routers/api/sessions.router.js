import { Router } from "express";
import passport from "passport";
import {
  appendJwtAsCookie,
  clearSession,
  removeJwtFromCookies,
} from "../../middlewares/authentication.js";
import { usersOnly } from "../../middlewares/authorization.js";

export const sessionsRouter = Router();

/*
 *
 * MIDDLEWARE AT ROUTER LEVEL
 *
 */

// USING JWT
sessionsRouter.post(
  "/login",
  passport.authenticate("local-login", {
    failWithError: true,
    session: false,
  }),
  appendJwtAsCookie,
  async (req, res, next) => {
    res["successfullPost"](req.user);
  }
  // middleware of error moved to in API router
);

sessionsRouter.get(
  "/current",
  passport.authenticate("jwt", {
    session: false,
  }),
  usersOnly,
  async (req, res, next) => {
    res["successfullGet"](req.user);
  }
);

sessionsRouter.delete(
  "/current",
  removeJwtFromCookies,
  clearSession,
  async (req, res, next) => {
    res["successfullDelete"]();
  }
);

// USING EXPRESS-SESSION

// sessionsRouter.post(
//   "/login",
//   passport.authenticate("local-login",
//   {failWithError: true}),
//   async (req, res, next) => {
//   res["successfullPost"](req.user);
//    }
//   // middleware of error moved to in API router
// );

// // IF SESSION EXIST
// sessionsRouter.get("/current", (req, res) => {
//   if (req.session["user"]) {
//     return res.json(req.session["user"]);
//   }
// });

// sessionsRouter.post("/logout", (req, res) => {
//   req.logout((error) => {
//     if (error) {
//       return res
//         .status(500)
//         .json({ status: "logout error", body: error });
//     }
//     res.status(201).json({ status: "success", message: "Logout OK" });
//   });
// });
