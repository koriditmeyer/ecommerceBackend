import passport from "passport";
import { usersManager } from "../models/index.js";

/**
 *
 * Passport JWT Strategy
 *
 */
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { JWT_PRIVATE_KEY } from "../config/config.js";
const COOKIE_OPTS = {
  signed: true,
  httpOnly: true,
  maxAge: 24 * 60 * 60 * 1000,
  sameSite: "Strict",
};
import { encrypt } from "../utils/crypto.js";

//create cookie
export async function appendJwtAsCookie(req, res, next) {
  try {
    const accessToken = await encrypt(req.user);
    // console.log("Setting JWT in cookie:", accessToken); // Log the JWT being set
    res.cookie("authorization", accessToken, COOKIE_OPTS);
    next();
  } catch (error) {
    next(error);
  }
}

//delete cookie
export async function removeJwtFromCookies(req, res, next) {
  console.log("Clearing JWT cookie"); // Log the action of clearing the cookie
  // res.clearCookie("authorization", COOKIE_OPTS); // remove only the JWT from cookie
  res.clearCookie("authorization"); // remove all the cookie
  next();
}

//use passport jwt strategy
passport.use(
  "jwt",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([
        function (req) {
          let token = null;
          if (req?.signedCookies) {
            token = req.signedCookies["authorization"];
            // console.log("Extracted Token:", token); // Log the extracted token
          }
          return token;
        },
      ]),
      secretOrKey: JWT_PRIVATE_KEY,
    },
    function loginUser(user, done) {
      // console.log("User loaded in JWT Strategy:", user); // Log the user object
      done(null, user);
    }
  )
);

/**
 *
 * Passport Github Strategy for Registering Users
 *
 */
import { Strategy as GithubStrategy } from "passport-github2";
import {
  githubCallbackUrl,
  githubClientSecret,
  githubClienteId,
} from "../config/config.js";

passport.use(
  "github",
  new GithubStrategy(
    {
      clientID: githubClienteId,
      clientSecret: githubClientSecret,
      callbackURL: githubCallbackUrl,
      scope: ['user:email']
    },
    async function verify(accessToken, refreshToken, profile, done) {
      // console.log(profile);
      try {

        // search first if user exist in DB
        let user = await usersManager.findOne({ email: profile.emails[0].value });
        if (!user) {
          let userEmail = profile.username; // Default to username
          if (profile.emails && profile.emails.length > 0) {
            userEmail = profile.emails[0].value; // Use email if available
          }
          const userDB={
            email: userEmail,
            password: "NA",
            name: profile.displayName || profile.username || "NA",
            last_name: "NA",
            provider: profile.provider,
            providerId: profile.id, // Storing GitHub ID
            profilePhoto: profile.photos[0].value || '',
          }
          // Create a new user if not exists
          user = await usersManager.register(userDB, false);
        }
        // Construct user data for session
        // console.log(user)
        const userData = {
          // ...registered.publicInfoGit(),
          email: user.email,
          name: user.name,
          role: "user",
        };
        return done(null, userData);
      } catch (error) {
        done(error);
      }
    }
  )
);

/**
 *
 * Passport Local Strategy with sessions
 *
 */
import { Strategy as LocalStrategy } from "passport-local";

//register user
passport.use(
  "local-register",
  new LocalStrategy(
    {
      passReqToCallback: true, // Tells Passport to pass the entire request to the callback
      usernameField: "email", // Specifies that the email field will be used as the username
    },
    async (req, _u, _p, done) => {
      // Asynchronous callback function for the strategy
      try {
        const userData = await usersManager.register(req.body, true); // Calls User model's register method with the request body
        // const userObject = userData.toObject ? userData.toObject() : userData;
        // console.log("Registered User Data:", userData);
        done(null, userData); // method of passport done(null, userData)= (no error, return userData)
      } catch (error) {
        if (error.code === 11000) {
          console.log(error);
          // Handle duplicate key error
          done(null, false, {
            message: `Email ${error.keyValue} is already in use.`,
          });
        } else {
          done(null, false, error); // method of passport done(null, false, error.message)= (error, don't return userData, return error)
        }
      }
    }
  )
);

// login user
passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const userData = await usersManager.login(email, password);
        done(null, userData);
      } catch (error) {
        return done(null, false, error);
      }
    }
  )
);

export function clearSession(req, res, next) {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        // Handle error case
        console.error("Session destruction error:", err);
        next(err); // Pass the error to error handling middleware
      } else {
        res.clearCookie("connect.sid"); // Clear the session cookie
        next(); // Proceed to the next middleware
      }
    });
  } else {
    next(); // No session to destroy, proceed to next middleware
  }
}

/**
 *
 * Serialization and Deserialization - use with session or with OAuth
 *
 */

passport.serializeUser((user, next) => {
  next(null, user); // Serializes the user object to the session
});
passport.deserializeUser((user, next) => {
  next(null, user); // Deserializes the user object from the session
});

/**
 *
 * Passport Initialization Middleware
 *
 */

const passportInitialize = passport.initialize(); // Initializes Passport
const passportSession = passport.session(); // Connects Passport to the session

export function PassportAutenticacion(req, res, next) {
  passportInitialize(req, res, () => {
    // Middleware to initialize Passport
    passportSession(req, res, next); // Middleware to handle Passport sessions session or with OAuth
    // next()
  });
}
