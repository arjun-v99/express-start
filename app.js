const path = require("path");

const express = require("express");

const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");
const app = express();

// THE KEY LINE: Using Express's built-in URL-encoded parser (Express 4.16.0+)
// No need for body-parser package!
app.use(express.urlencoded({ extended: false }));

app.use("/admin", adminRouter.router);
app.use(userRouter.router);

// 404 error page
app.use((req, res, next) => {
  res.status(404);
  res.sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(3000);
