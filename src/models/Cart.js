import mongoose from "mongoose";
import { randomUUID } from 'crypto'

const cartSchema = new mongoose.Schema(
  {
    _id: { type: String,default: randomUUID, required: true }, 
    products: { type: Array,default: [], required: true },
  },
  {
    versionKey: false, 
    strict: 'throw', // ACTIVATE THAT MONGOBD RETURN ERROR
    // CAN ADD METHODS AND STATIC METHODS BELOW 
    methods: {
      hi() {
        
      },
    },
    statics: {
      count(){
        return 1
      }
    }
  }
);

export const Cart = mongoose.model("cart", cartSchema);
