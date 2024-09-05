import path from "node:path";
import process from "node:process";
import express from "express";

const ROOT_DIR = process.cwd();
const VIEWS_DIR = path.join(ROOT_DIR, "views");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const HOSTNAME = "127.0.0.1";
const SCHEME = "http";
const PORT = process.env.PORT || 8080;

const sendFile = (req, res, fileName) => {
  if (fileName === "404.html") {
    console.log(`Requested data (${req.url}) not found`);
    res.status(404);
  } else {
    console.log(`Respond with data for ${req.url}`);
  }
  res.sendFile(fileName, { root: VIEWS_DIR }, (err) => {
    if (err) {
      console.log("Reading Error => \n", err);
      res.status(500).send("Something went wrong! Try again later.");
    }
  });
};

const app = express();

app.use(express.static(PUBLIC_DIR));
app.use((req, res, next) => {
  console.log(`${req.method}: ${req.url}`);
  next();
});

app.get("/", (req, res) => sendFile(req, res, "index.html"));
app.get("/about", (req, res) => sendFile(req, res, "about.html"));
app.get("/contact-me", (req, res) => sendFile(req, res, "contact-me.html"));

app.use((req, res) => sendFile(req, res, "404.html"));

app.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at ${SCHEME}://${HOSTNAME}:${PORT}/`);
});
