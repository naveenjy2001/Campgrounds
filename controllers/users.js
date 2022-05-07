const e = require("connect-flash");
const User = require("../models/user");

module.exports.renderRegisterForm = async (req, res) => {
  res.render("users/register");
};

module.exports.registerUser = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Yelp Camp!");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};

module.exports.renderLoginForm = async (req, res) => {
  res.render("users/login");
};

module.exports.loginUser = async (req, res) => {
  req.flash("success", "Welcome back!");
  const redirectUrl = req.session.reqPath || "/campgrounds";
  res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res) => {
  req.logout();
  req.flash("success", "You are Logged Out!");
  res.redirect("/campgrounds");
};
