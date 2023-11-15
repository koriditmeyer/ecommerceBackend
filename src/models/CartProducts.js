export class CartProducts {
    constructor({
      product,
      quantity =1
    }) {
      this.product = product;
      this.quantity = quantity;
    }
    asPOJO() {
      // javascript object with all ELEMENTS (INCLUDING PRIVATE) visible without class 
      return {
        product: this.product,
        quantity: this.quantity,
      };
    }
  }