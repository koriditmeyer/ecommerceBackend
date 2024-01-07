import { Router } from "express";

export const cookieRouter = Router();

const limitTime = 24 * 60 * 60 * 1000;


cookieRouter.post("/Cookie", (req, res) => {
  res.cookie("appCookie", "Esta es una cookie muy poderosa", {
    maxAge: limitTime, //max age (ms)
    signed: false       //enable signed cookie
  });
  res.send("cookie created");
});

cookieRouter.get("/Cookie", (req, res) => {
  res.send(req.cookies);
});

cookieRouter.delete("/Cookie", (req, res) => {
  res.clearCookie("appCookie");
  res.send("cookie removed");
});

cookieRouter.post("/SignedCookie", (req, res) => {
  res.cookie("SignedCookie", "Esta es una cookie muy poderosa", {
    signed: true,
    httpOnly: true,
  maxAge: 24 * 60 * 60 * 1000,
  });
  res.send("la cookie firmada fue guardada con éxito");
});

cookieRouter.get("/SignedCookies", (req, res) => {
  res.send(req.signedCookies);
});

cookieRouter.delete("/SignedCookie", (req, res) => {
  res.clearCookie("SignedCookie");
  res.send("cookie removed");
});
