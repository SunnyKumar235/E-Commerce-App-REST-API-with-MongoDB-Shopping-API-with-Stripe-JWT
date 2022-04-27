const express = require('express')
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
const cors = require('cors');
const userRouter = require("./router/user");
const auth = require("./router/auth");
const productRouter = require("./router/product");
const orderRouter = require("./router//order");
const cartRouter = require("./router/cart");
const paymentRouter = require("./router/stripe");
app.use(cors());
app.use("/api/users", userRouter);
app.use("/api/auth", auth);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/carts", cartRouter);
app.use('/api/checkount', paymentRouter);

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
mongoose.connect(process.env.MONGO_URL).then(() => { console.log("connent mongoose") }).catch((err => { console.log("Eror in db :" + err) }));
app.listen(process.env.port || 1000, () => {
    console.log("Server is running");
})