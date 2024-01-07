/*=============================================
= middleware exclusive with use of sessions   =
=============================================*/


// export function onlyLoggedInAPI(req, res, next) {
//   //* middleware of Authorization
//   if (!req.isAuthenticated()) {
//     return res.status(400).json({ status: "error", message: "Please login" });
//     //return res.redirect('/login')
//   }
//   next();
// }

// export function onlyLoggedInWeb(req, res, next) {
//   if (!req.isAuthenticated()) {
//     // return res.render("errorNotLoggedIn.handlebars",{})
//     return res.redirect("/login");
//   }
//   next();
// }
/**
 *
 * middleware that checks if there's a user in the session
 * and, if so, adds this user to res.locals
 * This makes the user data accessible in all Handlebars templates.
 *
 */

// export function addUserDataToLocals(req, res, next) {
//   if (req.isAuthenticated() && req.user) {
//     res.locals.user = req.user;
//   } else {
//     res.locals.user = null;
//   }
//   next();
// }

/*=============================================
=     middleware exclusive with use of JWT    =
=============================================*/

// make user information available to my views
import jwt from 'jsonwebtoken';
import { JWT_PRIVATE_KEY } from '../config/config.js'; // Import your JWT secret key

export function addUserDataToLocals(req, res, next) {
  const token = req.signedCookies['authorization']; // Extract JWT from signed cookies

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_PRIVATE_KEY); // Verify and decode the JWT
      res.locals.user = decoded; // Set the decoded user data in res.locals
    } catch (error) {
      // If token verification fails, set user to null
      console.error('JWT verification error:', error);
      res.locals.user = null;
    }
  } else {
    // If no token is found, set user to null
    res.locals.user = null;
  }

  next();
}

/*=============================================
=                 Other middleware            =
=============================================*/
const listOfRolesForAdminContent = ['admin']
const listOfRolesForUserContent = ['user', 'admin']

export async function usersOnly(req, res, next) {
  // console.log(req.user)
  if (!listOfRolesForUserContent.includes(req.user.role)) {
    return next(new Error('not authorized'))
  }
  next()
}


export function onlyAdmins(req, res, next) {
  if (!listOfRolesForAdminContent.includes(req.user.role)) {
    return next(new Error('not authorized'))
  }
  next()
}
