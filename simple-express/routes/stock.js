const express = require("express");
const router = express.Router();
const connection = require("../utils/db");

router.get("/", async (req, res) => {
	let queryResults = await connection.queryAsync("SELECT * FROM stock;");
	res.render("stock/list", {
		stocks: queryResults,
	});
});

router.get("/:stockCode", async (req, res, next) => {
	let stock = await connection.queryAsync(
		"SELECT * FROM stock WHERE stock_id=?;",
		req.params.stockCode
	);
	if (stock.length === 0) {
		// throw new Error("查無代碼");
        next(); //-->一直往下跑 落入404
	}
	stock = stock[0];

	// 分頁
	// 一頁有幾筆?
	// 現在在第幾頁?
	// 總共有多少比數-->總頁數

	// 總共有幾筆??
	let count = await connection.queryAsync(
		"SELECT count(*) as total FROM stock_price WHERE stock_id= ?",
		req.params.stockCode
	);
	// console.log(count);
	const total = count[0].total;
	const perPage = 6;
	const lastPage = Math.ceil(total / perPage);

	// 現在在第幾頁
	const currentPage = req.query.page || 1;
	const offset = (currentPage - 1) * perPage;

	let stockdetail = await connection.queryAsync(
		"SELECT * FROM stock_price WHERE stock_id = ? ORDER BY date LIMIT ? OFFSET ?;",
		[req.params.stockCode, perPage, offset]
	);
	res.render("stock/detail", {
		stock,
		stockPrice: stockdetail,
		pagination: {
			lastPage,
			currentPage,
			total,
		},
	});
});

module.exports = router;
