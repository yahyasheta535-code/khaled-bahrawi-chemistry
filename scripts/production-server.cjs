const http = require("node:http");
const next = require("next");

const port = Number(process.env.PORT || 3000);
const hostname = "0.0.0.0";
const app = next({ dev: false, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = http.createServer((req, res) => handle(req, res));
  server.listen(port, hostname, () => {
    console.log(`Production server listening on ${hostname}:${port}`);
  });
}).catch((error) => {
  console.error("Failed to start production server", error);
  process.exit(1);
});
