// product model
const Product = require("../models/product");

exports.listProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/products-list", {
      prods: products,
      pageTitle: "Products List",
      path: "/products",
    });
  });
};

exports.getHome = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "Home",
      path: "/products",
    });
  });
};

exports.getCart = (req, res, next) => {
  res.render("shop/cart", {
    pageTitle: "Cart",
    path: "/cart",
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    pageTitle: "Orders",
    path: "/orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};

exports.getProductDetail = (req, res, next) => {
  const prodId = req.params.productId;
  Product.getById(prodId, (prod) => {
    res.render("shop/product-detail", {
      product: prod,
      pageTitle: "Products Detail",
      path: "/products/detail",
    });
  });
};
