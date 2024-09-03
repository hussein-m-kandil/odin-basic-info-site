import http from "http";

http
  .createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader("content-type", "text/html");
    res.end("<h1>Welcome to the Odin Basic Information Site</h1>");
  })
  .listen(8080, console.log("Server running at http://localhost:8080/"));
