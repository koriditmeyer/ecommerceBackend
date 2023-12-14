import { Product } from "../models/Product.js";
import { randomUUID } from "crypto";



export class ProductManager {
 
  // add products
  async addProduct(productData) {
    // If productData has no ID add ID
    productData._id = randomUUID();
    // Instanciate and create product in DB with mongoose
    const product = await Product.create(productData);
    // RETURN POJO
    return product.toObject();
  }
  
  async getProducts(query = {}) {
    if (query.limit <= 0) {
      throw new Error(`The limit entered: ${query.limit} is null, negative `);
    }
    return await Product.find().limit(query.limit).lean();
  }

  async getProductsById(id) {
    const searched = Product.findById(id).lean();
    if (!searched) {
      throw new Error(`product with id ${id} is not found`);
    }
    return searched;
  }

  async updateProduct(id, ProductData) {
    // Delete the 'id' field from ProductData if it exists
    delete ProductData.id;
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: ProductData },
      { new: true }
    ).lean();
    if (!updatedProduct) {
      throw new Error(
        `error while updating: Product with id ${id} is not found`
      );
    }
    return updatedProduct;
  }

  async deleteProduct(id) {
    console.log(`Attempting to delete product with id: ${id}`)
    const deletedProduct = await Product.findByIdAndDelete(id).lean();
    if (!deletedProduct) {
      throw new Error(
        `error while deleting: Product with id ${id} is not found`
      );
    }
    return deletedProduct;
  }
}
