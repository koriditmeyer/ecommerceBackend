import { Schema, model } from "mongoose";
import { randomUUID } from "crypto";
import { compareHash, hash } from "../utils/crypto.js";

const usersCollection = "Users";

const productSchema = new Schema(
  {
    _id: { type: String, default: randomUUID, required: true },
    name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    city_locality: { type: String },
    postal_code: { type: String },
    country_code: { type: String },
    date: { type: Date, default: Date.now },
    role: { type: String, default: "user" },
  },
  {
    versionKey: false,
    strict: "throw", // ACTIVATE THAT MONGOBD RETURN ERROR
    methods: {
      publicInfoGit: function () {
        return {
          email: this.email,
          name: this.name,
          last_name: this.last_name,
        }
      }
    },

    statics: {
      register: async function (reqBody) {
        //! encrypt password!
        reqBody.password = hash(reqBody.password);
        const userData = await User.create(reqBody);
        if (!userData) {
          throw new Error("user not created");
        }
        return userData;
      },

      authenticate: async function (username, password) {
        const user = await User.findOne({ email: username }).lean();
        if (!user) {
          throw new Error("user not found");
        }
        //! should encript the received and compred with the saved that is emcripted
        if (!compareHash(password, user.password)) {
          throw new Error("password are not identical");
        }
        // For security reasons we want minimum things from user to initiate session
        let userData = {
          email: user.email,
          name: user.name,
          role: user.role,
        };
        return userData;
      },

      resetPassword: async function (username, password) {
        //! encrypt password!
        password = hash(password);

        const updatedUser = await User.updateOne(
          { email: username },
          { $set: { password: password } },
          { new: true }
        ).lean();
        if (updatedUser.matchedCount === 0) {
          throw new Error("User not found!")
        };
        if (updatedUser.modifiedCount === 0) {
          throw new Error("User found but no changes were made")
        };
        return updatedUser;
      },
    },
  }
);

export const User = model(usersCollection, productSchema);
