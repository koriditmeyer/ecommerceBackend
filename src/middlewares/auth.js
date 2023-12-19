export function onlyLoggedInAPI(req, res, next) {
  //* middleware of Authorization
  if (!req.isAuthenticated()) {
    return res.status(400).json({ status: "error", message: "Please login" });
    //return res.redirect('/login')
  }
  next();
}

export function onlyLoggedInWeb(req, res, next) {
  if (!req.isAuthenticated()) {
    // return res.render("errorNotLoggedIn.handlebars",{})
    return res.redirect("/login");
  }
  next();
}

export function onlyAdmins(req, res, next) {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ status: 'error', message: 'only for admins' })
  }
  next()
}


/**
 *
 * middleware that checks if there's a user in the session
 * and, if so, adds this user to res.locals
 * This makes the user data accessible in all Handlebars templates.
 *
 */

export function addUserDataToLocals(req, res, next) {
  if (req.session && req.session.user) {
    res.locals.user = req.session.user;
  } else {
    res.locals.user = null;
  }
  next();
}
