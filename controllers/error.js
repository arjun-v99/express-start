const path = require("../util/path");

exports.urlNotFound = (req, res, next) => {
  const cookie = req.get("Cookie");
  const isLoggedIn = cookie ? cookie.split("=")[1] : false;
  res.status(404).render("404", {
    pageTitle: "Page not found",
    path: "**",
    isLoggedIn: isLoggedIn,
  });
};
