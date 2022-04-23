const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        products :[
            {
                productId :{type : String},
                quantiry : {type: Number, default : 1}
            }
        ],
        amount :{
            type : Number, 
            required : true
        },
        address : {
            type : Object,
            require: true
        },
        status : {
            type : String,
            default : "Pending"
        }
        
    },{timestamps:true}
)
module.exports = mongoose.model("Order", OrderSchema);