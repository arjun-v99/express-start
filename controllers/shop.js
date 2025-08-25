// product model
const Product = require("../models/product");
const Cart = require("../models/cart");

exports.listProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([result, metaData]) => {
      res.render("shop/products-list", {
        prods: result,
        pageTitle: "Products List",
        path: "/products",
      });
    })
    .catch((err) => console.error(err));
};

exports.getHome = (req, res, next) => {
  Product.fetchAll()
    .then(([result, metaData]) => {
      res.render("shop/index", {
        prods: result,
        pageTitle: "Home",
        path: "/products",
      });
    })
    .catch((err) => console.error(err));
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: cartProducts,
      });
    });
  });
};

exports.addToCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.getById(productId, (product) => {
    Cart.addToCart(productId, product.price);
  });
  res.redirect("/cart");
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.getById(prodId, (product) => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect("/cart");
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
  Product.getById(prodId)
    .then(([result]) => {
      res.render("shop/product-detail", {
        product: result[0],
        pageTitle: result[0].title + " Detail",
        path: "/products",
      });
    })
    .catch((err) => console.error(err));
};
