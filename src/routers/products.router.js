import { Router } from "express"; // import Product Manager js
import { ProductManager } from "../services/ProductManager.js"; // import constants configuration parameters in external file
import {EventEmitter} from "events"
import { extractFile } from "../middlewares/multer.js";
const maxPicUpload = 10
const router = Router();
var ee = new EventEmitter();

/// ✓	Se creará una instancia de la clase “ProductManager”
const pm = new ProductManager();

router.get("/", async (req, res) => {
  //@ts-ignore
  const limit = parseInt(req.query.limit);
  try {
    const products = await pm.getProducts({ limit });
    res.json(products);
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
});

router.get("/:pid", async (req, res) => {
  const id = req.params.pid;
  try {
    const product = await pm.getProductsById(id);
    res.json(product);
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
});

router.post("/",extractFile('pictureURL',maxPicUpload), async (req, res) => {
  // to add to req.body the information about picture
  if (req.files?.length){
    console.log(req.files)
    // @ts-ignore
    req.body.thumbnail = req.files.map(e =>e.path);
    //req.body.thumbnail = req.files to get all images caracteristics
  }
  try {
    const addedProduct = await pm.addProduct(req.body); 
    req['io'].emit('api-product-post', addedProduct); // Emitting a message to all connected clients
    ee.emit('internal-api-product-post',{'event':true} )
    res.status(201).json(addedProduct);
  } catch (error) {
      res.status(400).send({
        status: "error",
        message: error.message,
      });
  }
});

router.put("/:pid", async (req, res) => {
  if(req.body.thumbnail) {
    return res.status(400).send({
      status: "error",
      message: "can not modify picture URL with this endpoint",
    });
  }
  let updatedPart = req.body;
  const id = req.params.pid;
  try {
    const updatedProduct = await pm.updateProduct(id,updatedPart);
    res.json(updatedProduct);
  } catch (error) {
    if(error.message === 'id not found'){
      res.status(404)
    } else {
      res.status(400)
    }
    res.json({
      status: "error",
      message: error.message,
    });
  }
});

router.delete("/:pid", async (req, res) => {
  const id = req.params.pid;
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

// UPDATE PICTURE TO PRODUCT
router.put("/:pid/thumbnailUrl",extractFile('pictureURL',maxPicUpload), async (req, res) => {
  const id = req.params.pid;
  if (!req.files){
  res.status(400).send({
    status: "error",
    message: "You need to upload a picture",
  });
 }
 try {
  const ProductData = {thumbnail: req.files.map(e =>e.path)}
  const modified = await pm.updateProduct(id, ProductData);
  res.json(modified);
} catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
}
});

export default router;
