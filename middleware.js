module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.reqPath = req.originalUrl;
    req.flash("error", "Login to continue");
    res.redirect("/login");
  } else {
    next();
  }
};
