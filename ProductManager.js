// import file system
const { promises: fs } = require("fs");

class Product {
  #price;
  constructor({
    id, //id = Product.#generateNewId(), // ejemplo de creacion de argumento opcional
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.price = price; // good to validate that input is positive but also need to declare it private so cant not modify it after
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
  }

  //mutators to validate field
  // price positive
  set price(newPrice) {
    if (newPrice < 0) {
      throw new Error(">>>>>>>>>>>>> Price can not be negative");
    }
    this.#price = newPrice;
  }

  get price() {
    return this.#price;
  }
  

  asPOJO() {
    // javascript object with all ELEMENTS (INCLUDING PRIVATE) visible without class name
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      price: this.#price,
      thumbnail: this.thumbnail,
      code: this.code,
      stock: this.stock,
    };
  }
}

class ProductManager {
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
  async addProduct({ title, description, price, thumbnail, code, stock }) {
    try {
      // Validate that all required fields are provided
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        throw new Error(">>>>>>>>>>>>> All input fields are required");
      }
      // Read existing products and at it to the products array
      await this.#readProducts();
      // Check in the array for products with the same code
      this.#searchSimilarCode(code);
      // Generate a new product with new id
      const id = ProductManager.#generateNewId();
      const product = new Product({
        id,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      });
      // Add the product to the array
      this.#products.push(product);
      // write products from array to JSON
      await this.#writeProducts();

      return product;
    } catch (error) {
      console.log(error.message);
    }
  }
  async getProducts() {
    await this.#readProducts();
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
    if (index !== -1) {
      const updatedProduct = new Product({
        id,
        // Use the spread operator to clone the current object's properties
        ...this.#products[index],
        // and merge them with the new data
        ...ProductData,
      });
      this.#products[index] = updatedProduct;
      await this.#writeProducts();
      return updatedProduct;
    } else {
      throw new Error(">>>>>>>>>>>>> error while updating: user not found");
    }
  }
  async deleteProduct(id) {
    await this.#readProducts();
    const index = this.#products.findIndex((p) => p.id === id);
    if (index !== -1) {
      const deletedProduct = this.#products.splice(id, 1);
      await this.#writeProducts();
      return deletedProduct[0];
    } else {
      throw new Error(">>>>>>>>>>>>> error while updating: user not found");
    }
  }
}

///////////// TESTING /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function main() {
  /// ✓	Se creará una instancia de la clase “ProductManager”
  const pm = new ProductManager({ path: "products.json" });
  /// Initialise the product Manager
  await pm.init();

  /// ✓	Se llamará “getProducts” recién creada la instancia, debe devolver el archivo Json
  console.log(await pm.getProducts()); // to see al elements of class as Pojo

  /// ✓	Se llamará al método “addProduct” con los campos siguientes
  await pm.addProduct({
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25,
  });

  /// ✓	El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE
  /// ✓	Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado
  console.log(await pm.getProducts()); // to see al elements of class as Pojo

  /// ✓	Se llamará al método “addProduct” con los mismos campos de arriba, debe arrojar un error porque el código estará repetido.
  await pm.addProduct({
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25,
  });

  /// ✓	Se evaluará que getProductById devuelva error si no encuentra el producto o el producto en caso de encontrarlo
  //use of instance to operate as it's protected
  try {
    const searched = await pm.getProductsById(0);
    //use of pojo to view
    console.log(searched);
  } catch (error) {
    console.log(error.message);
  }

  /// ✓	Validar que todos los campos sean obligatorios
  await pm.addProduct({
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: "",
  });

  ///////////// TESTING 2 /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /// ✓	Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto, se evaluará que no se elimine el id y que sí se haya hecho la actualización.
  await pm.updateProduct(2, {
    title: "producto prueba actualizado",
    description: "Este es un producto prueba actualizado",
    price: 300,
    thumbnail: "Sin imagen",
    code: "abc123",
    //stock: 30,
  });
  console.log(await pm.getProducts()); // to see al elements of class as Pojo
  /// ✓	Se llamará al método “deleteProduct”, se evaluará que realmente se elimine el producto o que arroje un error en caso de no existir.
  await pm.deleteProduct(2);
  console.log(await pm.getProducts()); // to see al elements of class as Pojo
}

main();
