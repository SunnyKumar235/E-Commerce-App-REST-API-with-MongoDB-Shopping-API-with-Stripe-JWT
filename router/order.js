const router = require("express").Router();
const Order = require("../modles/Order");
const { verifytoken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifytoken');

router.post('/', verifytoken, async (req, res) => {
    const newOrder = new Order(req.body);
    try {
        const saveOrder = await newOrder.save();
        return res.status(200).json(saveOrder);
    } catch (error) {
        res.status(500).json(error);
    }

})

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updateOrder = await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })
        return res.status(200).json(updateOrder);
    } catch (error) {
        return res.status(403).json(error)
    }
});

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {

    try {
        await Order.findByIdAndDelete(req.params.id);
        return res.status(200).json("Cart has been deleted");
    } catch (error) {
        return res.status(500).json(error);
    }
});
// Get Order
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const orders = await Order.find({userId : req.params.userId});
        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json(error);
    }
});

// Get all products
router.get("/findAll", verifyTokenAndAdmin, async (req, res) => {
    try{
        const orders = Order.find();
        return res.status(200).send(orders);
    }catch(error){
        res.status(500).json(error);
    }
  
});
//Get montly income
router.get("/income", verifyTokenAndAdmin, async(req,res)=>{
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth()-1));
    const prevousMonth = new Date(new Date().setMonth(lastMonth.getMonth()-1));
    console.log(lastMonth);
    console.log(prevousMonth);
    try{
        const income = await Order.aggregate([
            {$match : {createdAt :{$gte: prevousMonth}}},
            {
                $project: {
                    month:{$month : "$createdAt"},
                    sales : "$amount",
                }},
                {
                    $group:{
                        _id:"$month",
                        total : {$sum:"$sales"}
                    }
                }
                
        ])
        return res.status(200).send(income);
    }catch (error){
        return res.status(500).send(error);
    }
})

module.exports = router;