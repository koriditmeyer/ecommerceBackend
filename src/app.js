/*
 *
 * IMPORT
 *
 */

import express from "express";                        // import express server
import { engine } from "express-handlebars";          // import hadlebars
import { MONGODB_CNX_STR, PORT } from "./config.js";  // import constants configuration parameters in external file
import { apiRouter } from "./routers/api.router.js";  // import endpoints
import { webRouter } from "./routers/web.router.js";  // import endpoints
import { Server } from "socket.io";                   // import Socket io
import mongoose from "mongoose";                      // import Mongoose

/*
 *
 * CONNECT TO MONGO DB before creating the app with express
 *
 */

await mongoose.connect(MONGODB_CNX_STR)
console.log(`DB connected to ${MONGODB_CNX_STR}`)

/*
 *
 * INSTANCES of EXPRESS and HANDLEBARS
 *
 */

const app = express();                                // Create app with express
app.engine("handlebars", engine());                   // Initialize the engine using handlebars
const httpServer = app.listen(PORT, () =>             // create httpServer
  console.log(`HTTP server listening on port: ${PORT}`)
); 
const io = new Server(httpServer);                    // Update the server to a socket server

/*
 *
 * CONFIG EXPRESS
 *
 */

app.use(express.urlencoded({ extended: true }));      // allow server to handle better queries from url
app.use(express.json());                              // deserialize the json send by client and returns it in body field . If enable we can use req.body

/*
 *
 * CONFIG HADLEBARS
 *
 */

app.set("views", "./views");                          // Indicate wich part of the project are located the views
app.set("view engine", "handlebars");                 // use of engine that we initialize previoulsy

/*
 *
 * SERVER HTTP
 *
 */
app.use((req,res,next) =>{                           // Middleware at router level - We send IO server inside of the middleware so that all the other midleware can use it
  req['io'] = io
  next()
})
app.use("/api", apiRouter);                           // Middleware at router level
//app.use("/", express.static("./public"));           // Incorporated middleware - Webserver // take path from route of package.json
app.use("/static", express.static("./static"));       // Incorporated middleware - images
app.use("/", webRouter);                              // External middleware
app.use(function (err, req, res, next) {              // Middleware to manage errors
  res.json({
    status: "error",
    description: err.message,
  });
});

/*
 *
 * SERVER IO
 *
 */

const messages =[]

io.on('connection', (socket) => {                          //listen to the conection on the socket
  
  /* Chat message */
  
  let userName = socket.handshake.auth.user                //get information send with the socket
  socket.broadcast.emit('newUser', userName)               //Use of broadcast method to send information 
  //console.log('New connection:', socket.id);
  socket.emit('ServerMessages',messages)                   //Send the messages stored in array
  socket.on("ClientMessage", data =>{                      //Do something when receive message
    messages.push(data)
    io.sockets.emit('ServerMessages',messages)
  })
});
