import { Router } from "express";
import upload from "../middlewares/multer.js"; // external middleware -- upload file
import cm from "../routers/cart.router.js";

export const webRouter = Router();

webRouter.post("/uploads", upload.single("image"), (req, res) => {
  res.json({
    file: req.file,
  });
});

webRouter.get("/cart", async (req, res) => {
  /* Fetch Cart Data */
  try {
    const cid = 3; // example of cart id
    const cartResponse = await fetch(`http://localhost:8080/api/carts/${cid}`);
    /* Extract the Error Message from API Response and stop execution of program */
    if (!cartResponse.ok) {
      const errorResponse = await cartResponse.json();
      throw new Error(errorResponse.message); // Use the error message from the API
    }

    const cart = await cartResponse.json();

    /* Fetch Products Data Contained in Cart */

    const cartProductsPromises = cart.products.map(async (cart) => {
      const productResponse = await fetch(
        `http://localhost:8080/api/products/${cart.product}`
      );
      const productDetails = await productResponse.json();
      return {
        ...productDetails,
        quantity: cart.quantity,
      };
    });

    const cartProducts = await Promise.all(cartProductsPromises); // !Await all the promises from the map need to ask why need to use this

    /* Render view with combined data */

    res.render("cart", { title: "My Cart", cartProducts: cartProducts });
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
});
