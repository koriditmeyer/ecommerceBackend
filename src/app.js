/*
 *
 * IMPORT
 *
 */

import express from "express";                                // import express server
import { engine } from "express-handlebars";                  // import engine from hadlebars
import handlebars from 'handlebars';
import { MONGODB_CNX_STR, PORT } from "./config.js";          // import constants configuration parameters in external file
import { apiRouter } from "./routers/api/api.router.js";      // import endpoints
import { webRouter } from "./routers/web/web.router.js";      // import endpoints
import { Server } from "socket.io";                           // import Socket io
import mongoose from "mongoose";                              // import Mongoose
import { sessions } from "./middlewares/sessions.js";         // import sessions midelware config
import { addUserDataToLocals } from "./middlewares/auth.js";  // import other sessions midelware config
import { autenticacion } from "./middlewares/passport.js";
import cookieParser from "cookie-parser";

// Register 'eq' Helper for Handlebars
handlebars.registerHelper('eq', function (value1, value2) {
  return value1 === value2;
});




/*
 *
 * CONNECT TO MONGO DB before creating the app with express
 *
 */

await mongoose.connect(MONGODB_CNX_STR)
console.log(`DB connected to ${MONGODB_CNX_STR}`)



/*
 *
 * INSTANCES of EXPRESS/ HANDLEBARS/ IO
 *
 */

// const fileStore = FileStore(session)                  // begin session creation with filestore
const app = express();                                // Create app with express
app.engine("handlebars", engine());                   // Initialize the engine using handlebars
const httpServer = app.listen(PORT, () =>             // create httpServer
  console.log(`HTTP server listening on port: ${PORT}`)
); 
const io = new Server(httpServer);                    // Update the server to a socket server

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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
app.use(cookieParser())       // use cookieParser to create cookies with secret key

app.use(sessions);                                   // External middleware to handle sessions (need to be before other middleware)
app.use(autenticacion)                               // External middleware to Initialize Passport and restore authentication state, if any, from the session
app.use(addUserDataToLocals);                        // External middleware to share session with all pages

app.use((req,res,next) =>{                           // Middleware at router level - We send IO server inside of the middleware so that all the other midleware can use it
  req['io'] = io
  next()
})

app.use("/api", apiRouter);                           // Middleware at router level
//app.use("/", express.static("./public"));           // Incorporated middleware - Webserver // take path from route of package.json
app.use("/static", express.static("./static"));       // Incorporated middleware - images
app.use("/", webRouter);                              // External middleware
app.use(showCookies)                                  // Middleware to intercept cookie

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

/*
 *
 * COOKIE MIDDLEWARE FUNCTION
 *
 */


function showCookies(req, res, next) {
  console.log('cookies:')
  console.dir(req.cookies)
  console.log('Signed cookies:')
  console.dir(req.signedCookies)
  next()
}