require("dotenv").config();

const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const rootDir = require("./util/path");

const adminRouter = require("./routes/admin");
const shopRouter = require("./routes/shop");
const authRoutes = require("./routes/auth");

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();
const store = new MongoDBStore({
  uri: process.env.MONGODB_URL,
  collection: "sessions",
});

app.set("view engine", "ejs");

// specifying Where to find the views. second parameter is the directory name
app.set("views", "views");
// THE KEY LINE: Using Express's built-in URL-encoded parser (Express 4.16.0+)
// No need for body-parser package!
app.use(express.urlencoded({ extended: false }));
// to serve static files
app.use(express.static(path.join(rootDir, "public")));
// initialising session middleware
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (user) {
        //the `user` is a mongoose object so we can perform all mongoose action on req.user
        req.user = user;
        next();
      }
    })
    .catch((err) => console.error(err));
});

app.use("/admin", adminRouter.routes);
app.use(shopRouter.router);
app.use(authRoutes.routes);

// 404 error page
app.use(errorController.urlNotFound);

mongoose
  .connect(process.env.MONGODB_URL)
  .then((result) => {
    // Create a user if it does not exists
    User.findOne().then((result) => {
      if (!result) {
        const user = new User({
          name: "John Doe",
          email: "john.doe@test.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch((err) => console.error(err));
