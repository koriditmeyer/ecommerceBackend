import { Router } from "express";
// import Cart Manager js
import { CartManager } from "../services/CartManager.js";
// import constants configuration parameters in external file
import { CART_JSON } from "../config.js";

const router = Router();

/// ✓	Se creará una instancia de la clase “CartManager”
const cm = new CartManager({ path: CART_JSON });
/// Initialise the cart Manager
await cm.init();

router.post("/", async (req, res) => {
  try {
    const addedCart = await cm.addCart();
    res.json(addedCart);
  } catch (error) {
    if (error.isCustomError) {
      res.status(400).send({
        status: "error",
        message: error.message,
      });
    }
  }
});

router.get("/:cid", async (req, res) => {
  const cid = parseInt(req.params.cid);
  try {
    const products = await cm.getCartByIdProducts(cid);
    res.json(products);
  } catch (error) {
    res.json({
      status: "error",
      message: error.message,
    });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cid = parseInt(req.params.cid);
  const pid = parseInt(req.params.pid);
  try {
    const addedCartProduct = await cm.addCartProduct(cid, pid);
    res.status(201).json(addedCartProduct);
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
});

export default router;
