import { Router } from "express";
import { User } from "../../models/User.js";

export const sessionsRouter = Router();

/*
 *
 * MIDDLEWARE AT ROUTER LEVEL
 *
 */
sessionsRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).lean();
  if (!user) {
    return res.status(400)
    .json({
        status:"error",
        message:"login failed"
    })
  }
  //should encript the received and compred with the saved that is emcripted
  if (password !== user.password) {
      return res.status(400)    
      .json({status:"error",message:"login failed"})
    }
    
    // For security reasons we want minimum things from user to initiate session
    let userData = {
        email: user.email,
        name: user.name,
        last_name: user.last_name,
    };
  req.session['user'] = userData;
  res.status(201)
  .json({status:"success",message:"login success"})
});

// IF SESSION EXIST
sessionsRouter.get("/current",(req,res)=>{
    if(req.session["user"]){
        return res.json(req.session["user"])
    }
    res.status(400).json({status:"error",message:"Please login"})
})


sessionsRouter.post("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({
        status: "logout error",
        body: error.message,
      });
    }
    res.status(201)
    .json({
      status: "success",
      message: "Logout OK",
    });
  });
});
