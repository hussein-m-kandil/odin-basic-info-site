import fs, { readFile } from "node:fs";
import path from "node:path";
import http from "node:http";

const PUBLIC_DIR = path.join(import.meta.dirname, "public");
const HOSTNAME = "127.0.0.1";
const SCHEME = "http";
const PORT = 8080;
const MIME_TYPES = {
  ".js": "text/javascript",
  ".css": "text/css",
  ".html": "text/html",
  ".svg": "image/svg+xml",
};

const createResourceObject = (reqUrl) => {
  let resExt;
  let resName;
  switch (reqUrl) {
    case "/favicon.ico":
      resExt = ".svg";
      resName = "top.svg";
      break;
    case "/":
      resExt = ".html";
      resName = "index.html";
      break;
    default:
      resName = path.extname(reqUrl) ? reqUrl : `${reqUrl}.html`;
      resExt = path.extname(resName);
  }
  return { type: MIME_TYPES[resExt], name: resName };
};

const respond = (res, code, type, msg) => {
  res.setHeader("content-type", type);
  res.statusCode = code;
  res.end(msg);
};

const respondForReadError = (res) => {
  console.log("Reading Error => ", err);
  respond(res, 500, "text/plain", "Something wrong! Try again later.");
};

const respondForNotFound = (res) => {
  console.log("Requested data not found");
  readFile(path.join(PUBLIC_DIR, "404.html"), (err, c) => {
    if (err) {
      respondForReadError(res);
    }
    respond(res, 404, "text/html", c);
  });
};

const server = http.createServer((req, res) => {
  console.log(`${req.method}: ${req.url}`);
  // Prevent requests with HTML extension
  if (path.extname(req.url) === ".html") {
    respondForNotFound(res);
  } else {
    const resource = createResourceObject(req.url);
    fs.readFile(path.join(PUBLIC_DIR, resource.name), (err, content) => {
      if (err) {
        if (err.code === "ENOENT") {
          respondForNotFound(res);
        } else {
          respondForReadError(res);
        }
      } else {
        console.log(`Respond with data for ${req.url}`);
        respond(res, 200, resource.type, content);
      }
    });
  }
});

server.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at ${SCHEME}://${HOSTNAME}:${PORT}/`);
});
