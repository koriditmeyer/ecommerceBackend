import { Router } from "express";
// import Product Manager js
import { ProductManager } from "../services/ProductManager.js";
// import constants configuration parameters in external file
import { PRODUCTS_JSON } from "../config.js";

const router = Router();

/// ✓	Se creará una instancia de la clase “ProductManager”
const pm = new ProductManager({ path: PRODUCTS_JSON });
/// Initialise the product Manager
//   await pm.init();

router.get("/", async (req, res) => {
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
    const products = await pm.getProductsById(id);
    res.json(products);
  } catch (error) {
    res.json({
      status: "error",
      message: error.message,
    });
  }
});

export default router;
