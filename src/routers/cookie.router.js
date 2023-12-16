import { Router } from "express";

export const cookieRouter = Router();

const limitTime = 24 * 60 * 60 * 1000;

cookieRouter.get("/setCookie", (req, res) => {
  res.cookie("appCookie", "test cookie", {
    maxAge: limitTime, //max age
  });
  res.send("cookie created");
});

cookieRouter.get("/getCookie", (req, res) => {
  res.send(req.cookies);
});

cookieRouter.get("/deleteCookie", (req, res) => {
  res.clearCookie("appCookie");
  res.send("cookie removed");
});

cookieRouter.get("/setSignedCookie", (req, res) => {
  res.cookie("SignedCookie", "Esta es una cookie muy poderosa", {
    signed: true,
  });
  res.send("la cookie firmada fue guardada con éxito");
});

cookieRouter.get("/getSignedCookies", (req, res) => {
  res.send(req.signedCookies);
});


