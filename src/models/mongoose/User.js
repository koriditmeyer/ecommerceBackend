import { Schema, model } from "mongoose";
import { randomUUID } from "crypto";
import { compareHash, hash } from "../../utils/crypto.js";
import { CartManager } from "../../services/CartManager.js";

const usersCollection = "Users";

const productSchema = new Schema(
  {
    _id: { type: String, default: randomUUID, required: true },
    name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: Number,
    password: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    city_locality: { type: String },
    postal_code: { type: String },
    country_code: { type: String },
    date: { type: Date, default: Date.now },
    role: { type: String, default: "user" },
    cartId: { type: String, ref: "Cart" },
    provider: { type: String, default: "local" },
    providerId: String,
    profilePhoto: String,
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
        };
      },
    },

    statics: {
      register: async function (reqBody, usePassword) {
        if (usePassword){
          //! encrypt password!
          reqBody.password = hash(reqBody.password);
        }
        // Set the cartId in the user's data
        const userData = await usersManager.create(reqBody);
        if (!userData) {
          throw new Error("user not created");
        }
        console.log(userData)
        // Create a new cart for the user
        const addedCart = await new CartManager().addCart();
        console.log(addedCart)
        const updatedProduct = await usersManager.findByIdAndUpdate(
          userData._id,
          { $set: {cartId:addedCart._id }},
          { new: true }
        ).lean();
        if (!updatedProduct) {
          throw new Error(
            `error while updating: User with id ${userData._id} is not found`
          );
        }

        return userData.toObject();
      },

      login: async function (username, password) {
        const user = await usersManager.findOne({ email: username }).lean();
        if (!user) {
          throw new Error("user not found");
        }
        //! should encript the received and compred with the saved that is emcripted
        if (
          !compareHash({
            received: password,
            stored: user.password,
          })
        ) {
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

        const updatedUser = await usersManager
          .updateOne(
            { email: username },
            { $set: { password: password } },
            { new: true }
          )
          .lean();
        if (updatedUser.matchedCount === 0) {
          throw new Error("User not found!");
        }
        if (updatedUser.modifiedCount === 0) {
          throw new Error("User found but no changes were made");
        }
        return updatedUser;
      },
    },
  }
);

export const usersManager = model(usersCollection, productSchema);
