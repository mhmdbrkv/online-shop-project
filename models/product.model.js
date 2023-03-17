const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

let Product = mongoose.model(
  "products",
  mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    category: String,
    img: String,
  })
);

let addProduct = (data)=>{
  return new Promise((resolve, reject) => {
    mongoose
      .connect("mongodb://127.0.0.1:27017/online_shop")
      .then(() => new Product(data).save())
      .then(() => {
        mongoose.disconnect();
        resolve();
      }).catch(err => {
        mongoose.disconnect();
        console.log(err);
      })
  });
}

let product = () => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect("mongodb://127.0.0.1:27017/online_shop")
      .then(() => Product.find())
      .then((result) => {
        mongoose.disconnect();
        resolve(result);
      });
  });
};

let info = (x) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect("mongodb://127.0.0.1:27017/online_shop")
      .then(() => Product.findById(x))
      .then((result) => {
        mongoose.disconnect();
        resolve(result);
      });
  });
};

let filter = (categ) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect("mongodb://127.0.0.1:27017/online_shop")
      .then(() => {
        return Product.find({ category: categ });
      })
      .then((result) => {
        mongoose.disconnect();
        resolve(result);
      });
  });
};

module.exports = { product, info, filter, addProduct };
