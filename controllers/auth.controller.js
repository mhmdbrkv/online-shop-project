const Auth = require("../models/auth.model");
const validationResult = require("express-validator").validationResult;

const sign_up = (req, res) => {
  if (validationResult(req).isEmpty()) {
    Auth.createAccount(req.body.userName, req.body.pass, req.body.email)
      .then(() => res.redirect("/"))
      .catch((err) => {
        req.flash("errSignup", err);
        res.redirect("/signup");
      });
  } else {
    req.flash("validationErrors", validationResult(req).array());
    res.redirect("/signup");
  }
};

const log_in = (req, res) => {
  if (validationResult(req).isEmpty()) {
    Auth.log(req.body.email, req.body.pass)
      .then((result) => {
        req.session.userID = result.id;
        req.session.isAdmin = result.isAdmin;
        res.redirect("/");
      })
      .catch((err) => {
        req.flash("errLogin", err);
        res.redirect("/login");
      });
  } else {
    req.flash("loginErrors", validationResult(req).array());
    res.redirect("/login");
  }
};

const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

module.exports = { sign_up, log_in, logout };
