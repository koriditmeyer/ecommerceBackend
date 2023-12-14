import {Schema, model} from "mongoose";

const productSchema = new Schema(
  {
    _id: { type: String, required: true }, 
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true,unique: true },
    price: { type: Number, required: true },
    status: { type: String, default:true, required: false }, // Set status to true by default
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    thumbnail: { type: Array, default:[],required: false }, // Set thumbnail as an array of strings, default to an empty array
  },
  {
    versionKey: false,
    // ACTIVATE THAT MONGOBD RETURN ERROR 
    strict: 'throw',
    // CAN ADD METHODS AND STATIC METHODS BELOW
    methods: {
      hi() {
        console.log(this.title);
      },
    },
    statics: {
      count(){
        return 1
      }
    }
  }
);

export const Product = model("products", productSchema);

// export  class Product {

//     constructor({
//       id, //id = Product.#generateNewId(), // ejemplo de creacion de argumento opcional
//       title,
//       description,
//       code,
//       price,
//       status = true, // Set status to true by default
//       stock,
//       category,
//       thumbnail = [], // Set thumbnail as an array of strings, default to an empty array
//     }) {
//       this.id = id;
//       this.title = title;
//       this.description = description;
//       this.code = code;
//       this.price = price; // good to validate that input is positive but also need to declare it private so cant not modify it after
//       this.status = status;
//       this.stock = stock;
//       this.category = category;
//       this.thumbnail = thumbnail;
//     }

//     //mutators to validate field
//     // price positive
//     // set price(newPrice) {
//     //   if (newPrice < 0) {
//     //     throw new Error(" Price can not be negative");
//     //   }
//     //   this.#price = newPrice;
//     // }

//     // get price() {
//     //   return this.#price;
//     // }

//     asPOJO() {
//       // javascript object with all ELEMENTS (INCLUDING PRIVATE) visible without class name
//       return {
//         id: this.id,
//         title: this.title,
//         description: this.description,
//         code: this.code,
//         price: this.price,
//         status: this.status,
//         stock: this.stock,
//         category: this.category,
//         thumbnail: this.thumbnail,
//       };
//     }
//   }
