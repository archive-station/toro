import config from "../servers.json" with { type: "json" };
import { serveFile } from "https://deno.land/std@0.207.0/http/file_server.ts";
import * as path from "https://deno.land/std@0.207.0/path/mod.ts";
import {existsSync} from "https://deno.land/std/fs/mod.ts";

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
        

        
        // detect if the game is running an older version
        if (!_req.url.includes("1.2")) {
            /* 
                this is a horrible fucking solution dklasdjksajkdjsad
                work on piggyback riding other directories and stop assuming
                that the server is running already has a 1.2 directory

                we will download 1.2 files since from my testing
                it is the only folder that is still alive from
                my research into the sony assets
                
                - ellie
            */
            try {
                let oldPath = pathname.includes("1.1") ? "1.1" : "1.0"
                let replaced = pathname.replace(oldPath, "1.2");
    
                const filePath = await Deno.realPath(`./archive.${replaced}`);
                const fileCheck = Deno.statSync(filePath);
                console.log(fileCheck);
                if (fileCheck.isDirectory) {
                    throw new Error();
                }
                return serveFile(_req, filePath);
            } catch (_err) {
                // lol
            }

            
        }
    }
    
    
    const resHeaders = new Headers();
    if (!file) {    
        let request;
        let newPathname;
        try {
            const current_servers = config.servers;
            const current_server = current_servers[Math.floor(Math.random()*current_servers.length)];

            // change pathname to 1.2 since it is the only folder thats alive
            if (!pathname.includes("1.2")) {
                let oldPath = pathname.includes("1.1") ? "1.1" : "1.0"
                newPathname = pathname.replace(oldPath, "1.2");
            } else {
                newPathname = pathname;
            }
            

            
            console.log(`http://${current_server}/weeklytoro/pd/ps3${newPathname}`);
            request = await fetch(`http://${current_server}/weeklytoro/pd/ps3${newPathname}`, {headers: _req.headers});
            
            const buff = await request.arrayBuffer();

            
            if (!request.ok) {
                console.log('i hate angy cats >:(')
                throw new Error();
            }
            const arr = new Uint8Array(buff);
            const checkName = existsSync(path.dirname(`./archive${newPathname}`));
            if (!checkName) {
                await Deno.mkdirSync(path.dirname(`./archive${newPathname}`, {recursive:true}));

            }

            await Deno.writeFile(`./archive${newPathname}`, arr);
        
        } catch (err) {

            console.error(err);
            if (request.status > 399) {
                console.log('something fucked up!!!!!!!')
            } else {
                await Deno.writeFile(`./archive.${newPathname}`, arr);
            }
        }
    
    

        // implement this later ellie
        
        // for (const header in request.headers) {
        //     resHeaders.set(header, request.headers.get(header));
        // }
    
        if (request.status > 399) {
            return await new Response(null, {status: 404});
        } else {
            return serveFile(_req, `./archive${newPathname}`);
        }
    } 
}

export default handleRequest;
