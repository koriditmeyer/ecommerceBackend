/*
 *
 * IMPORT
 *
 */

import { MONGODB_CNX_STR } from "../config.js"; // import constants configuration parameters in external file
//import cookieParser from "cookie-parser";                 // import cookies - if use session no need to import as already in session
import session from "express-session"; // import session (enable sessions creation with cookies)
// import FileStore from "session-file-store";              // import File storage capacity to session
import MongoStore from "connect-mongo"; // import session creation with mongo

/*
 *
 * CONFIG SESSIONS
 *
 */

// Session with fileStore
// const store= new fileStore({
//   path:'./sessions',                                     // path where sessions are stored
//   ttl:100,                                               // time the session lives (s)
//   retries:5                                              // times server will read files if session failed (eg if file is written at the same time)
// })

// Session with MongoDB
const store = MongoStore.create({
  mongoUrl: MONGODB_CNX_STR, // path of the connection to MongoDB
  ttl: 60 * 60 * 24, // time the session lives (s)
  // mongoOptions:{
  //   useNewUrlParser:true,
  //   useUnifiedTopology;true
  // },
});

//app.use(cookieParser('dfgdfgdfe45#23@@we2_?>sd'))       // use cookieParser to create cookies with secret key

/*
 *
 * MIDDLEWARES
 *
 */
export const sessions = session({
  // use session midelware
  store,
  secret: "dfgdfgdfe45#23@@we2_?>sd",
  resave: true, // Allow to maintain session alive
  saveUninitialized: true,
});

export function onlyLoggedInAPI(req, res, next) {
  //* middleware of Authorization
  if (!req.session["user"]) {
    return res.status(400).json({ status: "error", message: "Please login" });
    //return res.redirect('/login')
  }
  next();
}

export function onlyLoggedInWeb(req, res, next) {
  if (!req.session["user"]) {
    // return res.render("errorNotLoggedIn.handlebars",{})
    return res.redirect("/login");
  }
  next();
}
