import { Router } from "express";
import { User } from "../../models/User.js";
import { compareHash } from '../../utils/crypto.js'

export const sessionsRouter = Router();


sessionsRouter.get("/login", async (req, res) => {
  /* Render view */
  res.render("login", {
    title: "Login",
  });
});

//same as API but instead of json return views
sessionsRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).lean();
    if (!user) {
      console.log('user not found')
      return res.redirect("/login");
    }
    console.log(password)
    //! should encript the received and compred with the saved that is emcripted
    if (!compareHash(password, user.password)) {
      return res.redirect("/login");
    }
    // For security reasons we want minimum things from user to initiate session
    let userData = {
      email: user.email,
      name: user.name,
      last_name: user.last_name,
      address: user.address,
      date: user.date,
      role: user.role,
      hashedPwd: user.password,
    };
    req.session["user"] = userData;
    console.log(user)
    res.redirect("/profile");
  } catch (error) {
    res.redirect("/login");
  }
});


sessionsRouter.post('/logout', (req, res) => {
    req.session.destroy(err => {
      res.redirect('/login')
    })
  })