const router = require("express").Router();
const getAllproducts = require("../controllers/home.controller");

router.get("/:id", getAllproducts.productInfo);


module.exports = router;