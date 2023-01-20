const net = require('net');

const on_socket_connect = (socket) => {
    // Just register a function to handle incoming data, 
    // which we assume is an HTTP request in need of 
    // a response.
    socket.on('data', (data) => {
        const request = data.toString();
        // Let's only handle requests to '/'
        const first_line = request.split('\n')[0];
        const path = first_line.split(' ')[1];
        console.log("Received request for [" + path + "]")

        if (path != '/') {
            console.log('Resource - [' + path + '] was not found - did not even bother looking');
            socket.write(
                'HTTP/1.1 404 Not Found\n'
            );
            return;
        }

        console.log("Responding to request for /");
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
        socket.write(
            'HTTP/1.1 200 OK\n' +
            'Content-Type: text/html\n' +
            'Content-Length: ' + body.length + '\n' +
            '\n' + // The blank line
            body
        )

    });
}

const server = net.createServer(on_socket_connect);
server.listen(3000, 'localhost');