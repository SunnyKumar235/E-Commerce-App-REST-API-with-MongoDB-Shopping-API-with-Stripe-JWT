const router = require("express").Router();
const Cart = require("../modles/Cart");
const { verifytoken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifytoken');

router.post('/', verifytoken, async (req, res) => {
    const newCart = new Cart(req.body);
    try {
        const saveCart = await newCart.save();
        return res.status(200).json(saveCart);
    } catch (error) {
        res.status(500).json(error);
    }

})

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updateCart = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })
        return res.status(200).json(updateCart);
    } catch (error) {
        return res.status(403).json(error)
    }
});

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {

    try {
        await Cart.findByIdAndDelete(req.params.id);
        return res.status(200).json("Cart has been deleted");
    } catch (error) {
        return res.status(500).json(error);
    }
});
// Get Cart
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const cart = await Cart.findOne({userId : req.params.userId});
        return res.status(200).json(cart);
    } catch (error) {
        return res.status(500).json(error);
    }
});

// Get all products
router.get("/findAll", verifyTokenAndAdmin, async (req, res) => {
    try{
        const carts = Cart.find();
        return res.status(200).send(carts);
    }catch(error){
        res.status(500).json(error);
    }
  
});

module.exports = router;