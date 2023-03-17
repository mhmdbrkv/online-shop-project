const guard = require("../routes/guards/auth-guard");
const router = require("express").Router();
const bodyParser = require("body-parser").urlencoded({ extended: true });
const orders = require("../controllers/orders.controller");
const cart = require("../controllers/cart.controller");

router.post("/", guard.isAuth, bodyParser, orders.postOrder, cart.postRemove);

router.post("/remove", guard.isAuth, bodyParser, orders.postRemove);

router.post("/removeAll", guard.isAuth, bodyParser, orders.postRemoveAll);

router.get("/", guard.isAuth, orders.getOrder);

module.exports = router;
