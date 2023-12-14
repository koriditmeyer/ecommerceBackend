import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default __dirname;
export const PORT = 8080;
export const PRODUCTS_JSON = "db/products.json";
export const CART_JSON = "db/cart.json";
export const MONGODB_CNX_STR = 'mongodb+srv://koriditmeyer:BPfgRwT28IHTHunI@spaapp.bgppebz.mongodb.net/ecommerce' //MONGO ATLAS
//export const MONGODB_CNX_STR = 'mongodb://127.0.0.1:27017/ecommerce' //local MONGO DB connection