const http = require('http');
const qs = require('querystring');

const heading = () => {
    const html = `
        <!doctype html>
            <html>
                <head>
                    <title>Guess</title>
                </head>
                <body>
    `;
    return html;
}

const footing = () => {
    return `
        </body>
    </html>
    `;
}

const make_guess_page = (secret, result) => {
    const message = result === undefined ?
        `<p>I'm thinking of a number from 1-10!</p>` :
        `<p>Sorry your guess was ${result}, try again!</p>`;
    return `
        <form action="/" method="POST">
            ${message}
            <label for="guess">Enter your guess:</label>
            <input name="guess" placeholder="1-10" type="number" min="1" max="10"/>
            <input name="secret" value="${secret}" type="hidden"/>
            <button type="submit">Submit</button>
        </form>
    `;
}

const send_page = (res, body) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(heading() + body + footing());
    res.end();
}

const handle_request = (req, res) => {
    if (req.method.toUpperCase() === 'GET') {
        // Assign the secret value and create the initial page.
        // This is the creation of a new "game".
        const secret = Math.floor((Math.random() * 10 - 0.1)) + 1;
        send_page(res, make_guess_page(secret));
    } else {
        // The user has made a guess and submitted the form.
        // Read the posted data.  The message body is provided 
        // as a stream, so we need to read it until the "end" 
        // event, and then respond.
        let body = "";
        // req is a stream, with data and end events.
        // process each data chunk (there will probably just be one)
        // since the input is short...
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            // qs parses the guess=x&secret=y string
            // into an object.
            body = qs.parse(body);
            // Make sure it's an integer.
            // We should catch exceptions and generate a 4xx error
            // if the input is invalid... but this is just a demo...
            body.guess = parseInt(body.guess);
            body.secret = parseInt(body.secret);
            if (body.guess < body.secret) {
                send_page(res, make_guess_page(body.secret, 'too low'));
            } else if (body.guess > body.secret) {
                send_page(res, make_guess_page(body.secret, 'too high'));
            } else {
                send_page(res, `<h1> Great job!</h1> <a href="/">Play again</a>`);
            }
        });
    }
}

http.createServer(handle_request).listen(8080);