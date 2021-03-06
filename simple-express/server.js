const express = require("express");
const { connect } = require("../myweb/routes");
const connection = require("./utils/db");
const Promise = require("bluebird");
const { body, validationResult } = require("express-validator");
require("dotenv").config();

let app = express();

// 加上這個中間鍵就能解讀POST的資料
app.use(express.urlencoded({ extended: false }));
// 前端送json data ,express才能解析
app.use(express.json());
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// 處理session
const expressSession = require("express-session");
app.use(
	expressSession({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
	})
);

// 可以指定一個或多個目錄是靜態資源目錄
// 自動幫你為public裡面的檔案建立路由
app.use(express.static("public"));

// 第一個變數 views 第二個是檔案名稱
app.set("views", "views");
app.set("view engine", "pug");

// 把req.seesion設定給res.locals
app.use(function (req, res, next) {
	// 把request的session資料設定給res的local
	res.locals.member = req.session.member;
	next();
});

app.use(function (req, res, next) {
	// 因為訊息只希望顯示一次
	// 傳到views一次後就刪掉
	if (req.session.message) {
		res.locals.message = req.session.message;
		delete req.session.message;
	}
	next();
});

// 中間件 middleware
app.use(function (req, res, next) {
	let current = new Date();
	console.log(`有人來訪問了在${current}`);
	// 讓他往下繼續
	next();
});

// 所有中間鍵底下

let stockRouter = require("./routes/stock");
app.use("/stock", stockRouter);

let apiRouter = require("./routes/api");
app.use("/api", apiRouter);

let authRouter = require("./routes/auth");
app.use("/auth", authRouter);

let memberRouter = require("./routes/member");
app.use("/member", memberRouter);

// 路由
app.get("/", function (req, res) {
	res.cookie("lang", "zh-TW");

	res.render("index");
	// views/index.pug
});
app.get("/about", function (req, res) {
	res.render("about");
});
app.get("/test", function (req, res) {
	res.send("test Express");
});

// 在所有路由下面
app.use(function (req, res, next) {
	// 表示前面的路由都找不到
	// http　status code : 404
	res.status(404);
	res.render("404");
});

// 500 error
// 放在所有路由後面
// 一定要有四個參數-->最後作錯誤處理
// express的預設處理

app.use(function (err, req, res, next) {
	console.log(err.message);
	res.status(500);
	res.send("500 -Internal Sever Error 請洽系統管理員");
});

app.listen(3000, async () => {
	await connection.connectAsync();
	console.log(`我跑起來了，在port 3000`);
});
