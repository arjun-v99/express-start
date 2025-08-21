// product model
const Product = require("../models/product");

exports.addProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

exports.saveProduct = (req, res, next) => {
  // Passing the payload to obj constructor
  const prod = new Product(
    req.body.title,
    req.body.productImg,
    req.body.price,
    req.body.description
  );
  // calling the save method to push the data to the global array
  prod.save();
  res.redirect("/");
};

exports.listProductsForAdmin = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/list-products", {
      prods: products,
      pageTitle: "Products List | Admin",
      path: "/admin/products",
    });
  });
};
