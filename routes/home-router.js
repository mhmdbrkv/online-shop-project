const router = require("express").Router();
const getAllproducts = require("../controllers/home.controller");
const bodyParser = require("body-parser").urlencoded({ extended: true });

router.get("/", getAllproducts.getAllproducts);

module.exports = router;
