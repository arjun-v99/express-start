// product model
const Product = require("../models/product");

exports.addProduct = (req, res, next) => {
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

exports.saveProduct = (req, res, next) => {
  // Passing the payload to obj constructor
  const prod = new Product(req.body.title);
  // calling the save method to push the data to the global array
  prod.save();
  res.redirect("/");
};

exports.listProducts = (req, res, next) => {
  const products = Product.fetchAll();
  res.render("index", { prods: products, pageTitle: "Home Page", path: "/" });
};
