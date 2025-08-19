const path = require("path");

const express = require("express");
// const { engine } = require("express-handlebars");

const rootDir = require("./util/path");

const adminData = require("./routes/admin");
const productsRouter = require("./routes/products");
const app = express();

// Registering templating engine
// app.set("view engine", "pug");

// pug was already registered like a built-in. handlebars are not. so we have to set engine explicitly.
// app.engine(
//   "hbs",
//   engine({
//     extname: "hbs",
//     defaultLayout: false,
//     layoutsDir: "views/layouts/",
//   })
// );
// app.set("view engine", "hbs");

app.set("view engine", "ejs");

// specifying Where to find the views. second parameter is the directory name
app.set("views", "views");
// THE KEY LINE: Using Express's built-in URL-encoded parser (Express 4.16.0+)
// No need for body-parser package!
app.use(express.urlencoded({ extended: false }));
// to serve static files
app.use(express.static(path.join(rootDir, "public")));

app.use("/admin", adminData.routes);
app.use(productsRouter.router);

// 404 error page
app.use((req, res, next) => {
  res.status(404).render("404", { pageTitle: "Page not found" });
});

app.listen(3000);
