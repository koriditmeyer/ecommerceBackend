import { Router } from "express"; // import Product Manager js
import { ProductManager } from "../services/ProductManager.js"; // import constants configuration parameters in external file
import { EventEmitter } from "events";
import { extractFile } from "../middlewares/multer.js";
import { Product } from "../models/Product.js";

const maxPicUpload = 10;
const router = Router();
var ee = new EventEmitter();

/// ✓	Se creará una instancia de la clase “ProductManager”
const pm = new ProductManager();

router.get("/", async (req, res) => {
  // Retrieve query parameters with default values
  // @ts-ignore
  // const limit = parseInt(req.query.limit) || 2; // Page size : Default limit is 10
  // console.log(limit)
  // const category = req.query.category; // Retrieve the category
  // // @ts-ignore
  // const page = parseInt(req.query.page) || 1; // Default page is 1
  // // @ts-ignore
  // const sortOption = req.query.sort || ""; // Default sort is empty, meaning no sort

  // // Set up filter and options for aggregation
  // let matchStage = {};
  // // If a category filter is provided, use it in the match stage
  // if (category) {
  //   matchStage.category = category;
  // }
  // // If a search query is provided, use it to filter the title
  // if (req.query.query) {
  //   matchStage.title = new RegExp(req.query.query, "i"); //match both uppercase and lowercase instances of the search term
  // }

  // // Sorting stage
  // let sortStage = {};
  // if (sortOption) {
  //   sortStage.price = ;
  // }

  // Aggregate pipeline stages
  // const aggregateQuery = [
  //   { $match: matchStage },
  //   sortStage,
  //   // Add more stages if need
  // ];
  // const aggregateQuery = Product.aggregate([
  // //  { $match: {category:"Books"} },
  //  // { $sort: {price: sortOption === "desc" ? -1 : 1} },
  // ]);
  const aggregateQuery = req.query.category ? { category: req.query.category } : {}
  console.log(req.query.sort)
  const options = {
    // page:page,
    // limit:limit,
    // lean: true,
    limit: req.query.limit || 2, // tamaño de pagina: 5 por defecto
    page: req.query.page || 1, // devuelve la primera pagina por defecto
    lean: true, // para que devuelva objetos literales, no de mongoose
    sort: req.query.sort === 'desc' ? { price: -1 } : { price: 1 }
  };

  try {
    const result = await Product.paginate(aggregateQuery, options);
    //const products = await pm.getProducts({ limit });
    const context = {
      title: "Products",
      existDocs: result.docs.length > 0,
      products: result.docs,
      limit: result.limit,
      page: result.page,
      totalPages: result.totalPages,
      hasNextPage: result.hasNextPage,
      nextPage: result.nextPage,
      hasPrevPage: result.hasPrevPage,
      prevPage: result.prevPage,
      pagingCounter: result.pagingCounter,
      totalDocs: result.totalDocs
    };
    console.log(context)

    res.json(context);
    //res.render('home',context)
    //console.log(send)
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

router.post("/", extractFile("pictureURL", maxPicUpload), async (req, res) => {
  // to add to req.body the information about picture
  if (req.files?.length) {
    console.log(req.files);
    // @ts-ignore
    req.body.thumbnail = req.files.map((e) => e.path);
    //req.body.thumbnail = req.files to get all images caracteristics
  }
  try {
    const addedProduct = await pm.addProduct(req.body);
    req["io"].emit("api-product-post", addedProduct); // Emitting a message to all connected clients
    ee.emit("internal-api-product-post", { event: true });
    res.status(201).json(addedProduct);
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
});

router.put("/:pid", async (req, res) => {
  if (req.body.thumbnail) {
    return res.status(400).send({
      status: "error",
      message: "can not modify picture URL with this endpoint",
    });
  }
  let updatedPart = req.body;
  const id = req.params.pid;
  try {
    const updatedProduct = await pm.updateProduct(id, updatedPart);
    res.json(updatedProduct);
  } catch (error) {
    if (error.message === "id not found") {
      res.status(404);
    } else {
      res.status(400);
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
router.put(
  "/:pid/thumbnailUrl",
  extractFile("pictureURL", maxPicUpload),
  async (req, res) => {
    const id = req.params.pid;
    if (!req.files) {
      res.status(400).send({
        status: "error",
        message: "You need to upload a picture",
      });
    }
    try {
      // @ts-ignore
      const ProductData = { thumbnail: req.files.map((e) => e.path) };
      const modified = await pm.updateProduct(id, ProductData);
      res.json(modified);
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: error.message,
      });
    }
  }
);

export default router;
