const fs = require("node:fs");
const glob = require("glob");
const path = require("path");
const chokidar = require("chokidar");
const child_process = require("child_process");

let generatePublicDocumentsMap = () => {
  let out = {};
  glob.sync("../PublicDocuments/**/*.md").forEach((document_path) => {
    let buf = fs.readFileSync(document_path, { encoding: "utf-8" });
    out[buf.split("\r\n")[2]] = {
      path: `/${document_path.split(path.sep).slice(1).join("/")}`,
      tags: (() => {
        return buf.split("\r\n")[0].slice(4, -3).split(",").map((_) => { return _.trim() });
      })(),
    };
  });
  fs.writeFileSync("../PublicDocuments/map.json",
    JSON.stringify(out, null, 2), "utf-8");
};

(async () => {
  generatePublicDocumentsMap();
  chokidar.watch("../PublicDocuments").on("all", (event, path) => {
    console.log(event, path);
    generatePublicDocumentsMap();
  });
  chokidar.watch("../viewer").on("all", (event, path) => {
    console.log(event, path);
    child_process.exec(
      [
        "powershell",
        "gate",
        "--index",
        "../viewer/html/index.html",
        "--out",
        "../index.html",
        "--minify",
        "true",
      ].join(" "), (err, stdout, stderr) => {
      });
  });
})();
