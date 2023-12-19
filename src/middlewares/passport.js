import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "../models/User.js";

/**
 *
 * Passport Local Strategy for Registering Users
 *
 */

passport.use(
  "register",
  new Strategy(
    {
      passReqToCallback: true,                              // Tells Passport to pass the entire request to the callback
      usernameField: "email",                               // Specifies that the email field will be used as the username
    },
    async (req, _u, _p, done) => {                          // Asynchronous callback function for the strategy
      try {
        const userData = await User.register(req.body);     // Calls User model's register method with the request body
        done(null, userData);                               // method of passport done(null, userData)= (no error, return userData)
      } catch (error) {
        done(null, false, error.message);                   // method of passport done(null, false, error.message)= (error, don't return userData, return error)
      }
    }
  )
);

/**
 *
 * Passport Local Strategy for User Login
 *
 */

passport.use(
  "login",
  new Strategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const userData = await User.authenticate(email, password);
        done(null, userData);
      } catch (error) {
        return done(null, false, error.message);
      }
    }
  )
);

/**
 *
 * Serialization and Deserialization
 *
 */

passport.serializeUser((user, next) => {
  next(null, user);                                         // Serializes the user object to the session
});
passport.deserializeUser((user, next) => {
  next(null, user);                                         // Deserializes the user object from the session
});

/**
 *
 * Passport Initialization Middleware
 *
 */

const passportInitialize = passport.initialize();           // Initializes Passport
const passportSession = passport.session();                 // Connects Passport to the session

export function autenticacion(req, res, next) {
  passportInitialize(req, res, () => {                      // Middleware to initialize Passport
    passportSession(req, res, next);                        // Middleware to handle Passport sessions
  });
}
