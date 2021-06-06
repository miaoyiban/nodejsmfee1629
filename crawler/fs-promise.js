const axios = require("axios");
const fs = require("fs/promises");
const moment = require("moment");
const Promise = require("bluebird");
require("dotenv").config();

const mysql = require("mysql");
let connection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
});
connection = Promise.promisifyAll(connection);

(async function(){
    try{
			await connection.connectAsync();
			let stockCode = await fs.readFile("stock.txt", "utf-8");
			console.log("stockCode:", stockCode);
			let stock = await connection.queryAsync(
				`SELECT stock_id FROM stock WHERE stock_id=?`,
				[stockCode]
			);
			console.log("確認資料庫資料筆數" + stock.length);
			if (stock.length <= 0) {
				console.log("資料庫沒有的話去api拿資料");
				let response = await axios.get(
					`https://www.twse.com.tw/zh/api/codeQuery?query=${stockCode}`
				);
				let answer = response.data.suggestions
					.map((item) => {
						return item.split("\t");
					})
					.find((item) => {
						return item[0] === stockCode;
					});
				console.log(response.data.suggestions);
				console.log("股票資料:", answer);
				if (answer === undefined) {
					throw "沒有符合的代碼";
				}

				if (answer.length > 1) {
					console.log(`股票名稱${answer[0]},${answer[1]}`);
					connection.queryAsync(
						`INSERT INTO stock (stock_id, stock_name) VALUES (?); `,
						[answer]
					);
					console.log("進資料庫");
				} else {
					throw "查詢錯誤";
				}
			}
			console.log(`查詢股票成交資料 ${stockCode}`);
			let prices = await axios.get(
				"https://www.twse.com.tw/exchangeReport/STOCK_DAY",
				{
					params: {
						response: "json",
						date: moment().format("YYYYMMDD"),
						stockNo: stockCode,
					},
				}
			);
			if (prices.data.stat !== "OK") {
				throw "查詢股價失敗";
			}
			// 處理資料
			// console.log(prices.data.data);
			// 處理多筆資料
			// 民國年
			// '1,639,689,721' 字串、而且有逗號 --> 要處理逗號，然後再轉數字
			// +13.00 不需要先處理 + - 號
			// "日期","成交股數","成交金額","開盤價","最高價","最低價","收盤價","漲跌價差","成交筆數"]
			// 作法一，利用promise.all處理
			// let insertPromise = prices.data.data.map((target)=>{
				
			// 	target = target.map((value) => {
			// 		return value.replace(/,/g, "");
			// 	});
			// 	// 民國年轉西元年
			// 	target[0] = parseInt(target[0].replace(/\//g, ""), 10) + 19110000;
			// 	target[0] = moment(target[0], "YYYYMMDD").format("YYYY-MM-DD");
			// 	target.unshift(stockCode);
			// 	    return connection.queryAsync(
			// 		"INSERT IGNORE INTO stock_price (stock_id,date,volume,amount,open_price,high_price,low_price,close_price,delta_price,transactions) VALUES (?);",
			// 		[target]
			// 	);
			// })
			// // console.log(insertPromise)
			// let insertResult= await Promise.all(insertPromise)
			// console.log(insertResult.length)
			
			
			// 作法二:批次輸入資料
			let prepareData =prices.data.data.map((target)=>{
				
				target = target.map((value) => {
					return value.replace(/,/g, "");
				});
				// console.log(prepareData)
				// 民國年轉西元年
				target[0] = parseInt(target[0].replace(/\//g, ""), 10) + 19110000;
				target[0] = moment(target[0], "YYYYMMDD").format("YYYY-MM-DD");
				target.unshift(stockCode);
				return target;				
				
			})
			console.log(prepareData)
			let insertResult = await connection.queryAsync(
					"INSERT IGNORE INTO stock_price (stock_id,date,volume,amount,open_price,high_price,low_price,close_price,delta_price,transactions) VALUES ?;",
					[prepareData]
				);
				console.log(insertResult)
		}catch(err){
        console.error(err)

    }finally{
        connection.end();
    }
})();


// fs.readFile("stock.txt", "utf-8")
// 	.then((stockCode) => {
// 		console.log("stockCode:", stockCode);

// 		connection.query(
// 			`SELECT stock_id FROM stock WHERE stock_id=${stockCode}`,
// 			function (err, result) {
// 				if (err) {
// 					throw err;
// 				}
// 				if (result === 0) {
// 					return axios.get(
// 						`https://www.twse.com.tw/zh/api/codeQuery?query=${stockCode}`
// 					);
// 				}
// 			}
// 		);
// 	})
// 	.then((response) => {
// 		// console.log(response.data.suggestions);
		// let answer = response.data.suggestions.shift();
		// let answers = answer.split("\t");
		// console.log(answers);
		// answers[0]->stock_id,answer[1]->stock_name

		// if (answers.length > 1) {
		// 	connection.query(
		// 		`INSERT INTO stock (stock_id, stock_name) VALUES ('${answers[0]}','${answers[1]}') `,
		// 		function (err, result) {
		// 			if (err) {
		// 				throw err;
		// 			}
		// 			console.log(result);
		// 		}
			// );
// 		} else {
// 			throw "查不到名稱";
// 		}
// 	})
// 	.catch((err) => {
// 		console.error(err);
// 	})
// 	.finally(() => {
// 		connection.end();
// 	});

// if (response.data.stat === "OK") {
// 		console.log(response.data.date);
// 		console.log(response.data.title);
// 	}
