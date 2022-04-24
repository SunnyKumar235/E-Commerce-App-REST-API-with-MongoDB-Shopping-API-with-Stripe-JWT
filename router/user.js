const router = require("express").Router();
const User = require("../modles/User");
const { verifytoken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifytoken');
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_SEC).toString();
    }
    try {
        const updateUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })
        return res.status(200).json(updateUser);
    } catch (error) {
        return res.status(403).json(error)
    }
});

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {

    try {
        await User.findByIdAndDelete(req.params.id);
        return res.status(200).json("User has been deleted");
    } catch (error) {
        return res.status(500).json(error);
    }
});

// Find User
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        return res.status(200).json(others);
    } catch (error) {
        return res.status(500).json(error);
    }
});
// Get all users
router.get("/findAll", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
        const user = query ? await User.find().sort({ _id: -1 }).limit(5) : await User.find();
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json(error);
    }
});

router.get("/stat", verifyTokenAndAdmin, async (req, res) => {
    try {
        const date = new Date();
        const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project :{
                    month: {$month : '$createdAt'}
                },
            },
            {
                $group : {
                    _id: '$month',
                    total : {$sum : 1 }
                },
            },
        ])

        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).send(error);
    }
})

module.exports = router;