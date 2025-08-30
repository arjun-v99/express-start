// product model
const Product = require("../models/product");
const Cart = require("../models/cart");

exports.listProducts = (req, res, next) => {
  Product.findAll()
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
  Product.findAll()
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
    .then((cart) => {
      return cart
        .getProducts()
        .then((products) => {
          res.render("shop/cart", {
            path: "/cart",
            pageTitle: "Your Cart",
            products: products,
          });
        })
        .catch((err) => console.error(err));
    })

    .catch((err) => console.error(err));
};

exports.addToCart = (req, res, next) => {
  const productId = req.body.productId;
  // to make cart locally accessible
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({
        where: {
          id: productId,
        },
      });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        // For products already inside the cart
        const currentQty = product.cartItem.quantity;
        newQuantity = currentQty + 1;
        // returning the product promise that we got from sequelize
        return product;
      }
      // For new products adding too the cart
      // Returning the product if already not found in cart
      return Product.findByPk(productId);
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.error(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.error(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    //we are including products because fetching orders does not fetch products by default.
    // so we have to explicitly tell sequelize to get products also. \
    // this only works if we have defined th relation ofcourse
    .getOrders({ include: ["products"] })
    .then((orders) => {
      console.log(orders);
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

  Product.findByPk(prodId)
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
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      // creating order then adding products
      return req.user
        .createOrder()
        .then((order) => {
          // since different products have different quantites we use a different approach than we used in the cart
          return order.addProducts(
            // map is used through all elements do operations in the element and return a new array with the modifications
            products.map((product) => {
              // you have to
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch((err) => console.error(err));
    })
    .then((result) => {
      return fetchedCart.setProducts(null);
    })
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => console.error(err));
};
