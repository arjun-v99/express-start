const fs = require("fs");
const path = require("path");

const PDFDocument = require("pdfkit");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// product model
const Product = require("../models/product");
const Order = require("../models/order");

const ITEMS_PER_PAGE = 2;

exports.listProducts = (req, res, next) => {
  const pageNo = parseInt(req.query.page) || 1;
  const isLoggedIn = req.session.isLoggedIn;
  let totalCount;

  Product.countDocuments()
    .then((numberofProducts) => {
      totalCount = numberofProducts;
      return Product.find()
        .skip((pageNo - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/products-list", {
        prods: products,
        pageTitle: "Products List",
        path: "/products",
        isLoggedIn: isLoggedIn,
        currentPage: pageNo,
        hasNextPage: ITEMS_PER_PAGE * pageNo < totalCount,
        hasPrevPage: pageNo > 1,
        nextPage: pageNo + 1,
        prevPage: pageNo - 1,
        // increments to next number for the result of this division
        lastPage: Math.ceil(totalCount / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.getHome = (req, res, next) => {
  const pageNo = parseInt(req.query.page) || 1;
  const isLoggedIn = req.session.isLoggedIn;
  let totalCount;

  Product.countDocuments()
    .then((numberofProducts) => {
      totalCount = numberofProducts;
      return Product.find()
        .skip((pageNo - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Home",
        path: "/",
        isLoggedIn: isLoggedIn,
        currentPage: pageNo,
        hasNextPage: ITEMS_PER_PAGE * pageNo < totalCount,
        hasPrevPage: pageNo > 1,
        nextPage: pageNo + 1,
        prevPage: pageNo - 1,
        // increments to next number for the result of this division
        lastPage: Math.ceil(totalCount / ITEMS_PER_PAGE),
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
        isLoggedIn: isLoggedIn,
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

  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("Unable to find the order"));
      }

      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("You don't have permission to do this"));
      }

      let invoiceName = "invoice-" + orderId + ".pdf";

      // const invoicePath = path.join("data", "invoices", invoiceName);

      const invoiceDoc = new PDFDocument();
      // Set response headers
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="' + invoiceName + '"'
      );
      invoiceDoc.pipe(res);

      // Add content to the PDF
      invoiceDoc
        .fontSize(24)
        .text("Invoice", { underline: true, align: "center" });
      invoiceDoc.moveDown();
      let totalPrice = 0;
      order.products.forEach((prodObj) => {
        totalPrice += prodObj.quantity * prodObj.product.price;
        invoiceDoc
          .fontSize(14)
          .text(
            prodObj.product.title +
              " - " +
              prodObj.quantity +
              " x " +
              "$" +
              prodObj.product.price
          );
      });
      invoiceDoc.moveDown(2);
      invoiceDoc.fontSize(18).text("Total Price: $" + totalPrice);
      // Finalize the PDF and end the stream
      invoiceDoc.end();
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.getCheckout = (req, res, next) => {
  let totalAmount = 0;
  let products;
  const isLoggedIn = req.session.isLoggedIn;
  // we are getting the user record and populating productIds with product data
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      products = user.cart.items;
      products.forEach((prod) => {
        totalAmount += prod.quantity * prod.productId.price;
      });
      return stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: products.map((p) => {
          return {
            price_data: {
              currency: "usd",
              unit_amount: Math.round(p.productId.price * 100),
              product_data: {
                name: p.productId.title,
                description: p.productId.description,
              },
            },
            quantity: p.quantity,
          };
        }),
        success_url:
          req.protocol + "://" + req.get("host") + "/checkout/success",
        cancel_url: req.protocol + "://" + req.get("host") + "/checkout/cancel",
      });
    })
    .then((session) => {
      res.render("shop/checkout", {
        path: "/checkout",
        pageTitle: "Checkout",
        products: products,
        isLoggedIn: isLoggedIn,
        totalAmount: totalAmount,
        sessionUrl: session.url,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};
