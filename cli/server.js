const serve = require("koa-static");
const Koa = require("koa");
const pather = require("path");
const getCommits = require("./git");
const getPort = require("get-port");
const open = require("open");
const router = require("koa-router")();

const sitePath = pather.join(__dirname, "site/");

router.get("/api/commits", async ctx => {
  const query = ctx.query;
  const { path, last = 10, before = null } = query;

  const commits = await getCommits(path, last, before);

  ctx.body = commits;
});

const app = new Koa();
app.use(router.routes());
app.use(serve(sitePath));
app.on("error", err => {
  console.error("Server error", err);
  console.error(
    "Let us know of the error at https://github.com/pomber/git-history/issues"
  );
});

module.exports = async function runServer(path) {
  const port = await getPort({ port: 5000 });
  app.listen(port);
  console.log("Running at http://localhost:" + port);
  open(`http://localhost:${port}/?path=${encodeURIComponent(path)}`);
};
