const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
mongoose.set("strictQuery", false);

let emailSchema = mongoose.Schema({
  userName: String,
  email: String,
  pass: String,
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

let newEmail = mongoose.model("emails", emailSchema);


exports.getElementById = async (ID) => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/online_shop");
    const email = await newEmail.findById(ID);
    await mongoose.disconnect();
    return email;
  } catch (err) {
    console.log(err);
    mongoose.disconnect();
  }
};

exports.createAccount = (username, pass, e_mail) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect("mongodb://127.0.0.1:27017/online_shop")
      .then(() => newEmail.findOne({ email: e_mail }))
      .then((found) => {
        if (found) {
          mongoose.disconnect();
          reject("this email exists, try to log in");
        } else {
          return bcrypt.hash(pass, 10);
        }
      })
      .then((newPass) =>
        new newEmail({
          userName: username,
          email: e_mail,
          pass: newPass,
        }).save()
      )
      .then(() => {
        mongoose.disconnect();
        resolve("Done");
      })
      .catch((err) => {
        mongoose.disconnect();
        reject("this email is already exist, try to log in");
      });
  });
};
/*


  
*/
exports.log = (e_mail, password) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect("mongodb://127.0.0.1:27017/online_shop")
      .then(() => newEmail.findOne({ email: e_mail }))
      .then((user) => {
        if (!user) {
          mongoose.disconnect();
          reject("user not found");
        } else {
          bcrypt.compare(password, user.pass).then((ans) => {
            if (!ans) {
              mongoose.disconnect();
              reject("incorrect password");
            } else {
              mongoose.disconnect();
              resolve({
                id: user._id,
                isAdmin: user.isAdmin,
              });
            }
          });
        }
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};
