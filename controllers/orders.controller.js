const Orderscart = require("../models/cart.model");
const OrdersOrder = require("../models/order.model");
const email_model = require("../models/auth.model");

exports.postOrder = async (req, res, next) => {
  if (req.body.cartID) {
    let order = await Orderscart.getCartByid(req.body.cartID);
    let Email = await email_model.getElementById(req.session.userID);
    await OrdersOrder.Add_Order({
      name: order.name,
      price: order.price,
      amount: order.amount,
      userID: order.userID,
      productID: order.productID,
      address: req.body.address,
      email: Email.email,
      timestamp: Date.now(),
    })
      .then(() => {
        next();
      })
      .catch(() => res.redirect("/error"));
  } else {
    let order = await Orderscart.getAllCarts();
    let Email = await email_model.getElementById(req.session.userID);

    for (const item of order) {
      await OrdersOrder.Add_Order({
        name: item.name,
        price: item.price,
        amount: item.amount,
        userID: item.userID,
        productID: item.productID,
        address: req.body.address,
        email: Email.email,
        timestamp: Date.now(),
      }).catch(() => res.redirect("/error"));
    }
    await Orderscart.removeAll_item()
      .then(() => res.redirect("/cart"))
      .catch(() => res.redirect("/error"));
  }
};

exports.getOrder = (req, res) => {
  OrdersOrder.getOrder(req.session.userID)
    .then((result) => {
      res.render("orders", {
        pageTitle: "Orders",
        isAdmin: req.session.isAdmin,
        isUser: req.session.userID,
        data: result,
        err: req.flash("validationErrors")[0],
      });
    })
    .catch((err) => res.redirect("/error"));
};

exports.postRemove = (req, res, next) => {
  OrdersOrder.remove_item(req.body.cartID)
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => res.redirect("/error"));
};

exports.postRemoveAll = (req, res) => {
  OrdersOrder.removeAll_item()
    .then(() => res.redirect("/orders"))
    .catch((err) => res.redirect("/error"));
};
