import { Schema, model } from "mongoose";
import { randomUUID } from "crypto";

const usersCollection= 'Users'

const productSchema = new Schema(
  {
    _id: { type: String, default:randomUUID,required: true },
    name: { type: String, required: true },
    last_name: { type: String, required: true  },
    email: { type: String, required: true, unique: true  },
    password: { type: String, required: true},
    phone: { type: String },
    address: { type: String},
    city_locality: { type: String},
    postal_code: { type: String },
    country_code: { type: String  },
    date: { type: Date, default:Date.now},
    role: { type: String, default:'user'},
  },
  {
    versionKey: false,
    strict: "throw", // ACTIVATE THAT MONGOBD RETURN ERROR
  }
);

export const User = model(usersCollection, productSchema);
