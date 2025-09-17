const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isLoggedIn: isLoggedIn,
  });
};

exports.doLogin = (req, res, next) => {
  // checking if a user exists by manually giving an _id
  User.findById("68c69eaa6b13bcced7161ad6")
    .then((user) => {
      if (user) {
        //the `user` is a mongoose object so we can perform all mongoose action on req.user
        req.session.user = user;
        req.session.isLoggedIn = true;
        req.session.save((err) => {
          console.error(err);
          res.redirect("/");
        });
      }
    })
    .catch((err) => console.error(err));
};

exports.doLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
};
