///////////// SERVER /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// import express server
import express from "express";
// import constants configuration parameters in external file
import { PORT, PRODUCTS_JSON } from "./config.js";
import { ProductManager } from "./ProductManager.js";

// create app with express
const app = express();
app.use(express.urlencoded({ extended: true })); // allow server to handle better queries from url
//app.use(express.json()); // deserialize the json send by client and returns it in body field

///////////// SERVER /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/// ✓	Se creará una instancia de la clase “ProductManager”
const pm = new ProductManager({ path: PRODUCTS_JSON });
/// Initialise the product Manager
//   await pm.init();

app.get("/products", async (req, res) => {
  const  limit= parseInt(req.query.limit)
  try {
    const products = await pm.getProducts({limit});
    res.json(products);
  } catch (error) {
    res.json({
      status: "error",
      message: error.message,
    });
  }
});

app.get("/products/:pid", async (req, res) => {
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

/// ✓	Se corroborará que el servidor esté corriendo en el puerto 8080.
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
