const http = require('http');

const on_request = (req, res) => {
    console.log("Got a request - ", req.url);

    if (req.url != '/') {
        res.writeHead(404);
        res.end();
        return;
    }
    //console.log(req);
    const body = `
            <!doctype html>
            <html>
                <head>
                    <title>CMPS 369</title>
                </head>
                <body>
                    <h1>Hello CMPS 369</h1>
                    <p>We are making progress!</p>
                </body>
            </html>
        `;
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(body)
    res.end();
    return;
}

const server = http.createServer(on_request);
server.listen(3000, 'localhost');