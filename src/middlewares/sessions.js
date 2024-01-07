/*
 *
 * IMPORT
 *
 */

import { MONGODB_CNX_STR, SESSION_SECRET } from "../config/config.js"; // import constants configuration parameters in external file
import session from "express-session"; // import session (enable sessions creation with cookies)
// import FileStore from "session-file-store";              // import File storage capacity to session
import MongoStore from "connect-mongo"; // import session creation with mongo

/*
 *
 * CONFIG SESSIONS
 *
 */

// Session with fileStore in my server
// const store= new fileStore({
//   path:'./sessions',                                     // path where sessions are stored
//   ttl:100,                                               // time the session lives (s)
//   retries:5                                              // times server will read files if session failed (eg if file is written at the same time)
// })

// Session with MongoDB
const store = MongoStore.create({
  mongoUrl: MONGODB_CNX_STR, // path of the connection to MongoDB
  ttl: 60 * 60 * 24, // time the session lives (s)
});

/*
 *
 * MIDDLEWARES
 *
 */
const COOKIE_OPTS = {
  secure: true, // Set 'secure' to true if using HTTPS, false otherwise
  httpOnly: true,
  sameSite: "Strict",
};

export const sessions = session({
  // use session midelware
  // store, // with OAuth don't need connexion to DB
  secret: SESSION_SECRET,
  resave: true, // Allow to maintain session alive
  saveUninitialized: true,
  cookie: COOKIE_OPTS,
});
