const express = require("express");
let app = express();

// 中間件 middleware
app.use(function(req, res, next){
    let current = new Date();
    console.log(`有人來訪問了在${current}`)
    next();
})

// 路由
app.get("/",function(req,res){
    res.send("Hello Express");
})
app.get("/about", function (req, res) {
	res.send("About Express");
});
app.get("/test", function (req, res) {
	res.send("test Express");
});

app.listen(3000,()=>{
    console.log(`我跑起來了，在port 3000`)
})
