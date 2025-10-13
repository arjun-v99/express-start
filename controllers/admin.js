const { validationResult } = require("express-validator");

// product model
const Product = require("../models/product");

exports.addProduct = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    validationErrors: {},
    isLoggedIn: isLoggedIn,
  });
};

exports.saveProduct = (req, res, next) => {
  const validationErrors = validationResult(req);

  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;

  if (!image) {
    return res.status(422).render("admin/edit-product", {
      path: "/admin/add-product",
      pageTitle: "Add Product",
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description,
      },
      validationErrors: { productImg: "Invalid file" },
    });
  }

  const imageUrl = image.path;

  const errors = validationErrors.array();
  const mappedErrors = {};

  if (!validationErrors.isEmpty()) {
    errors.forEach((err) => {
      mappedErrors[err.path] = err.msg;
    });
    return res.status(422).render("admin/edit-product", {
      path: "/admin/add-product",
      pageTitle: "Add Product",
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description,
      },
      validationErrors: mappedErrors,
    });
  }

  // we can create a Obj instance here becuase we are exporting a model from mongoose
  // constructor value is value with structure we defined in the product schema.
  const product = new Product({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
    userId: req.user._id,
  });
  product
    .save()
    .then((result) => {
      console.log("product Saved");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.listProductsForAdmin = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  Product.find({ userId: req.user._id })
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
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
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
        hasError: false,
        validationErrors: {},
        product: product,
        isLoggedIn: isLoggedIn,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const validationErrors = validationResult(req);

  const prodId = req.body.productId;

  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImage = req.file;
  const updatedDesc = req.body.description;

  const errors = validationErrors.array();
  const mappedErrors = {};

  if (!validationErrors.isEmpty()) {
    errors.forEach((err) => {
      mappedErrors[err.path] = err.msg;
    });
    return res.status(422).render("admin/edit-product", {
      path: "/admin/edit-product",
      pageTitle: "Edit Product",
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDesc,
        _id: prodId,
      },
      validationErrors: mappedErrors,
    });
  }

  Product.findById(prodId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        res.redirect("/");
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      // if user uploaded a new image
      if (updatedImage) {
        product.imageUrl = updatedImage.path;
      }
      product.description = updatedDesc;
      product.save().then((result) => {
        // we have to move the redirect here so that the views loads correctly with the updated data.
        // if we placed it outside the promise, it will execute synchronously therefore not getting the latest data
        res.redirect("/admin/products");
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findByIdAndDelete({ _id: prodId, userId: req.user._id })
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};
