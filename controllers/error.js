const path = require("../util/path");

exports.urlNotFound = (req, res, next) => {
  res.status(404).render("404", { pageTitle: "Page not found", path: "**" });
};
