import config from "../servers.json" with { type: "json" };
import { serveFile } from "https://deno.land/std@0.207.0/http/file_server.ts";
import * as path from "https://deno.land/std@0.188.0/path/mod.ts";

export async function handleRequest(_req) {
    const url = new URL(_req.url);
    const pathname = url.pathname;
    if (pathname.includes('cgi')) {
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
            const filePath = await Deno.realPath(`./archive.${pathname}`);
            const fileCheck = Deno.statSync(filePath);
            if (fileCheck.isDirectory) {
                throw new Error();
            }

            
           return serveFile(_req, filePath);
        } catch (_err) {
            // oh hell no!
        }
    }
    
    
    const resHeaders = new Headers();
    if (!file) {    
        let request;
        try {
            const current_servers = config.servers;
            const current_server = current_servers[Math.floor(Math.random()*current_servers.length)];
            
            request = await fetch(`http://${current_server}/weeklytoro/pd/ps3${pathname}`, {headers: _req.headers});
            console.log(`http://${current_server}/weeklytoro/pd/ps3${pathname}`)
            const buff = await request.arrayBuffer();

            if (!request.ok) {
                throw new Error();
            }
            console.log(`http://${current_server}/weeklytoro/pd/ps3${pathname}`);
            const arr = new Uint8Array(buff);
            await Deno.mkdirSync(path.dirname(`./archive${pathname}`, {recursive:true}));
            await Deno.writeFile(`./archive${pathname}`, arr);
        } catch (err) {
            console.log(err);
            if (request.status > 399) {
                console.log('something fucked up!!!!!!!')
            }
        }
    
    
        for (const header in request.headers) {
            resHeaders.set(header, request.headers.get(header));
        }
    
        if (request.status > 399) {
            return await new Response(null, {status: 404});
        } else {
            return serveFile(_req, `./archive${pathname}`);
        }
    } 
}

export default handleRequest;
