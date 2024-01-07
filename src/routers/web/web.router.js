import { Router } from 'express'
import { productsRouter } from './products.router.js'
import { chatRouter } from './chat.router.js'
import { sessionsRouter } from './sessions.router.js'
import { usersRouter } from './users.router.js'



export const webRouter = Router();


webRouter.use("/", productsRouter)
webRouter.use("/", chatRouter)
webRouter.use("/", sessionsRouter)
webRouter.use("/", usersRouter)

