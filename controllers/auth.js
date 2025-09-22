const bcrypt = require("bcryptjs");
const { MailtrapClient } = require("mailtrap");

const TOKEN = process.env.MAILTRAP_TOKEN;

const User = require("../models/user");

const client = new MailtrapClient({
  token: TOKEN,
  sandbox: true,
  testInboxId: 4047137,
});

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMsg: message,
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
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMsg: message,
  });
};

exports.signUp = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({ email: email })
    .then((result) => {
      if (result) {
        req.flash("error", "User already exists");
        return res.redirect("/signup");
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

          const sender = {
            email: "hello@example.com",
            name: "Mailtrap Test",
          };
          const recipients = [
            {
              email: "arjun46rv@gmail.com",
            },
          ];

          // Send Email
          return client
            .send({
              from: sender,
              to: recipients,
              subject: "Welcom to Express Start",
              text: "Enjoy our services. Don't hesitate to keep in touch with us for your feedback",
              category: "Integration Test",
            })
            .catch((err) => console.error(err));
        })
        .catch((err) => {
          console.error(err);
        });
    })

    .catch((err) => console.error(err));
};
