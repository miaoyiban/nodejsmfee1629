const http = require("http");
const { URL } = require("url");
const fs =require("fs/promises")

const server = http.createServer(async(req, res) => {
	console.log("連線了嗎~~~");
	console.log(req.url);
	const path = req.url.replace(/\/?(?:\?.*)?$/, "").toLowerCase();
	const url = new URL(req.url,`http://${req.headers.host}`)
	console.log(url.searchParams)

	res.statusCode = 200;
    res.setHeader("Content-Type","text/plain;charset=UTF-8")
    switch (path) {
			case "":
				res.end("這是首頁，我是K");
				break;
			case "/test":
				res.setHeader("Content-Type", "text/html;charset=UTF-8");
				let content = await fs.readFile("test.html")
				res.end(content);
				break;
			case "/about":
				let name = url.searchParams.get("name")
				res.end(`這是關於我們，你好，${name}`);
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
