const express = require("express");

const router = express.Router();

router.get("/add-user", (req, res, next) => {
  res.send(`<html>
    <head><title>Post Example</title></head>
    <body>
    <form action="/save-user" method="POST">
    <div>
    <input type="text" name="username" />
    </div>
    <button type="submit">Add User</button>
    </form></body></html>`);
});

router.post("/save-user", (req, res, next) => {
  console.log(req.body);
  res.redirect("/");
});

exports.router = router;
