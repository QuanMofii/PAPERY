// // server.js
// import { createServer } from 'http';
// import { parse } from "url";
// import next from "next";



// const dev = process.env.NODE_ENV !== 'production';
// console.log("here", process.env.NEXT_PUBLIC_FRONTEND_URL)
// const hostname = (process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost");
// console.log(hostname)
// const port = parseInt(process.env.NEXT_PUBLIC_FRONTEND_PORT || "3000", 10);
// const app = next({ dev , hostname, port });
// const handle = app.getRequestHandler();

// app.prepare().then(() => {
//   createServer((req, res) => {
//     const parsedUrl = parse(req.url, true);
//     handle(req, res, parsedUrl);
//   }).listen(port);

//   console.log(
//     `> Server listening at ${hostname}:${port} as ${
//       dev ? "development" : process.env.NODE_ENV
//     }`,
//   );
// });

import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOST || '127.0.0.1';
const port = parseInt(process.env.PORT, 10) || 3000;
console.log( "node env",process.env.NODE_ENV)
console.log( "port",process.env.PORT)
console.log( "host",process.env.HOST)



console.log(`Listening on ${hostname}:${port}`);

// app.prepare().then(() => {
//   createServer(async (req, res) => {
//     // const { pathname, query } = parsedUrl;
//     // if (pathname === '/health') {
//     //   res.statusCode = 200;
//     //   res.end('OK');
//     //   return;
//     // }
//     try {
//       const parsedUrl = parse(req.url, true);
//       await handle(req, res, parsedUrl);
//     } catch (err) {
//       console.error('Error occurred handling', req.url, err);
//       res.statusCode = 500;
//       res.end('internal server error');
//     }
//   }).listen(port, (err) => {
//     if (err) throw err;
//     console.log(`> Ready on http://${host}:${port}`);
    
//   });
// });

// process.on('SIGTERM', () => {
//   console.log('SIGTERM signal received: closing HTTP server');
//   app.close(() => {
//     console.log('HTTP server closed');
//     process.exit(0);
//   });
// });



const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on  http://${process.env.NEXT_PUBLIC_FRONTEND_URL}`);
    console.log(`> Backend URL: ${process.env.NEXT_PUBLIC_BACKEND_URL}`);
    console.log(`> API Version: ${process.env.NEXT_PUBLIC_API_VERSION}`);
  });
});
