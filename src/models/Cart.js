export class Cart {
    constructor({
      id,
      products = [], // array of objects, default to an empty array
    }) {
      this.id = id;
      this.products = products;
    }
    asPOJO() {
      // javascript object with all ELEMENTS (INCLUDING PRIVATE) visible without class name
      return {
        id: this.id,
        products: this.products,
      };
    }
  }