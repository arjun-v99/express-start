require("dotenv").config();

const path = require("path");

const express = require("express");
// const { engine } = require("express-handlebars");

const rootDir = require("./util/path");

const adminRouter = require("./routes/admin");
const shopRouter = require("./routes/shop");

const mongoConnect = require("./util/databse").mongoConnect;
const errorController = require("./controllers/error");

const app = express();

app.set("view engine", "ejs");

// specifying Where to find the views. second parameter is the directory name
app.set("views", "views");
// THE KEY LINE: Using Express's built-in URL-encoded parser (Express 4.16.0+)
// No need for body-parser package!
app.use(express.urlencoded({ extended: false }));
// to serve static files
app.use(express.static(path.join(rootDir, "public")));

app.use((req, res, next) => {
  // User.findByPk(1)
  //   .then((user) => {
  //     if (user) {
  //       // We are storing a user object provided by SEQUELIZE. so that it may additional methods that we can utilise.
  //       req.user = user;
  //       // To continue to next middlewares i.e, routing middlewares
  //       next();
  //     }
  //   })
  //   .catch((err) => console.error(err));
  next();
});

app.use("/admin", adminRouter.routes);
app.use(shopRouter.router);

// 404 error page
app.use(errorController.urlNotFound);

mongoConnect((client) => {
  // console.log(client);
  app.listen(3000);
});
