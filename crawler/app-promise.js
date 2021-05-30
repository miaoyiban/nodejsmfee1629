//https://www.twse.com.tw/exchangeReport/STOCK_DAY
//?response=json
//&date=20210523
//&stockNo=2330
//&_=1621756492292

const { rejects } = require("assert");
const axios = require("axios");
//fs=filesystem，不用安裝node內建

function rFPromise() {
	return new Promise((resolve, reject) => {
		const fs = require("fs");
		fs.readFile("stock.txt", "utf8", (err, data) => {
			if (err) {
				reject("讀檔錯誤", err);
			}
			resolve(data);
		});
	});
}

rFPromise().then((result) => {
	// console.log(result);
    axios
			.get("https://www.twse.com.tw/exchangeReport/STOCK_DAY", {
				params: {
					response: "json",
					date: "20210529",
					stockNo: result,
				},
			})
			.then(function (response) {
				// handle success
				console.log(response.data.title);
			})
			.catch(function (error) {
				// handle error
				console.log(error);
			})
			.then(function () {
				// always executed
			});

});

// axios
// 	.get("https://www.twse.com.tw/exchangeReport/STOCK_DAY", {
// 		params: {
// 			response: "json",
// 			date: "20210529",
// 			stockNo: stackCode,
// 		},
// 	})
// 	.then(function (response) {
// 		// handle success
// 		console.log(response.data.title);
// 	})
// 	.catch(function (error) {
// 		// handle error
// 		console.log(error);
// 	})
// 	.then(function () {
// 		// always executed
// 	});