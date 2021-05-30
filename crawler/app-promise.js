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
				reject(err);
			}
			resolve(data);
		});
	});
}

let date=new Date();
// console.log(date);
let year =date.getFullYear()
// console.log(year)
let month = (date.getMonth() + 1 < 10 ? "0" : "") + (date.getMonth() + 1);
// console.log(month);
let day = (date.getDate() + 1 < 10 ? "0" : "") + date.getDate() ;
// console.log(day)
let fullDate=year+month+day
// console.log(fullDate)

rFPromise().then((result) => {
	console.log(result);
    
    return axios.get("https://www.twse.com.tw/exchangeReport/STOCK_DAY", {
			params: {
				response: "json",
				date: fullDate,
				stockNo: result,
			},
		});
})
.then((response=>{
    console.log(response.data.title);
}))
.catch((err)=>{
    console.error(err)
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
