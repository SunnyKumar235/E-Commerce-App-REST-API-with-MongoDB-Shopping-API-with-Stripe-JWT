const express = require('express')
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
const userRouter = require("./router/user");
const auth  = require("./router/auth");
app.use("/api/users", userRouter);
app.use("/api/auth", auth);
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
mongoose.connect(process.env.MONGO_URL).then(() => { console.log("connent mongoose") }).catch((err => { console.log("Eror in db :" + err) }));
app.listen(process.env.port || 1000, () => {
    console.log("Server is running");
})