const express = require("express");
const router = express.Router();
const connection = require("../utils/db");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

router.get("/register", (req, res) => {
	res.render("auth/register");
});

// 註冊表單資料的驗證規則
const registerRules = [
	body("email").isEmail().withMessage("請正確輸入 Email 格式"),
	body("password").isLength({ min: 6 }),
	body("confirmPassword").custom((value, { req }) => {
		return value === req.body.password;
	}),
];

//

router.post("/register", registerRules, async (req, res, next) => {
	// 加上中間函式express.urlencoded({ extended: false })的設定就可以解讀post資料
	console.log(req.body);

	const validatResult = validationResult(req);
	// console.log(validationResul)
	if (!validatResult.isEmpty()) {
		return next(new Error("註冊表單有問題"));
	}

	// 先檢查是否註冊過
	let checkResult = await connection.queryAsync(
		"SELECT * FROM members WHERE email=?",
		req.body.email
	);
	if (checkResult.length > 0) {
		return next(new Error("註冊過了"));
	}

	let result = await connection.queryAsync(
		"INSERT INTO members (email, password, name) VALUES (?)",
		[[req.body.email, await bcrypt.hash(req.body.password, 10), req.body.name]]
	);

	res.send("註冊成功");
});

router.get("/login", (req, res) => {
	res.render("auth/login");
});

module.exports = router;
