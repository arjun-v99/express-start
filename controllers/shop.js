const fs = require("fs");
const path = require("path");
// product model
const Product = require("../models/product");
const Order = require("../models/order");

exports.listProducts = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  Product.find()
    .then((products) => {
      res.render("shop/products-list", {
        prods: products,
        pageTitle: "Products List",
        path: "/products",
        isLoggedIn: isLoggedIn,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.getHome = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Home",
        path: "/",
        isLoggedIn: isLoggedIn,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.getCart = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  // we are getting the user record and populating productIds with product data
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.addToCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => res.redirect("/cart"))
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeCart(prodId)
    .then((products) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.getOrders = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        pageTitle: "Orders",
        path: "/orders",
        orders: orders,
        isLoggedIn: isLoggedIn,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.getProductDetail = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title + " Detail",
        path: "/products",
        isLoggedIn: isLoggedIn,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.createOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      // Product details will be inside productId property. so we are extracting details from that property.
      const products = user.cart.items.map((i) => {
        // in product property if we only used i.productId it will only pull out the id.
        // So we use a property provided my mongoose to get only the data without the metadata
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });

      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products: products,
      });

      return order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.downloadInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  let invoiceName = "invoice-" + orderId + ".pdf";

  const invoicePath = path.join("data", "invoices", invoiceName);

  res.download(invoicePath, function (err) {
    if (err) {
      return next(err);
    }
  });
};
