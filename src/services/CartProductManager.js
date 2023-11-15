// import file system
import fs from "fs/promises";

///////////// CLASS /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import { CartProducts } from "../models/CartProducts.js";

export class CartProductManager {
  constructor({ products }) {
    this.products = products;
  }

  getCartProductById(id, ProductId) {
    let searched = this.products.find((p) => p.product === ProductId);
    // if (!searched)
    //   throw new Error(
    //     `>>>>>>>>>>>>> In cart with id ${id} product with id ${ProductId} is not found`
    //   );
    return searched;
  }

  addCartProduct(product) {
    // create New product
    const cartProduct = new CartProducts({ product });
    // Add the Cart to the array
    this.products.push(cartProduct);
    return cartProduct;
  }

  updateCartProduct(ProductId, UpdatedData) {
    const index = this.products.findIndex((p) => p.product === ProductId);
    const updatedProduct = new CartProducts({
      ProductId,
      ...this.products[index], // Get the current product
      ...UpdatedData, // and merge them with the new data
    });
    this.products[index] = updatedProduct;
    return updatedProduct;
  }
}
