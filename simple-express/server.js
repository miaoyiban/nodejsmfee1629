const express = require("express");
const { connect } = require("../myweb/routes");
const connection  = require("./utils/db");
const Promise = require("bluebird");
let app = express();


// 可以指定一個或多個目錄是靜態資源目錄
// 自動幫你為public裡面的檔案建立路由
app.use(express.static("public"))

// 第一個變數 views 第二個是檔案名稱
app.set("views","views");
app.set("view engine","pug");

// 中間件 middleware
app.use(function(req, res, next){
    let current = new Date();
    console.log(`有人來訪問了在${current}`)
    // 讓他往下繼續
    next();
})



// 路由
app.get("/",function(req,res){
    res.render("index")
    // views/index.pug
})
app.get("/about", function (req, res) {
	res.render("about")
});
app.get("/test", function (req, res) {
	res.send("test Express");
    
});

app.get("/stock",async (req, res)=>{
    let queryResults = await connection.queryAsync("SELECT * FROM stock;")
    res.render("stock/list", {
			stocks: queryResults,
		});
})

app.get("/stock/:stockCode",async (req,res)=>{
    let stockdetail = await connection.queryAsync("SELECT * FROM stock_price WHERE stock_id = ? ORDER BY date;",req.params.stockCode)
    res.render("stock/detail",{
        stockPrice: stockdetail
    })
})

app.listen(3000,async()=>{
    await connection.connectAsync();
    console.log(`我跑起來了，在port 3000`)
})
