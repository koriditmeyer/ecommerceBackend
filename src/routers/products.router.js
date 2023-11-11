import { Router } from "express";
// import Product Manager js
import { ProductManager } from "../services/ProductManager.js";
// import constants configuration parameters in external file
import { PRODUCTS_JSON } from "../config.js";

const router = Router();

/// ✓	Se creará una instancia de la clase “ProductManager”
const pm = new ProductManager({ path: PRODUCTS_JSON });
/// Initialise the product Manager
await pm.init();

router.get("/", async (req, res) => {
  //@ts-ignore
  const limit = parseInt(req.query.limit);
  try {
    const products = await pm.getProducts({ limit });
    res.json(products);
  } catch (error) {
    res.json({
      status: "error",
      message: error.message,
    });
  }
});

router.get("/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
  try {
    const product = await pm.getProductsById(id);
    res.json(product);
  } catch (error) {
    res.json({
      status: "error",
      message: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  let product = req.body;
  try {
    const addedProduct = await pm.addProduct(product);
    res.json(addedProduct);
  } catch (error) {
    if (error.isCustomError) {
      res.status(400).send({
        status: "error",
        message: error.message,
      });
    } 
  }
});

router.put("/:pid", async (req, res) => {
  let updatedPart = req.body;
  const id = parseInt(req.params.pid);
  try {
    const updatedProduct = await pm.updateProduct(id,updatedPart);
    res.json(updatedProduct);
  } catch (error) {
      res.status(400).send({
        status: "error",
        message: error.message,
      });
  }
});

router.delete("/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
  try {
    const deletedProduct = await pm.deleteProduct(id);
    res.json(deletedProduct);
  } catch (error) {
      res.status(400).send({
        status: "error",
        message: error.message,
      });
  }
});

export default router;
