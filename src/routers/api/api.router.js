import { Router, json, urlencoded } from "express";
/// import endpoints
import productsRouter from "./products.router.js";
import cartRouter from "./cart.router.js";
import { cookieRouter } from "./cookie.router.js";

import { sessionsRouter } from "./sessions.router.js";
import { usersRouter } from "./users.router.js";
import { errorHandler } from "../../middlewares/errorHandler.js";
import { SuccessHandler } from "../../middlewares/successHandler.js";

export const apiRouter = Router();

// middleware of success for all the sucess in API
apiRouter.use(SuccessHandler);

// * MIDDLEWARE AT ROUTER LEVEL
apiRouter.use("/products", productsRouter);
apiRouter.use("/carts", cartRouter);
apiRouter.use("/", cookieRouter); // External middleware for creating cookies
apiRouter.use("/sessions", sessionsRouter); // External middleware for sessions
apiRouter.use("/users", usersRouter); // External middleware for users

// middleware of error for all the errors in API
apiRouter.use(errorHandler);
