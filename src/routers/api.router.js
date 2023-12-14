import {Router, json} from 'express'
/// import endpoints
import productsRouter from './products.router.js'
import cartRouter from './cart.router.js'

export const apiRouter = Router()

/// Middleware at router level
apiRouter.use(json())
apiRouter.use('/products',productsRouter)
apiRouter.use('/carts',cartRouter)

