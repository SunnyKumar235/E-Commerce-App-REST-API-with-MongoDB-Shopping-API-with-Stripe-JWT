const router = require("express").Router();
const { route } = require("express/lib/application");
const User = require("../modles/User");
const CryptoJS = require('crypto-js');
const JWT = require("jsonwebtoken");

router.post("/register", async (req, res) => {
    const newUser = User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_SEC).toString(),
        IsAdmin : req.body.IsAdmin
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).send(savedUser)
    } catch (error) {
        res.status(500).json(error);
    }

});

//Login 
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        !user &&
            res.status(401).send("Wrong credentionals_1");
        const hashpassword = CryptoJS.AES.decrypt(user.password, process.env.PASSWORD_SEC);
        const Orignialpassword = hashpassword.toString(CryptoJS.enc.Utf8);
        Orignialpassword !== req.body.password &&
            res.status(401).send("Wrong credentionals_2");
        const { password, ...others } = user._doc;
        const accesstoken = JWT.sign({
            id: user._id,
            IsAdmin: user.IsAdmin,
        }, process.env.JWT_SEC, { expiresIn: "3d" });
        return res.status(200).json({...others, accesstoken });
    } catch (error) {
        res.status(500).json(error);
    }


})


module.exports = router;