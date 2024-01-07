import { MONGODB_CNX_STR, PORT } from "../config/config.js"; // import constants configuration parameters in external file
import mongoose from "mongoose"; // import Mongoose

export async function connectDb() {
  await mongoose.connect(MONGODB_CNX_STR);
  console.log(`DB connected to ${MONGODB_CNX_STR}`);
}
