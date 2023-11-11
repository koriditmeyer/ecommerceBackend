// import file system
import fs from "fs/promises";

///////////// CLASS /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import { Cart } from "../models/Cart.js";
import { CartProductManager } from "./CartProductManager.js";

export class CartManager {
  static #CartlastId = 0; // no need to declare this variables except if private like here
  #Carts;

  constructor({ path }) {
    this.path = path;
    this.#Carts = [];
  }

  async init() {
    try {
      await this.#readCarts();
    } catch (error) {
      await this.#writeCarts();
    }

    if (this.#Carts.length === 0) {
      CartManager.#CartlastId = -1;
    } else {
      CartManager.#CartlastId = this.#Carts.at(-1).id;
    }
  }

  static #generateNewId() {
    return ++CartManager.#CartlastId;
  }

  // read Carts
  async #readCarts() {
    const CartsInJson = await fs.readFile(this.path, "utf-8");
    const dataCarts = JSON.parse(CartsInJson);
    this.#Carts = dataCarts.map((u) => new Cart(u));
  }
  // write Carts
  async #writeCarts() {
    await fs.writeFile(this.path, JSON.stringify(this.#Carts));
  }
  // add Carts
  async addCart() {
    // Read existing Carts and at it to the Carts array
    await this.#readCarts();
    // Generate a new Cart with new id
    const id = CartManager.#generateNewId();
    //console.log(id)
    const cart = new Cart({
      id,
    });
    // Add the Cart to the array
    this.#Carts.push(cart);
    // write Carts from array to JSON
    await this.#writeCarts();
    return cart;
  }

  async getCartByIdProducts(id) {
    await this.#readCarts();
    let searched = this.#Carts.find((c) => c.id === id);
    if (!searched)
      throw new Error(`>>>>>>>>>>>>> cart with id ${id} is not found`);
    return searched;
  }

  async addCartProduct(id, ProductId) {
    // get cart by id
    let cart = await this.getCartByIdProducts(id);
    console.log(cart)
    // get products
    let products = cart.products;
    //console.log(products)
    /// ✓	Se creará una instancia de la clase “ProductManager”
    const cpm = new CartProductManager({products});
    // check if the product is already in the cart
    const searched = cpm.getCartProductById(id, ProductId);
    // add new product or update quantity
    if (!searched) {
      const products = cpm.addCartProduct(ProductId);
      console.log(this.#Carts);
      await this.#writeCarts();
      return products;
    } else {
      let newQuantity = ++searched.quantity;
      console.log(searched.quantity);
      const products = cpm.updateCartProduct(ProductId, {quantity: newQuantity});
      await this.#writeCarts();
      return products;
    }
  }
}
