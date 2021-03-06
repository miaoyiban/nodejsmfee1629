const express = require("express");
const router = express.Router();
const connection = require("../utils/db");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const path = require("path");
const multer = require("multer");

// 設定上傳檔案儲存方式
const myStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, "../", "public", "upload"));
	},
	filename: function (req, file, cb) {
		const ext = file.originalname.split(".").pop();
		cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
	},
});

// 用multer做上傳工具
const uploader = multer({
	storage: myStorage,
	fileFilter: function (req, file, cb) {
		// console.log(file)
		// if (file.mimetype !== "image/jpeg") {
		// 	return cb(new Error("不合法的file type", false));
		// }
		if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
			return cb(new Error("不合格的附檔名", false));
		}

		cb(null, true);
	},
	limits: { fileSize: 1024 * 1024 },
});

router.get("/register", (req, res) => {
	if (req.session.member) {
		req.session.message = {
			title: "重複登入",
			text: "不需要再次註冊",
		};
		return res.redirect(303, "/member");
	}
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

router.post(
	"/register",
	uploader.single("photo"),
	registerRules,
	async (req, res, next) => {
		// 加上中間函式express.urlencoded({ extended: false })的設定就可以解讀post資料
		// console.log(req.body);

		const validatResult = validationResult(req);
		// console.log(validationResul)
		if (!validatResult.isEmpty()) {
			// return next(new Error("註冊表單有問題"));
			let error = validatResult.array();
			req.session.message = {
				title: "資料錯誤",
				text: error[0].msg,
			};
			return res.redirect(303, "/auth/register");
		}

		// 先檢查是否註冊過
		let checkResult = await connection.queryAsync(
			"SELECT * FROM members WHERE email=?",
			req.body.email
		);
		if (checkResult.length > 0) {
			return next(new Error("註冊過了"));
		}

		let filepath = req.file ? "/upload/" + req.file.filename : null;

		let result = await connection.queryAsync(
			"INSERT INTO members (email, password, name, photo) VALUES (?)",
			[
				[
					req.body.email,
					await bcrypt.hash(req.body.password, 10),
					req.body.name,
					filepath,
				],
			]
		);

		res.redirect(303, "/auth/login");
	}
);

router.get("/login", (req, res) => {
	if (req.session.member) {
		req.session.message = {
			title: "重複登入",
			text: "你已經登入過了",
		};
		return res.redirect(303, "/member");
	}
	res.render("auth/login");
});

const loginRules = [
	body("email").isEmail(),
	body("password").isLength({ min: 6 }),
];

router.post("/login", loginRules, async (req, res, next) => {
	console.log(req.body);

	const validatResult = validationResult(req);
	// console.log(validationResul)
	if (!validatResult.isEmpty()) {
		// return next(new Error("登入表單有問題"));
		let error = validatResult.array();
		req.session.message = {
			title: "登入錯誤",
			text: error[0].msg,
		};
		return res.redirect(303, "/auth/login");
	}

	// 檢查email存不存在
	let member = await connection.queryAsync(
		"SELECT * FROM members WHERE email=?",
		req.body.email
	);
	if (member.length === 0) {
		req.session.message = {
			title: "登入錯誤",
			text: "查無此帳號",
		};
		return res.redirect(303, "/auth/login");
	}

	member = member[0];

	// 因為bcrypt每次加密結果都不一樣，不能單純比對字串
	// 必須用bcrypt提供的比對韓式
	let result = await bcrypt.compare(req.body.password, member.password);
	if (result) {
		req.session.member = {
			email: member.email,
			name: member.name,
			photo: member.photo,
		};
		req.session.message = {
			title: "登入成功",
			text: "歡迎回來",
		};
		res.redirect(303, "/");
	} else {
		req.session.member = null;

		// 處理訊息
		req.session.message = {
			title: "登入失敗",
			text: "請填寫正確帳號密碼",
		};
		// 轉跳到登入頁面
		res.redirect(303, "/auth/login");
	}
});

router.get("/logout", (req, res) => {
	req.session.member = null;
	req.session.message = {
		title: "已登出",
		text: "歡迎再回來",
	};
	// 轉跳到登入頁面

	res.redirect(303, "/");
});

module.exports = router;
