// product model
const Product = require("../models/product");

exports.addProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.saveProduct = (req, res, next) => {
  const title = req.body.title;
  const imgUrl = req.body.productImg;
  const price = req.body.price;
  const description = req.body.description;

  Product.create({
    title: title,
    price: price,
    imageUrl: imgUrl,
    description: description,
  })
    .then((result) => res.redirect("/admin/products"))
    .catch((err) => console.error(err));
};

exports.listProductsForAdmin = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("admin/list-products", {
        prods: products,
        pageTitle: "Products List | Admin",
        path: "/admin/products",
      });
    })
    .catch((err) => console.error(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => console.error(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.productImg;
  const updatedDesc = req.body.description;
  Product.findByPk(prodId)
    .then((product) => {
      product.title = updatedTitle;
      product.imageUrl = updatedImageUrl;
      product.price = updatedPrice;
      product.description = updatedDesc;
      // this will update the record with the given primary key
      // we are returning the promise here to avoid nested promises and we will catch it in the next then() method
      return product.save();
    })
    .then((result) => {
      // we have to move the redirect here so that the views loads correctly with the updated data.
      // if we placed it outside the promise, it will execute synchronously therefore not getting the latest data
      res.redirect("/admin/products");
    })
    .catch((err) => console.error(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  // We can either delete like this
  Product.destroy({
    where: {
      id: prodId,
    },
  })
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.error(err));
};
