const { check } = require("express-validator");
const Carts = require("../controllers/cart.controller");
const guard = require("../routes/guards/auth-guard");
const router = require("express").Router();
const bodyParser = require("body-parser").urlencoded({ extended: true });

router.post(
  "/",
  guard.isAuth,
  bodyParser,
  check("amount").isInt({ min: 1 }).withMessage("you must choose one least"),
  Carts.postCart
);

router.get("/", guard.isAuth, Carts.getItem);

router.post(
  "/save",
  guard.isAuth,
  bodyParser,
  check("amount").isInt({ min: 1 }).withMessage("you must choose one least"),
  Carts.postSave
);

router.post(
  "/remove",
  guard.isAuth,
  bodyParser,
  Carts.postRemove
);

router.post(
  "/removeAll",
  guard.isAuth,
  bodyParser,
  Carts.postRemoveAll
);


router.post("/verify_order" ,bodyParser, Carts.verifyOrders)


module.exports = router;
