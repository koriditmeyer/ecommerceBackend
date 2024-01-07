import { Router } from "express";
import passport from "passport";

import { usersManager } from "../../models/index.js";
import {
  onlyAdmins,
  // onlyLoggedInAPI,
  usersOnly,
} from "../../middlewares/authorization.js";
import { appendJwtAsCookie } from "../../middlewares/authentication.js";

export const usersRouter = Router();

/*
 *
 * MIDDLEWARE AT ROUTER LEVEL
 *
 */

usersRouter.post(
  "/",
  passport.authenticate("local-register", {
    failWithError: true,
    session: false,
  }),
  appendJwtAsCookie,
  async (req, res, next) => {
    res["successfullPost"](req.user);
  }
);

usersRouter.get(
  "/current",
  passport.authenticate("jwt", {
    failWithError: true,
    session: false,
  }),
  usersOnly,
  async (req, res, next) => {
    res["successfullGet"](req.user);
  }
);

usersRouter.get(
  "/",
  passport.authenticate("jwt", { 
    failWithError: true,
    session: false,
  }),
  onlyAdmins,
  async (req, res, next) => {
    const users = await usersManager.find({},{ password: 0 }).lean();
    res['successfullGet'](users)
  }
);

usersRouter.put("/", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const userUpdated = usersManager.resetPassword(email, password);
    res['successfullPut'](userUpdated)
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ status: "error", message: error.message });
  }
});

// usersRouter.post(
//   "/",
//   passport.authenticate("local-register", {
//     failWithError: true,
//   }),
//   function (req, res, next) {
//      res['successfullPost'](req.user)
//   }
// );

// // We need to integrate a middleware of AUTHORIZATION of so that only allowed user can access to that
// usersRouter.get("/current",
// onlyLoggedInAPI,
// async (req, res, next) => {
//   // const user = await User.findOne(
//   //   { email: req.session["user"].email },
//   //   { password: 0 } //not include password
//   // ).lean();
//   // res.json({ status: "success", payload: user });
//    res['successfullGet'](req.user)
// });

// usersRouter.get("/admin",
// onlyAdmins,
// async (req, res) => {
//   const users = await usersManager.find().lean();
//   res.json({ status: "success", payload: users });
// });

// usersRouter.put(
//   "/",
//   // DIVIDE MIDDLEWARE IN 2 FUNCTIONS
//   // 1st FUNCTION
//   async (req, res, next) => {
//     const { email, password } = req.body;
//     try {
//       req.userUpdated = usersManager.resetPassword(email, password);
//       next();
//     } catch (error) {
//       console.log(error.message);
//       res.status(400).json({ status: "error", message: error.message });
//     }
//   },
//   // 2nd FUNCTION of success
//   (req, res) => {
//     res.status(201).json({ status: "success", payload: req.userUpdated });
//   }
// );
