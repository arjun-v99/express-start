const path = require("path");

const express = require("express");

const rootDir = require("./util/path");

const adminData = require("./routes/admin");
const productsRouter = require("./routes/products");
const app = express();

// Registering templating engine
app.set("view engine", "pug");
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
  res.status(404);
  res.sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(3000);
