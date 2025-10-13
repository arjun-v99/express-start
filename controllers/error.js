const path = require("../util/path");

exports.urlNotFound = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  res.status(404).render("404", {
    pageTitle: "Page not found",
    path: "**",
    isLoggedIn: isLoggedIn,
  });
};

exports.internalServerError = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  res.status(500).render("500", {
    pageTitle: "Internal Server Error",
    path: "/500",
    isLoggedIn: isLoggedIn,
  });
};
