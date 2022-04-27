const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_SEC);

router.post("/payment", (req,res)=>{
    stripe.charges.create({
        source : req.body.token,
        amount : req.body.amount,
        currency : "usd"
    },
    (stripeError, stripeSuccess)=>{
        if(stripeError){
            return res.status(500).json(stripeError);
        }
        res.status(200).json(stripeSuccess);

    });
     
});
module.exports = router;