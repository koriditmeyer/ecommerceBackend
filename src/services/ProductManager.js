// import file system
import fs from "fs/promises";

///////////// CLASS /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import { Product } from "../models/Product.js";

export class ProductManager {
  static #productlastId = 0; // no need to declare this variables except if private like here
  #products;

  constructor({ path }) {
    this.path = path;
    this.#products = [];
  }

  async init() {
    try {
      await this.#readProducts();
    } catch (error) {
      await this.#writeProducts();
    }

    if (this.#products.length === 0) {
      ProductManager.#productlastId = -1;
    } else {
      ProductManager.#productlastId = this.#products.at(-1).id;
    }
  }

  static #generateNewId() {
    return ++ProductManager.#productlastId;
  }
  #searchSimilarCode(code) {
    let searched = this.#products.find((p) => p.code === code);
    if (searched)
      throw new Error(`>>>>>>>>>>>>> product with same code: ${code} found`);
    return searched;
  }

  #searchSimilarCodeWithId(code, currentProductId) {
    let searched = this.#products.find(
      (p) => p.code === code && p.id !== currentProductId
    );
    if (searched) {
      throw new Error(
        `>>>>>>>>>>>>> product with the same code: ${code} found`
      );
    }
    return searched;
  }

  // read products
  async #readProducts() {
    const productsInJson = await fs.readFile(this.path, "utf-8");
    const dataProducts = JSON.parse(productsInJson);
    this.#products = dataProducts.map((u) => new Product(u));
  }
  // write products
  async #writeProducts() {
    await fs.writeFile(this.path, JSON.stringify(this.#products));
  }
  // add products
  async addProduct({
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnail,
  }) {
    let hasError = false; // Initialize a flag to track errors
    try {
      // Validate that all required fields are provided
      if (!title || !description || !code || !price || !stock || !category) {
        hasError = true;
        throw new Error(
          ">>>>>>>>>>>>> All input fields are required (exept thumbnail and status)"
        );
      }
      // Read existing products and at it to the products array
      await this.#readProducts();
      // Check in the array for products with the same code
      try {
        this.#searchSimilarCode(code);
      } catch (searchError) {
        hasError = true; // Set the flag to true if an error is encountered
        throw searchError; // Rethrow the error to handle it in the router.post handler
      }
      // Generate a new product with new id
      const id = ProductManager.#generateNewId();
      //console.log(id)
      const product = new Product({
        id,
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail,
      });
      // Add the product to the array
      this.#products.push(product);
      // write products from array to JSON
      await this.#writeProducts();

      return product;
    } catch (error) {
      if (hasError) {
        error.isCustomError = true; // Set a custom property to indicate a custom error
      }
      throw error; // Rethrow the error to handle it in the router.post handler
    }
  }
  async getProducts(query = {}) {
    await this.#readProducts();
    if (query.limit <= 0) {
      throw new Error(
        `>>>>>>>>>>>>> The limit entered: ${query.limit} is null, negative `
      );
    }
    if (query.limit) {
      return this.#products.slice(0, query.limit);
    }
    return this.#products;
  }
  async getProductsById(id) {
    await this.#readProducts();
    let searched = this.#products.find((p) => p.id === id);
    if (!searched)
      throw new Error(`>>>>>>>>>>>>> product with id ${id} is not found`);
    return searched;
  }
  async updateProduct(id, ProductData) {
    await this.#readProducts();
    const index = this.#products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(
        `>>>>>>>>>>>>> error while updating: Product with id ${id} is not found`
      );
    }
    // Check in the array for products with the same code
    try {
      this.#searchSimilarCodeWithId(ProductData.code, id);
    } catch (searchError) {
      throw searchError; // Rethrow the error to handle it in the router.post handler
    }
    // Delete the 'id' field from ProductData if it exists
    delete ProductData.id;
    // Use the spread operator to clone the current object's properties
    const updatedProduct = new Product({
      ...this.#products[index].asPOJO(), // Get the current product as a POJO
      ...ProductData, // and merge them with the new data
    });
    this.#products[index] = updatedProduct;
    await this.#writeProducts();
    return updatedProduct;
  }
  async deleteProduct(id) {
    await this.#readProducts();
    const index = this.#products.findIndex((p) => p.id === id);
    if (index !== -1) {
      const deletedProduct = this.#products.splice(index, 1);
      await this.#writeProducts();
      console.log(id);
      console.log(this.#products.splice(id, 1));
      console.log(deletedProduct);
      return deletedProduct[0];
    } else {
      throw new Error(
        `>>>>>>>>>>>>> error while deleting: Product with id ${id} is not found`
      );
    }
  }
}

///////////// TESTING /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// async function main() {
//   /// ✓	Se creará una instancia de la clase “ProductManager”
//   const pm = new ProductManager({ path: "products.json" });
//   /// Initialise the product Manager
//   await pm.init();

//   /// ✓	Se llamará “getProducts” recién creada la instancia, debe devolver el archivo Json
//   console.log(await pm.getProducts()); // to see al elements of class as Pojo

//   /// ✓	Se llamará al método “addProduct” con los campos siguientes
//   await pm.addProduct({
//     title: "producto prueba",
//     description: "Este es un producto prueba",
//     price: 200,
//     thumbnail: "Sin imagen",
//     code: "abc123",
//     stock: 25,
//   });

//   /// ✓	El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE
//   /// ✓	Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado
//   console.log(await pm.getProducts()); // to see al elements of class as Pojo

//   /// ✓	Se llamará al método “addProduct” con los mismos campos de arriba, debe arrojar un error porque el código estará repetido.
//   await pm.addProduct({
//     title: "producto prueba",
//     description: "Este es un producto prueba",
//     price: 200,
//     thumbnail: "Sin imagen",
//     code: "abc123",
//     stock: 25,
//   });

//   /// ✓	Se evaluará que getProductById devuelva error si no encuentra el producto o el producto en caso de encontrarlo
//   //use of instance to operate as it's protected
//   try {
//     const searched = await pm.getProductsById(0);
//     //use of pojo to view
//     console.log(searched);
//   } catch (error) {
//     console.log(error.message);
//   }

//   /// ✓	Validar que todos los campos sean obligatorios
//   await pm.addProduct({
//     title: "producto prueba",
//     description: "Este es un producto prueba",
//     price: 200,
//     thumbnail: "Sin imagen",
//     code: "abc123",
//     stock: "",
//   });

//   ///////////// TESTING 2 /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   /// ✓	MODIFICADO: Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto con el mismo code que un producto existente, deberia devolver un error
//   try {
//     await pm.updateProduct(1, {
//       title: "producto prueba actualizado",
//       description: "Este es un producto prueba actualizado",
//       price: 300,
//       thumbnail: "Sin imagen",
//       code: "sddf1223",
//       stock: 30,
//     });
//   } catch (error) {
//     console.log(error.message);
//   }

//   /// ✓	Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto, se evaluará que no se elimine el id y que sí se haya hecho la actualización.
//   try {
//     await pm.updateProduct(1, {
//       title: "producto prueba actualizado",
//       description: "Este es un producto prueba actualizado",
//       price: 300,
//       thumbnail: "Sin imagen",
//       code: "sddf1225",
//       stock: 30,
//     });
//   } catch (error) {
//     console.log(error.message);
//   }

//   console.log(await pm.getProducts()); // to see al elements of class as Pojo
//   /// ✓	Se llamará al método “deleteProduct”, se evaluará que realmente se elimine el producto o que arroje un error en caso de no existir.
//     await pm.deleteProduct(2);
//     console.log(await pm.getProducts()); // to see al elements of class as Pojo
// }

// main();
