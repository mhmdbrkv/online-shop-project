const router = require("express").Router();
const { check } = require("express-validator");
const Admin = require("../controllers/admin.controller");
const guards = require("./guards/admin.guard");
const manage_order_Controller = require("../controllers/manage_order.controller");
const bodyParser = require("body-parser").urlencoded({ extended: true });
const multer = require("multer");

router.get("/manage_order", guards, manage_order_Controller.get);

router.post(
  "/manage_order/filter",
  guards,
  bodyParser,
  check("email").not().isEmpty().withMessage("Enter an email to search for").isEmail().withMessage("Invalid email"),
  manage_order_Controller.emailFilter
);

router.post("/manage_order", guards, bodyParser, manage_order_Controller.save);

router.get("/add", guards, Admin.getAdd);

router.post(
  "/add",
  guards,
  bodyParser,
  multer({
    storage: multer.diskStorage({
      destination: (req, file, callBack) => {
        callBack(null, "img");
      },
      filename: (req, file, callBack) => {
        callBack(null, Date.now() + "-" + file.originalname);
      },
    }),
  }).single("img"),
  check().custom((value, { req }) => {
    if (req.file) return true;
    else throw "image is required";
  }),
  Admin.postAdd
);

module.exports = router;
