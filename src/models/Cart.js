import mongoose from "mongoose";
import { randomUUID } from "crypto";

const CartsCollection = 'Cart'

const cartSchema = new mongoose.Schema(
  {
    _id: { type: String, default: randomUUID, required: true },
    products: [{
      product: { type: String, ref: "Products" }, 
      quantity: { type: Number }
    }],
  },
  {
    versionKey: false,
    strict: "throw", // ACTIVATE THAT MONGOBD RETURN ERROR
    // CAN ADD METHODS AND STATIC METHODS BELOW
    methods: {
      hi() {},
    },
    statics: {
      count() {
        return 1;
      },
    },
  }
);

// ! DONT WORK VERIFY WHY
// cartSchema.pre("find",function(next){
//   this.populate('Products.product')
//   next()
// })

export const Cart = mongoose.model(CartsCollection, cartSchema);
