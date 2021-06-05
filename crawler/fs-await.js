const axios = require("axios");
const fs = require("fs/promises");
const moment = require("moment");

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

(async function () {
	try {
		
		let stockCode = await fs.readFile("stock.txt","utf-8");
		let response = await axios.get(
			"https://www.twse.com.tw/exchangeReport/STOCK_DAY",
			{
				params: {
					response: "json",
					date: moment().format("YYYYMMDD"),
					stockNo: stockCode,
				},
			}
		);
		if (response.data.stat === "OK") {
			console.log(response.data.date);
			console.log(response.data.title);
		} else {
			
		}
	} catch (err) {
		console.error(err);
		
	}
})();
