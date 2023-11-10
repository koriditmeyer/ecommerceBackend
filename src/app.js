///////////// IMPORT /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// import express server
import express from "express";
/// import constants configuration parameters in external file
import { PORT } from "./config.js";
import __dirname from "./config.js";
/// import endpoints
import { apiRouter } from "./routers/api.router.js";
import { webRouter } from "./routers/web.router.js";
///////////// INSTANCES //////////////////////////////////////////////////////////////////////////////////////////////////////////////
// create app with express
const app = express();

///////////// CONFIG //////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// EXPRESS
app.use(express.urlencoded({ extended: true })); // allow server to handle better queries from url
app.use(express.json()); // deserialize the json send by client and returns it in body field

///////////// SERVER /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Middleware at router level
app.use("/api", apiRouter);
/// Incorporated middleware - Webserver // take path from route of package.json
app.use("/", express.static("./public"));
app.use("/static", express.static("./static"));
/// External middleware
app.use("/", webRouter);
/// Middleware to manage errors
app.use(function (err, req, res, next) {
  res.json({
    status: "error",
    description: err.message,
  });
});

/// ✓	Se corroborará que el servidor esté corriendo en el puerto 8080.
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
