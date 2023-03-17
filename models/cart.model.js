const mongoose = require("mongoose");
const url = "mongodb://127.0.0.1:27017/online_shop";

const cartSchema = mongoose.Schema({
  name: String,
  price: Number,
  amount: Number,
  userID: String,
  productID: String,
  timestamp: Number,
});

const CartModel = mongoose.model("cart", cartSchema);

exports.getAllCarts = () => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(url)
      .then(() => CartModel.find({}, {}, { sort: { timestamp: 1 } }))
      .then((data) => {
        mongoose.disconnect();
        resolve(data);
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};
exports.getCart = (ID) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(url)
      .then(() =>
        CartModel.find({ userID: ID }, {}, { sort: { timestamp: 1 } })
      )
      .then((data) => {
        mongoose.disconnect();
        resolve(data);
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};

exports.create_cart = (data, product_ID, Amount) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(url)
      .then(() => CartModel.findOne({ productID: product_ID }))
      .then((found) => {
        if (found) {
          return CartModel.updateOne(
            { productID: product_ID },
            { amount: +found.amount + +Amount, timestamp: Date.now() }
          );
        } else {
          return new CartModel(data).save();
        }
      })
      .then(() => {
        mongoose.disconnect();
        resolve();
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};

// exports.edit_item = (ID, data) => {
//   return new Promise((resolve, reject) => {
//     mongoose
//       .connect(url)
//       .then(() => CartModel.updateOne({ _id: ID }, { amount: data }))
//       .then(() => {
//         mongoose.disconnect();
//         resolve();
//       })
//       .catch((err) => {
//         mongoose.disconnect();
//         reject(err);
//       });
//   });
// };

exports.edit_item = async (ID, data) => {
  try {
    await mongoose.connect(url);
    await CartModel.updateOne({ _id: ID }, { amount: data });
    mongoose.disconnect();
  } catch (err) {
    mongoose.disconnect();
  }
};

exports.remove_item = (ID) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(url)
      .then(() => CartModel.findByIdAndDelete(ID))
      .then(() => {
        mongoose.disconnect();
        resolve();
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};

exports.removeAll_item = () => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(url)
      .then(() => CartModel.deleteMany())
      .then(() => {
        mongoose.disconnect();
        resolve();
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};

exports.getCartByid = (ID) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(url)
      .then(() => CartModel.findById(ID))
      .then((data) => {
        mongoose.disconnect();
        resolve(data);
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};
