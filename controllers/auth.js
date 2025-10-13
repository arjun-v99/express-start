const crypto = require("crypto");

const bcrypt = require("bcryptjs");
const { MailtrapClient } = require("mailtrap");
const { validationResult } = require("express-validator");

const TOKEN = process.env.MAILTRAP_TOKEN;

const User = require("../models/user");

const client = new MailtrapClient({
  token: TOKEN,
  sandbox: true,
  testInboxId: 4047137,
});

const SENDER = {
  email: "hello@example.com",
  name: "Mailtrap Test",
};
const RECIPIENTS = [
  {
    email: process.env.MAILTRAP_RECIPIENT_MAIL,
  },
];

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
    validationErrors: {},
  });
};

exports.doLogin = (req, res, next) => {
  const validationErrors = validationResult(req);

  const email = req.body.email;
  const password = req.body.password;

  const errors = validationErrors.array();
  const mappedErrors = {};

  if (!validationErrors.isEmpty()) {
    errors.forEach((err) => {
      mappedErrors[err.path] = err.msg;
    });
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      oldInput: { email: email, password: password },
      validationErrors: mappedErrors,
    });
  }
  // checking if a user exists by manually giving an _id
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        // If email is invalid do not give out which field is invalid. so we are setting errors to both fields.
        mappedErrors.email = "Invalid username or password";
        mappedErrors.password = "Invalid username or password";

        return res.status(422).render("auth/login", {
          path: "/login",
          pageTitle: "Login",
          oldInput: { email: email, password: password },
          validationErrors: mappedErrors,
        });
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
          // If password is invalid do not give out which field is invalid. so we are setting errors to both fields.
          mappedErrors.email = "Invalid username or password";
          mappedErrors.password = "Invalid username or password";

          return res.status(422).render("auth/login", {
            path: "/login",
            pageTitle: "Login",
            oldInput: { email: email, password: password },
            validationErrors: mappedErrors,
          });
        })
        .catch((err) => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          next(error);
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
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
    validationErrors: {},
  });
};

exports.signUp = (req, res, next) => {
  const validationErrors = validationResult(req);

  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.array();
    const mappedErrors = {};

    errors.forEach((err) => {
      mappedErrors[err.path] = err.msg;
    });

    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      oldInput: {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      },
      validationErrors: mappedErrors,
    });
  }
  bcrypt
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

      // Send Email
      return client
        .send({
          from: SENDER,
          to: RECIPIENTS,
          subject: "Welcom to Express Start",
          text: "Enjoy our services. Don't hesitate to keep in touch with us for your feedback",
          category: "Integration Test",
        })
        .catch((err) => console.error(err));
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.getResetPwd = (req, res, next) => {
  let errorMessage = req.flash("error");
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }
  let message = req.flash("message");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset-pwd", {
    path: "/reset-password",
    pageTitle: "Reset Password",
    errorMsg: errorMessage,
    message: message,
  });
};

exports.postResetPwd = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/");
    }
    const email = req.body.email;
    const token = buffer.toString("hex");
    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          req.flash("error", "User not found");
          return res.redirect("/login");
        }
        user.resetPwdToken = token;
        user.resetTokenExpiry = Date.now() + 7200000; //in miiliseconds
        return user.save();
      })
      .then((result) => {
        return client.send({
          from: SENDER,
          to: RECIPIENTS,
          subject: "Password Reset",
          html: `<body>
              <p>You have requested for a password reset.Please click on the link below to reset your passowrd or copy and paste it into your browser.</p> 
              <div>Link: ${process.env.DOMAIN}reset-password/${token}</div>
              <br>
              <div>The link will be valid for 2 Hours</div>
              </body>
              `,
          category: "Integration Test",
        });
      })
      .then(() => {
        req.flash(
          "message",
          "A password reset link has been sent to your registered email address"
        );
        res.redirect("/reset-password");
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        next(error);
      });
  });
};

exports.setNewPassword = (req, res, next) => {
  User.findOne({
    resetPwdToken: req.params.token,
    resetTokenExpiry: { $gt: Date.now() },
  })
    .then((user) => {
      let errorMessage = req.flash("error");
      if (errorMessage.length > 0) {
        errorMessage = errorMessage[0];
      } else {
        errorMessage = null;
      }
      res.render("auth/new-pwd", {
        path: "/reset-password",
        pageTitle: "Set new password",
        errorMsg: errorMessage,
        userId: user._id.toString(),
        pwdToken: user.resetPwdToken,
      });
    })
    .catch((err) => {
      console.error(err);
      req.flash("error", "Bad Request");
      res.redirect("/reset-password");
    });
};

exports.postUpdateNewPwd = (req, res, next) => {
  const password = req.body.password;
  const pwdToken = req.body.pwdToken;
  const userId = req.body.userId;
  let foundUser;

  User.findOne({
    resetPwdToken: pwdToken,
    resetTokenExpiry: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      foundUser = user;
      return bcrypt.hash(password, 12);
    })
    .then((hashedPwd) => {
      foundUser.password = hashedPwd;
      foundUser.resetPwdToken = undefined;
      foundUser.resetTokenExpiry = undefined;
      return foundUser.save();
    })
    .then(() => {
      res.redirect("/login");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};
