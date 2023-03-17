const order_model = require("../models/order.model");
const { validationResult } = require("express-validator");

exports.save = async (req, res, next) => {
  try {
    await order_model.save(req.body.id, req.body.status);
    res.redirect(`/admin${req.url}`);
  } catch (err) {
    res.redirect("/error")
  }
};

exports.get = (req, res, next) => {
  let status = Object.getOwnPropertyNames(req.query)[0];

  let filter = ["pending", "sent", "completed"];
  let Promise;

  if (filter.includes(status)) Promise = order_model.filter(status);
  else Promise = order_model.getOrder();

  Promise
    .then((result) => {
      res.render("manage_order", {
        pageTitle: "Manage Order",
        isAdmin: req.session.isAdmin,
        isUser: req.session.userID,
        data: result,
        err: req.flash("validationErrors")[0]
      });
    })
    .catch((err) => res.redirect("/error"));
};

exports.emailFilter = (req, res, next) => {
  if (validationResult(req).isEmpty()) {
    order_model
    .emailFilter(req.body.email)
    .then((result) => {
      res.render("manage_order", {
        pageTitle: "Manage Order",
        isAdmin: req.session.isAdmin,
        isUser: req.session.userID,
        data: result,
        err: req.flash("validationErrors")[0]
      });
    })
    .catch((err) => res.redirect("/error"));
  }else {
    req.flash("validationErrors", validationResult(req).array());
    res.redirect(`/admin/manage_order`);
  }
};
