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

    const filePath = await Deno.realPath(`./archive.${url.pathname}`);

    console.log(filePath)
    // const filePath = path.join(__dirname, './backup', '.'+originalUrl)
    let file;
    if (_req.method === "GET") {
        try {
            const fileCheck = Deno.statSync(filePath);
            if (fileCheck.isDirectory) {
                throw new Error();
            }

            
            file = await Deno.open(filePath, {read: true});
            
            
            
            console.log('complete!')
        } catch (err) {
            // oh hell no!
        }
    }
    const readableStream = file.readable;
    const res = new Response(readableStream);
    return await res;
}

export default handleRequest;
