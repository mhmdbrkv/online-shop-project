const Product = require("../models/product.model");
const { validationResult } = require("express-validator");

exports.getAdd = (req, res, next) => {
  res.render("add", {
    pageTitle: "Add",
    isUser: true,
    isAdmin: true,
    err: req.flash("validationResult")[0],
  });
};

exports.postAdd = (req, res, next) => {
  if (validationResult(req).isEmpty()) {
    req.body.img = req.file.filename;
    Product.addProduct(req.body)
      .then(() => res.redirect("/"))
      .catch((err) => res.redirect("/error"));
  } else {
    req.flash("validationResult", validationResult(req).array());
    res.redirect("/admin/add");
  }
};
