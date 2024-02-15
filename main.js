import {handleRequest} from "./handler/server.js"

const ac = new AbortController();

const server = Deno.serve({
  port: 80,
  hostname: "0.0.0.0",
  handler: (_req) => handleRequest(_req),
  signal: ac.signal,
  onListen({ port, hostname }) {
    console.log(`toro started at http://${hostname}:${port}`);
  },
});


server.finished.then(() => console.log("Server closed"));

// Deno.serve(async (req) => {
//     console.log("Method:", req.method);
//     const url = new URL(req.url);
//     console.log("Path:", url.pathname);
//     console.log("Query parameters:", url.searchParams);
  
//     console.log("Headers:", req.headers);
  
//     if (req.body) {
//       const body = await req.text();
//       console.log("Body:", body);
//     }
  
//     return new Response("Hello, World!");
// });


// Deno.serve({
//     port: 80,
// }, handler);