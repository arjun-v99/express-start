exports.getLogin = (req, res, next) => {
  const cookie = req.get("Cookie");
  const isLoggedIn = cookie ? cookie.split("=")[1] : false;
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isLoggedIn: isLoggedIn,
  });
};

exports.doLogin = (req, res, next) => {
  res.setHeader("Set-Cookie", "loggedIn=true");
  res.redirect("/");
};
