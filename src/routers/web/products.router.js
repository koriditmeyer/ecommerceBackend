import { Router } from "express";
import passport from "passport";
import { usersOnly } from "../../middlewares/authorization.js";
export const productsRouter = Router();

import { EventEmitter } from "events";
var ee = new EventEmitter();

productsRouter.get("/cart",
passport.authenticate("jwt", {
  failWithError: true,
  session: false,
}),
usersOnly, 
async (req, res) => {
  /* Fetch Cart Data */
  try {
    const cid = "4821a7d5-4fb5-40f7-9bd3-210c10877fa7"; // example of cart id
    const cartResponse = await fetch(`http://localhost:8080/api/carts/${cid}`);
    const cart = await cartResponse.json();

    /* Render view with combined data */

    res.render("cart", {
      title: "My Cart",
      cartProducts: cart.products,
      cid: cid,
    });
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
});

productsRouter.get("/", async (req, res) => {
  /* Fetch Cart Data */
  try {
    // Capture query parameters 
    const queryParams = new URLSearchParams(req.query).toString();
    /* Fetch all Products Data  */
    const apiURL = `http://localhost:8080/api/products/?${queryParams}`;
    const productResponse = await fetch(apiURL);
    const products = await productResponse.json();
    // console.log({ title: "My Products", products });
    res.render("home", products);
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
});

productsRouter.get("/product/add", async (req, res) => {
  /* Fetch Cart Data */
  try {
    res.render("addProduct", { title: "Add a Product" });
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
});

productsRouter.get("/product/:id", async (req, res) => {
  const id = req.params.id;
  /* Fetch Cart Data */
  try {
    /* Fetch all Products Data  */
    const productResponse = await fetch(
      `http://localhost:8080/api/products/${id}`
    );
    /* Extract the Error Message from API Response and stop execution of program */
    if (!productResponse.ok) {
      const errorResponse = await productResponse.json();
      throw new Error(errorResponse.message); // Use the error message from the API
    }
    const product = await productResponse.json();
    // console.log(product.thumbnail[0]);
    res.render("productDetail", { product: product });
  } catch (error) {
    console.log(error.message);
    res.status(500).render("error", { error: error.message });
  }
});

productsRouter.get("/realTimeProducts", async (req, res) => {
  try {
    const productResponse = await fetch(`http://localhost:8080/api/products/`);
    const products = await productResponse.json();
    req["io"].emit("products", products);
    res.render("realTimeProducts", {
      script: "./realTimeProducts",
      title: "My Products",
    });
    /* Fetch all Products Data  */
    ee.on("internal-api-product-post", async (event) => {
      const productResponse = await fetch(
        `http://localhost:8080/api/products/`
      );
      const products = await productResponse.json();
      req["io"].emit("products", products);
    });
    //req["io"].emit("products", products);
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
});
