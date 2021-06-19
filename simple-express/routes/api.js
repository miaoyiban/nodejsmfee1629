const express = require("express");
const router = express.Router();
const connection = require("../utils/db");

router.get("/stocks",async (req, res)=>{
    let queryResults = await connection.queryAsync("SELECT * FROM stock;");
    res.json(queryResults);

})
router.get("/stocks/:stockCode", async (req, res)=>{
    let stockdetail = await connection.queryAsync(
			"SELECT * FROM stock_price WHERE stock_id = ? ORDER BY date;",
			req.params.stockCode
		);
        res.json(stockdetail)
})

module.exports = router;