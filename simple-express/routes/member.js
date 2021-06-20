const express = require("express");
const router = express.Router();
const connection = require("../utils/db");

router.get("/",(req,res)=>{
    res.render("member");
    
})

module.exports = router;
