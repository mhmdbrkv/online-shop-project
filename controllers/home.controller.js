const Product = require("../models/product.model");

const productInfo = (req, res) => {
  Product.info(req.params.id).then((result) => {
    res.render("product-info", {
      pageTitle: "Info",      
      isUser: req.session.userID,
      isAdmin: req.session.isAdmin,
      Info: result,
      error: req.flash("validationErrors")[0]
    });
  }).catch( ()=> res.redirect("/error"))
};

const getAllproducts = (req, res) => {
  let categ = req.query.categories;
  let validCateg = ["Phones", "Clothes", "Cars", "PCs"];
  let homePromise;

  if (validCateg.includes(categ)) homePromise = Product.filter(categ);
  else homePromise = Product.product();

  homePromise.then((result) => {
    res.render("home", {
      pageTitle: "Home",
      products: result,
      isUser: req.session.userID,
      isAdmin: req.session.isAdmin,
      error: req.flash("validationErrors")[0]
    });
  }).catch( ()=> res.redirect("/error"))
};

module.exports = { getAllproducts, productInfo };
