const http = require('http');
const fs = require('fs');
const path = require('path');
const { unescape } = require('querystring');

const mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "gif": "image/gif",
    "js": "text/javascript",
    "css": "text/css",
    "mp4": "video/mp4",
    "ogv": "video/ogv"
};

// Assumes that the file exists
const serve_file = (res, path_to_file) => {
    const extension = path.extname(path_to_file).split('.')[1];
    const mime = mimeTypes[extension];
    console.log(extension, mime);
    res.writeHead(200, { 'Content-Type': mime });
    const stream = fs.createReadStream(path_to_file);
    stream.pipe(res);
}


const handle_request = (req, res) => {
    const url = req.url;
    const filename = path.join(process.cwd(), unescape(url))
    console.log(url);

    let stats;
    try {
        stats = fs.lstatSync(filename);
    } catch (ex) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('404 Sorry this is not a real file!');
        res.end();
        return;
    }

    if (stats.isFile()) {
        serve_file(res, filename);
    }
    else {
        const index_file = path.join(filename, 'index.html');
        let istats;
        try {
            istats = fs.lstatSync(index_file);
        } catch (ex) {
            const contents = fs.readdirSync(filename);
            console.log(contents);
            const body_1 = `
                <!doctype html>
                <html>
                    <head>
                        <title>CMPS 369</title>
                    </head>
                    <body>
                        <h1>Contents</h1>
            `
            let list = '<ul>';
            for (const f of contents) {
                list += ('<li><a href="' + f + '">' + f + '</a></li>');
            }
            list += '</ul>';
            const body_2 = `
                    </body>
                </html>
            `;

            const body = body_1 + list + body_2;
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(body);
            res.end();
            return;
        }
        serve_file(res, path.join(filename, 'index.html'));
    }
}

http.createServer(handle_request).listen(8080);