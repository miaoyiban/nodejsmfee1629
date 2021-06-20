const express = require("express");
const router = express.Router();
const connection = require("../utils/db");

router.get("/",(req,res)=>{
    res.send("會員中心");
    
})

module.exports = router;
