const JWT = require("jsonwebtoken");

const verifytoken = (req, res, next)=>{

    const authHeader = req.headers.token;
    if(!authHeader){
        return res.status(401).json("You are not verified user")
    }
    const token = authHeader.split(" ")[1];
    JWT.verify(token, process.env.JWT_SEC,(error , user)=>{
        if(error)return res.status(401).json("Token is not verified");
        req.user = user;
        next();

    });
 
}
const verifyTokenAndAuthorization = (req, res, next) =>{
    verifytoken(req, res, ()=>{
        if(req.user.id ===req.params.id || req.params.isAdmin){
            next();
        }else {
            res.status(403).send("You are not allow to do that");
        }
    })
}

const verifyTokenAndAdmin = (req, res, next) =>{
    verifytoken(req, res, ()=>{
        if(req.user.IsAdmin){
            next();
        }else {
            res.status(403).send("You are not allow to do that");
        }
    })
}
module.exports = {verifytoken, verifyTokenAndAuthorization, verifyTokenAndAdmin}