const express = require("express");
let app = express();

// 可以指定一個或多個目錄是靜態資源目錄
// 自動幫你為public裡面的檔案建立路由
app.use(express.static("public"))

// 中間件 middleware
app.use(function(req, res, next){
    let current = new Date();
    console.log(`有人來訪問了在${current}`)
    // 讓他往下繼續
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
