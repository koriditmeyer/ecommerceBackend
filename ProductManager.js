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
    //this.price = price; // like this can be modified outside with a negative price
    this.price = price; // good to validate that input is positive but also need to declare it private so cant not modify it after
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
  }

  //mutators to validate field
  // price positive
  set price(newPrice) {
    if (newPrice < 0) {
      throw new Error("Price can not be negative");
    }
    this.#price = newPrice;
  }

  get price() {
    return this.#price;
  }
  //fields not empty

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

  constructor() {
    this.#products = [];
  }

  static #generateNewId() {
    return ++ProductManager.#productlastId;
  }
  #searchSimilarCode(code) {
    let searched = this.#products.find((p) => p.code === code);
    if (searched) throw new Error(`product with same code: ${code} found`);
    return searched;
  }

  addProduct({ title, description, price, thumbnail, code, stock }) {
    try {
      // Validate that all required fields are provided
      if (
        !title ||
        !description ||
        !price ||
        !thumbnail ||
        !code ||
        !stock 
      ) {
        throw new Error("All input fields are required");
      }
      // Check for products with the same code
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
      return product;
    } catch (error) {
      console.log(error.message);
    }
  }
  getProducts() {
    return this.#products;
  }
  getProductsById(id) {
    let searched = this.#products.find((p) => p.id === id);
    if (!searched) throw new Error(`product with id ${id} is not found`);
    return searched;
  }
}



///////////// TESTING /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// ✓	Se creará una instancia de la clase “ProductManager”
const pm = new ProductManager();

/// ✓	Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []
console.log(pm.getProducts().map((p) => p.asPOJO())); // to see al elements of class as Pojo

/// ✓	Se llamará al método “addProduct” con los campos siguientes
pm.addProduct({
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25,
});

/// ✓	El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE
/// ✓	Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado
console.log(pm.getProducts().map((p) => p.asPOJO())); // to see al elements of class as Pojo

/// ✓	Se llamará al método “addProduct” con los mismos campos de arriba, debe arrojar un error porque el código estará repetido.
pm.addProduct({
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
    const product = pm.getProductsById(2);
    //use of pojo to view
    console.log(product.asPOJO());
  } catch (error) {
    console.log(error.message);
  }
  
/// ✓	Validar que todos los campos sean obligatorios
pm.addProduct({
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: "",
  });  


