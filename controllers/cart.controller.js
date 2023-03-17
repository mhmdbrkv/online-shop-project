const Cart = require("../models/cart.model");
const { validationResult, Result } = require("express-validator");

exports.getItem = (req, res, next) => {
  Cart.getCart(req.session.userID)
    .then((result) => {
      res.render("cart", {
        pageTitle: "Cart",
        isUser: req.session.userID,
        isAdmin: req.session.isAdmin,
        data: result,
        err: req.flash("validationErrors")[0],
      });
    })
    .catch((err) => res.redirect("/error"));
};

exports.postCart = (req, res, next) => {
  if (validationResult(req).isEmpty()) {
    Cart.create_cart(
      {
        name: req.body.name,
        price: req.body.price,
        amount: req.body.amount,
        userID: req.session.userID,
        productID: req.body.productID,
        timestamp: Date.now(),
      },
      req.body.productID,
      req.body.amount
    )
      .then(() => {
        res.redirect("/cart");
      })
      .catch((err) => res.redirect("/error"));
  } else {
    req.flash("validationErrors", validationResult(req).array());
    res.redirect(req.body.redirect);
  }
};

exports.postSave = async (req, res, next) => {
  if (validationResult(req).isEmpty()) {
    try {
      await Cart.edit_item(req.body.cartID, req.body.amount);
      res.redirect("/cart");
    } catch (err) {
      console.log(err);
    }
  } else {
    req.flash("validationErrors", validationResult(req).array());
    res.redirect("/cart");
  }
};

exports.postRemove = (req, res, next) => {
  Cart.remove_item(req.body.cartID)
    .then(() => res.redirect("/cart"))
    .catch((err) => res.redirect("/error"));
};

exports.postRemoveAll = (req, res) => {
  Cart.removeAll_item()
    .then(() => res.redirect("/cart"))
    .catch((err) => res.redirect("/error"));
};

exports.verifyOrders = (req, res) =>{
  res.render("verify_order", {
    pageTitle: "Verify Order",
    isUser: req.session.userID,
    isAdmin: req.session.isAdmin,
    cartID: req.body.cartID,    
  })
}
