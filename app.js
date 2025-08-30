const path = require("path");

const express = require("express");
// const { engine } = require("express-handlebars");

const rootDir = require("./util/path");
const sequelize = require("./util/databse");
const Product = require("./models/product");
const User = require("./models/user");

const adminRouter = require("./routes/admin");
const shopRouter = require("./routes/shop");
const errorController = require("./controllers/error");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

const app = express();

app.set("view engine", "ejs");

// specifying Where to find the views. second parameter is the directory name
app.set("views", "views");
// THE KEY LINE: Using Express's built-in URL-encoded parser (Express 4.16.0+)
// No need for body-parser package!
app.use(express.urlencoded({ extended: false }));
// to serve static files
app.use(express.static(path.join(rootDir, "public")));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      if (user) {
        // We are storing a user object provided by SEQUELIZE. so that it may additional methods that we can utilise.
        req.user = user;
        // To continue to next middlewares i.e, routing middlewares
        next();
      }
    })
    .catch((err) => console.error(err));
});

app.use("/admin", adminRouter.routes);
app.use(shopRouter.router);

// 404 error page
app.use(errorController.urlNotFound);

// Defining One-to-many relationship on Product & User
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
// Defining One-to-One relationship on Cart & User
Cart.belongsTo(User);
User.hasOne(Cart);
// Defining Many-to-many relationship on Cart & User using a Junction table.
// A Cart can have many products and a product can belongs to many carts
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
// Defining One-to-Many relationship on Order & User
Order.belongsTo(User);
User.hasMany(Order);
// Order can belong to many product
Order.belongsToMany(Product, { through: OrderItem });

// used to check if models defined their tables properly
sequelize
  // .sync({ force: true })
  .sync()
  .then((result) => {
    // hard coding a user instance to the req middleware
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      User.create({ name: "Arjun", email: "arjun@test.com" });
    }
    // return here automatically resolves the user object into a Promise. because we are returning it from a then() method
    return user;
  })
  .then((user) => {
    user.createCart();
    app.listen(3000);
  })
  .catch((err) => console.error(err));
