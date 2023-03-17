const router = require("express").Router();
const { check } = require("express-validator");
const Auths = require("../controllers/auth.controller");
const guards = require("../routes/guards/auth-guard");
const bodyParser = require("body-parser").urlencoded({ extended: true });

router.get("/signup", guards.isNotAuth, (req, res) => {
  res.render("signup", {
    pageTitle: "Sign Up",
    status: req.flash("errSignup")[0],
    errors: req.flash("validationErrors"),
    isUser: false,
    isAdmin: false,
  });
});

router.get("/login", guards.isNotAuth, (req, res) => {
  res.render("login", {
    pageTitle: "Login",
    status: req.flash("errLogin")[0],
    errors: req.flash("loginErrors"),
    isUser: false,
    isAdmin: false,
  });
});

router.post(
  "/signup",
  guards.isNotAuth,
  bodyParser,
  check("pass")
    .isLength({ min: 6 })
    .withMessage("length must be at least 6 characters"),

  check("cpass").custom((value, { req }) => {
    if (value === req.body.pass) return true;
    else throw "confirm password is incorrect";
  }),

  Auths.sign_up
);

router.post(
  "/login",
  guards.isNotAuth,
  bodyParser,
  check("pass")
    .isLength({ min: 6 })
    .withMessage("length must be at least 6 characters"),
  Auths.log_in
);

router.all("/logout", guards.isAuth, Auths.logout);

module.exports = router;
