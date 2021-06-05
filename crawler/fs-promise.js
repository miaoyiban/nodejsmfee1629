const axios = require("axios");
const fs = require("fs/promises");
const moment = require("moment");
const Promise = require("bluebird");

const mysql = require("mysql");
let connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "MFEE1629",
	database: "stock",
});
connection = Promise.promisifyAll(connection);

(async function(){
    try{
        await connection.connectAsync();
				let stockCode = await fs.readFile("stock.txt", "utf-8");
				console.log("stockCode:", stockCode);
				let stock = await connection.queryAsync(
					`SELECT stock_id FROM stock WHERE stock_id=${stockCode}`
				);
				if (stock.length <= 0) {
                    console.log("資料庫沒有的話去api拿資料")
					let response = await axios.get(
						`https://www.twse.com.tw/zh/api/codeQuery?query=${stockCode}`
					);
					let answer = response.data.suggestions
                    .map((item)=>{
                        return item.split("\t");
                    })
                    .find((item)=>{
                        return item[0] === stockCode
                    });
                    // console.log(answer)
					
					if (answer.length > 1) {
						connection.queryAsync(
							`INSERT INTO stock (stock_id, stock_name) VALUES ('${answer[0]}','${answer[1]}') `
						);
                        console.log("進資料庫")
					}
				}
    }catch(err){
        console.log(err)

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
