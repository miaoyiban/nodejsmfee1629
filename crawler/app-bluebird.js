const axios = require("axios");
const fs = require("fs");
const moment = require("moment");
const Promise = require("bluebird");


// 因為用bluebird所以不用自己包
// function readFilePromise() {
// 	return new Promise((resolve, reject) => {
// 		fs.readFile("stock.txt", "utf8", (err, data) => {
// 			if (err) {
// 				reject(err);
// 			}
// 			resolve(data);
// 		});
// 	});
// }

// 用bluebird 包 callback版本的readFile

const readFileBlue = Promise.promisify(fs.readFile)

readFileBlue("stock.txt","utf-8")
	.then((stockCode) => {
		console.log("stockCode:", stockCode);

		return axios.get("https://www.twse.com.tw/exchangeReport/STOCK_DAY", {
			params: {
				response: "json",
				date: moment().format("YYYYMMDD"),
				stockNo: stockCode,
			},
		});
	})
	.then((response) => {
		if (response.data.stat === "OK") {
			console.log(response.data.date);
			console.log(response.data.title);
		}
	})
	.catch((err) => {
		console.error(err);
	});
