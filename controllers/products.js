const products = [];

exports.addProduct = (req, res, next) => {
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

exports.saveProduct = (req, res, next) => {
  products.push({ title: req.body.title });
  res.redirect("/");
};

exports.listProducts = (req, res, next) => {
  res.render("index", { prods: products, pageTitle: "Home Page", path: "/" });
};
