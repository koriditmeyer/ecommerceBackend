import { Router, json, urlencoded } from "express";
/// import endpoints
import productsRouter from "./products.router.js";
import cartRouter from "./cart.router.js";
import { cookieRouter } from "./cookie.router.js";
import { sessionsRouter } from "./sessions.router.js";
import { usersRouter } from "./users.router.js";

export const apiRouter = Router();

/*
 *
 * CONFIG EXPRESS
 *
 */
apiRouter.use(json()); // deserialize the json send by client and returns it in body field . If enable we can use req.body
apiRouter.use(urlencoded({ extended: true })); // allow server to handle better queries from url

/*
 *
 * MIDDLEWARE AT ROUTER LEVEL
 *
 */
apiRouter.use("/products", productsRouter);
apiRouter.use("/carts", cartRouter);
apiRouter.use("/", cookieRouter); // External middleware for cookies
apiRouter.use("/sessions", sessionsRouter); // External middleware for sessions
apiRouter.use("/users", usersRouter); // External middleware for users
