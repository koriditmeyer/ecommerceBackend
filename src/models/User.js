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
    address: { type: String, required: true},
    city_locality: { type: String, required: true  },
    postal_code: { type: String, required: true },
    country_code: { type: String, required: true  },
    date: { type: Date, default:Date.now},
    group: { type: String, default:'users'},
  },
  {
    versionKey: false,
    strict: "throw", // ACTIVATE THAT MONGOBD RETURN ERROR
  }
);

export const User = model(usersCollection, productSchema);
