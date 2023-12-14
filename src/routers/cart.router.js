import { Router } from "express";
// import Cart Manager js
import { CartManager } from "../services/CartManager.js";

const router = Router();

// ✓	CREATE AN INSTANCE OF CART MANAGER
const cm = new CartManager();

// ✓	CREATE CART (EMPTY)
router.post("/", async (req, res) => {
  try {
    const cartData = [
      {}
    ]
    const addedCart = await cm.addCart(cartData);
    res.json(addedCart);
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
});

// ✓	GET CART DATA
router.get("/:cid", async (req, res) => {
  const cid = req.params.cid;
  try {
    const cart = await cm.getCartById(cid);
    res.json(cart);
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
});

// ✓	ADD NEW PRODUCT TO CART AND IF EXIST INCREMENT QUANTITY
router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
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

// ✓	DELETE A PRODUCT FROM CART
router.delete("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const deletedProduct = await cm.deleteCartProduct(cid, pid);
    res.json(deletedProduct);
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
});

// ✓	UDATE CART WITH NEW PRODUCTS
router.put("/:cid", async (req, res) => {
  const cid = req.params.cid;
  let products = req.body;
  try {
    const updatedCart = await cm.updateCart(cid,products);
    res.json(updatedCart);
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
});

// ✓	UDATE PRODUCT IN CART WITH NEW QUANTITY
router.put("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  let quantity = req.body.quantity;
  try {
    const updatedCartProductQuantity = await cm.addCartProduct(
      cid,
      pid,
      quantity
    );
    res.status(201).json(updatedCartProductQuantity);
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
});

// ✓	DELETE ALL PRODUCTS FROM CART
router.delete("/:cid", async (req, res) => {
  const cid = req.params.cid;
  try {
    const deletedProducts = await cm.deleteCartProducts(cid);
    res.json(deletedProducts);
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
});

export default router;
