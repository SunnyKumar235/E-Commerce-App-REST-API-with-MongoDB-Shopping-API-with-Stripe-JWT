const router = require("express").Router();

router.get("/usertest", (req, res) => {
    res.send("user is succsfuly");
})
router.post("/userposttest",(req, res)=>{
    const username = req.body.username;
    res.send("user post is successfully : "+username);
})
module.exports = router;