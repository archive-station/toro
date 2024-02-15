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

    console.log(_req.method, url.searchParams, url.pathname);



    return new Response("Hello, World!");
}

export default handleRequest;
