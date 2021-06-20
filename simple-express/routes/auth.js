const express = require("express");
const router = express.Router();
const connection = require("../utils/db");

router.get("/register",(req,res)=>{
    res.render("auth/register")
})

router.post("/register", (req, res) => {
	res.send("這裡是POst");
});

router.get("/login", (req, res) => {
	res.render("auth/login");
});


module.exports = router;
