const router = require("express").Router();
const Product = require("../modles/Product");
const { verifytoken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifytoken');

router.post('/', verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body);
    try {
        const saveProduct = await newProduct.save();
        return res.status(200).json(saveProduct);
    } catch (error) {
        res.status(500).json(error);
    }

})

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updateProduct = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })
        return res.status(200).json(updateProduct);
    } catch (error) {
        return res.status(403).json(error)
    }
});

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {

    try {
        await Product.findByIdAndDelete(req.params.id);
        return res.status(200).json("Product has been deleted");
    } catch (error) {
        return res.status(500).json(error);
    }
});
// Find User
router.get("/find/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json(error);
    }
});

// Get all products
router.get("/findAll", verifyTokenAndAdmin, async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.Category;
    let products;
    try {
        if (qCategory) {
            products = await Product.find({
                categories: {
                    $in: [qCategory]
                }
            })
        } else if (qNew) {
            products = await Product.find().sort({ _createdAt: -1 }).limit(5);
        } else {
            products = await Product.find();
        }
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json(error);
    }
});

module.exports = router;