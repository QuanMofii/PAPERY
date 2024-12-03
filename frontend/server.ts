import { createServer } from "http";
import { parse } from "url";
import next from "next";



const dev = process.env.NODE_ENV !== 'production';
const hostname = (parseInt(process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost", 10)).toString();
const port = parseInt(process.env.PORT || "3000", 10);
const app = next({ dev , hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  }).listen(port);

  console.log(
    `> Server listening at ${hostname}:${port} as ${
      dev ? "development" : process.env.NODE_ENV
    }`,
  );
});