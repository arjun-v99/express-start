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
  // Passing the payload to obj constructor
  const prod = new Product(
    null,
    req.body.title,
    req.body.productImg,
    req.body.price,
    req.body.description
  );
  // calling the save method to push the data to the global array
  prod
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => console.error(err));
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

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.getById(prodId, (product) => {
    if (!product) {
      return res.redirect("/");
    }
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.productImg;
  const updatedDesc = req.body.description;
  const updatedProduct = new Product(
    prodId,
    updatedTitle,
    updatedImageUrl,
    updatedPrice,
    updatedDesc
  );
  updatedProduct.save();
  res.redirect("/admin/products");
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId);
  res.redirect("/admin/products");
};
