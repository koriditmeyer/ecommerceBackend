// hash - PASSWORD
import { hashSync, compareSync, genSaltSync } from "bcrypt";

export function hash(phrase) {
  if (!phrase) throw new Error("invalidad data to hash");
  return hashSync(phrase, genSaltSync(10));
}

export function compareHash({ received, stored }) {
  if (!received) throw new Error("invalid received data to compare");
  if (!stored) throw new Error("invalid stored data to compare");
  return compareSync(received, stored);
}

// jwt - TOKEN
import jwt from "jsonwebtoken";
import { JWT_PRIVATE_KEY } from "../config/config.js";

export function encrypt(data) {
  return new Promise((resolve, reject) => {
    if (!data) {
      return reject(new Error("nothing to jwt encode!"));
    }
    jwt.sign(data, JWT_PRIVATE_KEY, { expiresIn: "24h" }, (err, encoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(encoded);
      }
    });
  });
}

export function decrypt(token) {
  return new Promise((resolve, reject) => {
    if (!token) {
      return reject(new Error("no token to decode!"));
    }
    jwt.verify(token, JWT_PRIVATE_KEY, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}
