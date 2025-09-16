// product model
const Product = require("../models/product");

exports.addProduct = (req, res, next) => {
  const cookie = req.get("Cookie");
  const isLoggedIn = cookie ? cookie.split("=")[1] : false;
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    isLoggedIn: isLoggedIn,
  });
};

exports.saveProduct = (req, res, next) => {
  const title = req.body.title;
  const imgUrl = req.body.productImg;
  const price = req.body.price;
  const description = req.body.description;
  // we can create a Obj instance here becuase we are exporting a model from mongoose
  // constructor value is value with structure we defined in the product schema.
  const product = new Product({
    title: title,
    price: price,
    imageUrl: imgUrl,
    description: description,
    userId: req.user._id,
  });
  product
    .save()
    .then((result) => {
      console.log("product Saved");
      res.redirect("/admin/products");
    })
    .catch((err) => console.error(err));
};

exports.listProductsForAdmin = (req, res, next) => {
  const cookie = req.get("Cookie");
  const isLoggedIn = cookie ? cookie.split("=")[1] : false;
  Product.find()
    // .select("title price -_id")          we can use select() for selecting only required properties from our document. adding - before the property name will not select the property.
    // .populate("userId")                  we can populate the userId with users details. we can also use a second parameter for specifying which properties should it select from the document.
    .then((products) => {
      res.render("admin/list-products", {
        prods: products,
        pageTitle: "Products List | Admin",
        path: "/admin/products",
        isLoggedIn: isLoggedIn,
      });
    })
    .catch((err) => console.error(err));
};

exports.getEditProduct = (req, res, next) => {
  const cookie = req.get("Cookie");
  const isLoggedIn = cookie ? cookie.split("=")[1] : false;
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
        isLoggedIn: isLoggedIn,
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

  Product.findById(prodId)
    .then((product) => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.imageUrl = updatedImageUrl;
      product.description = updatedDesc;
      product.save();
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

  Product.findByIdAndDelete(prodId)
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.error(err));
};
