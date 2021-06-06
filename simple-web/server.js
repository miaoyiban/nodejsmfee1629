const http = require("http");

const server = http.createServer((req, res) => {
	console.log("連線了嗎~~~");
	console.log(req.url);

	res.statusCode = 200;
    res.setHeader("Content-Type","text/plain;charset=UTF-8")
    switch (req.url) {
			case "/":
				res.end("這是首頁，我是K");
				break;
			case "/test":
				res.end("測試頁面");
				break;
			case "/about":
				res.end("這是關於我們");
				break;
            default:
                res.writeHead(404);
                res.end("Not Found")
		}
    
	// res.write("Hi好想睡覺");
    // res.end();
});

server.listen(3000, () => {
	console.log("跑起來了，收3000port");
});
