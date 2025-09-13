require("dotenv").config();

const path = require("path");

const express = require("express");
const mongoose = require("mongoose");

const rootDir = require("./util/path");

const adminRouter = require("./routes/admin");
const shopRouter = require("./routes/shop");

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");

// specifying Where to find the views. second parameter is the directory name
app.set("views", "views");
// THE KEY LINE: Using Express's built-in URL-encoded parser (Express 4.16.0+)
// No need for body-parser package!
app.use(express.urlencoded({ extended: false }));
// to serve static files
app.use(express.static(path.join(rootDir, "public")));

// app.use((req, res, next) => {
// checking if a user exists by manually giving an _id
// User.findById("68b6ba3bd850cc76f29fec37")
//   .then((user) => {
//     if (user) {
//       // we are creating new user object to avail its methods in req.user
//       req.user = new User(user.username, user.email, user.cart, user._id);
//       // req.user = user;
//       // To continue to next middlewares i.e, routing middlewares
// next();
//     }
//   })
//   .catch((err) => console.error(err));
// });

app.use("/admin", adminRouter.routes);
app.use(shopRouter.router);

// 404 error page
app.use(errorController.urlNotFound);

mongoose
  .connect(process.env.MONGODB_URL)
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => console.error(err));
