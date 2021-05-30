//https://www.twse.com.tw/exchangeReport/STOCK_DAY
//?response=json
//&date=20210523
//&stockNo=2330
//&_=1621756492292

const axios = require('axios');
//fs=filesystem，不用安裝node內建
const fs = require("fs");
fs.readFile("stock.txt","utf8",(err,data)=>{
	if(err){
		return console.error("讀檔錯誤",err)
	}
	console.log(`讀到的StockCode ${data}`)

	axios
		.get("https://www.twse.com.tw/exchangeReport/STOCK_DAY", {
			params: {
				response: "json",
				date: "20210529",
				stockNo: data,
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
// const stockCode =???
