import { Router } from 'express'

export const chatRouter = Router()


chatRouter.get("/chat", async (req, res) => {
    /* Fetch Cart Data */
    res.render("chat", { script: "./chat" });
  });
  
  