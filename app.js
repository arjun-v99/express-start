const express = require("express");

const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");
const app = express();

// THE KEY LINE: Using Express's built-in URL-encoded parser (Express 4.16.0+)
// No need for body-parser package!
app.use(express.urlencoded({ extended: false }));

app.use(adminRouter.router);
app.use(userRouter.router);

app.listen(3000);
