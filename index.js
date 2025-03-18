const http = require("node:http");

const server = http.createServer();

server.on("request", (req, res) => {
    res.end("Hello new ");
});

server.listen(3001, "127.0.0.1", () => {
    const addr = server.address();
    console.log(`Server Running on : ${addr.address}:${addr.port}`);
});