import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true },
    attribute: { type: String },
    description: { type: String, required: true },
    brand: { type: String },
    code: { type: String, required: true, unique: true },
    avgRating: { type: Number },
    ratings: { type: Number },
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    status: { type: String, default: true, required: false }, // Set status to true by default
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    badge: { type: String },
    thumbnail: {
      type: Array,
      default: ["static\\img\\products\\defaultProduct.jpeg"],
      required: false,
    }, // Set thumbnail as an array of strings, default to an empty array
  },
  {
    versionKey: false,
    // ACTIVATE THAT MONGOBD RETURN ERROR
    strict: "throw",
    // CAN ADD METHODS AND STATIC METHODS BELOW
    methods: {
      hi() {
        console.log(this.title);
      },
    },
    statics: {
      count() {
        return 1;
      },
    },
  }
);

export const Product = model("products", productSchema);
