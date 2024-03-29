// import file system
import { productsManager,cartsManager } from "../models/index.js";
import { randomUUID } from "crypto";
// import constants configuration parameters in external file

export class CartManager {
  
  async #cartExist(id, productId, checkproductExist) {
    // Retrieve the cart
    const cart = await cartsManager.findOne({ _id: id }).lean();
    // Check if the cart exists
    if (!cart) {
      throw new Error(`Cart with id ${id} does not exist`);
    }
    if (productId) {
      // Check if the product exists in the cart
      const productInCart = await cart.products.find(
        (p) => p.product === productId
      );
      if (!productInCart && checkproductExist) {
        throw new Error(
          `Product with id ${productId} does not exist in the cart`
        );
      }
      return { cart, productInCart };
    }
    return { cart };
  }

  // add Carts
  async addCart() {
    let _id = randomUUID(); // If productData has no ID add ID
    const cart = await cartsManager.create({_id}); // Instanciate and create product in DB with mongoose
    return cart; // RETURN POJO
  }

  async getCartById(id) {
    const searched = cartsManager.findById(id).populate('products.product').lean();
    if (!searched) {
      throw new Error(`cart with id ${id} is not found`);
    }
    return searched;
  }

  async addCartProduct(id, productId, quantity) {
    // check if productId exist
    const productExists = await productsManager.exists({ _id: productId });
    if (!productExists) {
      throw new Error(`Product with id ${productId} does not exist`);
    }
    // Check if cart exist and product is in the cart
    let { cart, productInCart } = await this.#cartExist(id, productId, false);

    //add new product or update quantity
    if (!productInCart) {
      const products = await cartsManager.updateOne(
        { _id: id },
        { $push: { products: { product: productId, quantity: 1 } } }
      ).lean();
      return products;
    } else {
      const product = await cart.products.find((p) => p.product === productId);
      let newQuantity;
      if (product) {
        quantity
          ? (newQuantity = quantity)
          : (newQuantity = ++product.quantity);
      }
      const products = await cartsManager.updateOne(
        { _id: id, "products.product": productId },
        { $set: { "products.$.quantity": newQuantity } }
      ).lean();
      return products;
    }
  }

  async deleteCartProduct(id, productId) {
    // Check if cart exist and product exist in cart
    await this.#cartExist(id, productId, true);
    // Delete product
    const deleted = await cartsManager.updateOne(
      { _id: id },
      { $pull: { products: { product: productId } } }
    ).lean();
    return deleted;
  }

  async updateCart(id, products) {
    // check if in products, productId exist
    for (const e of products) {
      const productExists = await productsManager.exists({ _id: e.product }).lean();

      if (!productExists) {
        throw new Error(`Product with id ${e.product} does not exist`);
      }
      if (e.quantity < 0 || !e.quantity) {
        throw new Error(
          `For product with id ${e.product}, quantity: ${e.quantity} is not valid`
        );
      }
    }
    //update to new products
    const updatedCart = await cartsManager.updateOne(
      { _id: id },
      { $set: { products: products } }
    );
    return updatedCart;
  }

  async deleteCartProducts(id) {
    // Check if cart exist
    await this.#cartExist(id);
    const searched = await cartsManager.updateOne(
      { _id: id },
      { $set: { products: [] } }
    );
    return searched;
  }
}
