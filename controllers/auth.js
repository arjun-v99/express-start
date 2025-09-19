const bcrypt = require("bcryptjs");

const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMsg: req.flash("error"),
  });
};

exports.doLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  // checking if a user exists by manually giving an _id
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password");
        res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            //the `user` is a mongoose object so we can perform all mongoose action on req.user
            req.session.user = user;
            req.session.isLoggedIn = true;
            return req.session.save((err) => {
              console.error(err);
              res.redirect("/");
            });
          }
          req.flash("error", "Invalid email or password");
          res.redirect("/login");
        })
        .catch((err) => console.error(err));
    })
    .catch((err) => console.error(err));
};

exports.doLogout = (req, res, next) => {
  req.session.isLoggedIn = false;
  req.session.destroy((err) => {
    res.redirect("/");
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isLoggedIn: false,
  });
};

exports.signUp = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({ email: email })
    .then((result) => {
      if (result) {
        res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPwd) => {
          const user = new User({
            email: email,
            password: hashedPwd,
            cart: { items: [] },
          });

          return user.save();
        })
        .then(() => {
          res.redirect("/login");
        });
    })

    .catch((err) => console.error(err));
};
