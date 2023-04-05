const mongoose = require("mongoose");
const url = "mongodb://127.0.0.1:27017/online_shop";

const orderSchema = mongoose.Schema({
  name: String,
  price: Number,
  amount: Number,
  userID: String,
  productID: String,
  timestamp: Number,
  address: String,
  email: String,
  status: {
    type: String,
    default: "pending",
  },
});

const OrderModel = mongoose.model("order", orderSchema);

exports.Add_Order = (data) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(url)
      .then(() => new OrderModel(data).save())
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

exports.save = async (id, status) => {
  try {
    await mongoose.connect(url);
    if (status) await OrderModel.updateOne({ _id: id }, { status: status });
    mongoose.disconnect();
  } catch (err) {
    mongoose.disconnect();
    console.log(err);
  }
};

exports.filter = (status) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(url)
      .then(() => {
        if (status) {
          return OrderModel.find(
            { status: status },
            {},
            { sort: { timestamp: 1 } }
          );
        } else return OrderModel.find({}, {}, { sort: { timestamp: 1 } });
      })
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

exports.emailFilter = (email) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(url)
      .then(() => {
        if (email) {
          return OrderModel.find(
            { email: email },
            {},
            { sort: { timestamp: 1 } }
          );
        } else return OrderModel.find({}, {}, { sort: { timestamp: 1 } });
      })
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

exports.getOrder = (ID = "") => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(url)
      .then(() => {
        if (ID)
          return OrderModel.find(
            { userID: ID },
            {},
            { sort: { timestamp: 1 } }
          );
        else return OrderModel.find({}, {}, { sort: { timestamp: 1 } });
      })
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

exports.remove_item = (ID) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(url)
      .then(() => OrderModel.findByIdAndDelete(ID))
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

exports.removeAll_item = (ID) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(url)
      .then(() => OrderModel.deleteMany({ userID: ID }))
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
