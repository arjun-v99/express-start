const express = require("express");

const app = express();

// app.use((req, res, next) => {
//   console.log("first middleware");
//   next();
// });

// app.use((req, res, next) => {
//   console.log("second middleware");
//   res.send("<h1>Home page</h1>");
// });

app.use("/users", (req, res, next) => {
  console.log("Users routing middleware");
  res.send("<h2>Users Page</h2>");
});

app.use("/", (req, res, next) => {
  console.log("Home Routing Middleware");
  res.send("<h1>Home Page</h1>");
});

app.listen(3000);
