const Orderscart = require("../models/cart.model");
const OrdersOrder = require("../models/order.model");
const email_model = require("../models/auth.model");

exports.postOrder = async (req, res, next) => {
  let Email = await email_model.getElementById(req.session.userID);
  let flag = false;
  let order;

  if (req.body.cartID) {
    order = await Orderscart.getCartByid(req.body.cartID);
  } else {
    order = await Orderscart.getAllCarts();
    flag = true;
  }

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

  if (flag) {
    await Orderscart.removeAll_item(req.session.userID)
      .then(() => res.redirect("/cart"))
      .catch(() => res.redirect("/error"));
  } else {
    next();
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
  OrdersOrder.removeAll_item(req.session.userID)
    .then(() => res.redirect("/orders"))
    .catch((err) => res.redirect("/error"));
};
