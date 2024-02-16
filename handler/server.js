import config from "../servers.json" assert { type: "json" };
import { serveDir, serveFile } from "https://deno.land/std@0.207.0/http/file_server.ts";

export async function handleRequest(_req) {
    const url = new URL(_req.url);
    const path = url.pathname;
    if (path.includes('cgi')) {
        // wip: return info to a database
        console.log(`cgi script captured: ${url.href}, method: ${_req.method}`)
        console.log(_req.headers);
        if (_req.body) {
            const body = await req.text();
            console.log(body);
        } else {
            console.log('no body sent!')
        }
        return new Response(null, {status: 200})
    }

    // prevent no errors lol!!!!!! :3

    
    // console.log(filePath)
    // const filePath = path.join(__dirname, './backup', '.'+originalUrl)
    let file;
    if (_req.method === "GET") {
        try {
            const filePath = await Deno.realPath(`./archive.${url.pathname}`);
            const fileCheck = Deno.statSync(filePath);
            if (fileCheck.isDirectory) {
                throw new Error();
            }

            
           return serveFile(_req, filePath);
        } catch (err) {
            // oh hell no!
        }
    }
    
    
    let resHeaders = new Headers();
    if (!file) {
        let responseRes;
    
        let request;
        try {
            let current_servers = config.servers;
            let current_server = current_servers[Math.floor(Math.random()*current_servers.length)];
            
            request = await fetch(`http://${current_server}/weeklytoro/pd/ps3${url.pathname}`, {headers: _req.headers});
            let buff = await request.arrayBuffer();

            if (!request.ok) {
                throw new Error();
            }
            console.log(`http://${current_server}/weeklytoro/pd/ps3${url.pathname}`);
            let arr = new Uint8Array(buff);
            await Deno.writeFile(`./archive${url.pathname}`, arr);
        } catch (err) {
            if (request.status > 399) {
                console.log('something fucked up!!!!!!!')
            }
        }
    
    
        for (const header in request.headers) {
            resHeaders.set(header, request.headers.get(header));
        }
    
        if (request.status > 399) {
            return await new Response('toro - the proxy can not find the file!', {status: 404});
        } else {
            return serveFile(_req, `./archive${url.pathname}`);
        }
    } 
}

export default handleRequest;
