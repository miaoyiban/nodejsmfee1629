//https://www.twse.com.tw/exchangeReport/STOCK_DAY
//?response=json
//&date=20210523
//&stockNo=2330
//&_=1621756492292

const axios = require('axios');
axios
	.get(
		"https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date=20210529&stockNo=2330"
	)
	.then(function (response) {
		// handle success
		console.log(response.data.data);
        
	})
	.catch(function (error) {
		// handle error
		console.log(error);
	})
	.then(function () {
		// always executed
	});