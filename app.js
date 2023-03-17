const homeRouter = require("./routes/home-router");
const infoRouter = require("./routes/info-router");
const authRouter = require("./routes/auth-router");
const cartRouter = require("./routes/cart-router");
const orderRouter = require("./routes/orders-router");
const adminRouter = require("./routes/admin-router");
const express = require("express");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const bodyParser = require("body-parser").urlencoded({ extended: true });
const path = require("path");
const session = require("express-session");
const SessionStore = require("connect-mongodb-session")(session);

const STORE = new SessionStore({
  uri: "mongodb://127.0.0.1:27017/online_shop",
  collection: "sessions",
});

const app = express();

mongoose.set("strictQuery", false);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "img")));
app.use(
  session({
    secret: "kokossskokosss",
    resave: true,
    saveUninitialized: false,
    // cookie:{
    //   maxAge: 1*60*60*1000
    // }
    store: STORE,
  })
);
app.use(flash());
app.use("/", homeRouter);
app.use("/", authRouter);
app.use("/info", infoRouter);
app.use("/orders", orderRouter);
app.use("/cart", cartRouter);
app.use("/admin", adminRouter);

app.get("/error", (req, res) => {
  res.status(500);
  res.render("error",{
    isUser: req.session.userID,
    pageTitle: "Error",
    isAdmin: req.session.isAdmin,
  });
});

app.get("/notAdmin", (req, res) => {
  res.status(403);
  res.render("notAdmin",{
    pageTitle: "Error",
    isUser: req.session.userID,
    isAdmin: false,
  });
});



app.use((req, res) => {
  res.status(404);
  res.send("Not Found");
});

app.listen(3000, () => console.log(`Done at http://localhost:3000`));
