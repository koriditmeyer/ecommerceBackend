/*
 *
 * IMPORT
 *
 */
import express from "express"; // import express server
import {engine} from "express-handlebars"; // import hadlebars
import { PORT } from "./config.js"; // import constants configuration parameters in external file
import { apiRouter } from "./routers/api.router.js"; // import endpoints
import { webRouter } from "./routers/web.router.js"; // import endpoints
/*
 *
 * INSTANCES of EXPRESS and HANDLEBARS
 *
 */
const app = express(); // Create app with express
app.engine('handlebars',engine()) // Initialize the engine using handlebars
/*
 *
 * CONFIG EXPRESS
 *
 */
app.use(express.urlencoded({ extended: true })); // allow server to handle better queries from url
app.use(express.json()); // deserialize the json send by client and returns it in body field
/*
 *
 * CONFIG HADLEBARS
 *
 */
app.set('views','./views') // Indicate wich part of the project are located the views
app.set('view engine','handlebars') // use of engine that we initialize previoulsy
/*
 *
 * SERVER
 *
 */
app.use("/api", apiRouter); // Middleware at router level
//app.use("/", express.static("./public")); // Incorporated middleware - Webserver // take path from route of package.json
app.use("/static", express.static("./static")); // Incorporated middleware - images
app.use("/", webRouter); // External middleware
// Middleware to manage errors
app.use(function (err, req, res, next) {
  
  res.json({
    status: "error",
    description: err.message,
  });
});

/// ✓	Se corroborará que el servidor esté corriendo en el puerto 8080.
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
