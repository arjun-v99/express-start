// product model
const Product = require("../models/product");

exports.listProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/products-list", {
        prods: products,
        pageTitle: "Products List",
        path: "/products",
      });
    })
    .catch((err) => console.error(err));
};

exports.getHome = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Home",
        path: "/",
      });
    })
    .catch((err) => console.error(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((products) => {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
      });
    })
    .catch((err) => console.error(err));
};

exports.addToCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.fetchById(productId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => res.redirect("/cart"))
    .catch((err) => console.error(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteItemFromCart(prodId)
    .then((products) => {
      res.redirect("/cart");
    })
    .catch((err) => console.error(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then((orders) => {
      res.render("shop/orders", {
        pageTitle: "Orders",
        path: "/orders",
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};

exports.getProductDetail = (req, res, next) => {
  const prodId = req.params.productId;

  Product.fetchById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title + " Detail",
        path: "/products",
      });
    })
    .catch((err) => console.error(err));
};

exports.createOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => console.error(err));
};
