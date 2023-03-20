const http = require('http');
const qs = require('querystring');


const games = [];

const pbody = async (req) => {
    return new Promise((resolve, reject) => {
        let body = "";
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            body = qs.parse(body);
            try {
                body.guess = parseInt(body.guess);
                body.gameId = parseInt(body.gameId);
                resolve(body);
            } catch (ex) {
                reject(ex);
            }
        });
    });
}

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

const make_guess_page = (gameId, result) => {
    const message = result === undefined ?
        `<p>I'm thinking of a number from 1-10!</p>` :
        `<p>Sorry your guess was ${result}, try again!</p>`;
    return `
        <form action="/" method="POST">
            ${message}
            <label for="guess">Enter your guess:</label>
            <input name="guess" placeholder="1-10" type="number" min="1" max="10"/>
            <input name="gameId" value="${gameId}" type="hidden"/>
            <button type="submit">Submit</button>
        </form>
        <a href="/history">See game history </a>
    `;
}

const send_page = (res, body) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(heading() + body + footing());
    res.end();
}

const start = (res) => {
    const secret = Math.floor((Math.random() * 10 - 0.1)) + 1;
    const game = {
        gameId: games.length,
        secret: secret,
        num_guesses: 0,
        time: new Date(),
        complete: false
    }
    games.push(game);
    send_page(res, make_guess_page(game.gameId));
}

const guess = async (req, res) => {
    const body = await pbody(req);
    const guess = parseInt(body.guess);
    const gameId = parseInt(body.gameId);
    const game = games[gameId];
    const secret = game.secret;

    game.num_guesses++;
    if (guess < secret) {
        send_page(res, make_guess_page(gameId, 'too low'));
    } else if (guess > secret) {
        send_page(res, make_guess_page(gameId, 'too high'));
    } else {
        send_page(res, `<h1> Great job!</h1> <a href="/">Play again</a>`);
        game.complete = true;
    }
}

const history = async (req, res) => {
    send_page(res, `<h1>History</h1>
   <table><thead><th>Game ID</th><th>Secret</th><th>Num Guesses</th>
   </thead>
   <tbody>
   ${games.filter(g => g.complete).map(g =>
        `
        <tr><td><a href="/history?gameId=${g.gameId}">${g.gameId}</a></td>
        <td>${g.secret}</td>
        <td>${g.num_guesses}</td></tr>
        `)}
   </tbody>
   </table>`);
}


const game = async (req, res) => {
    const query = qs.parse(req.url.split("?")[1]);
    console.log(query);
    const game = games[query.gameId];
    send_page(res, `<pre>${JSON.stringify(game, null, 2)}</pre>`);

    /*
    send_page(res, `<h1>History</h1>
   <table><thead><th>Game ID</th><th>Secret</th><th>Num Guesses</th>
   </thead>
   <tbody>
   ${games.filter(g => g.complete).map(g =>
        `
        <tr><td><a href="/history?gameId=${g.gameId}">${g.gameId}</a></td>
        <td>${g.secret}</td>
        <td>${g.num_guesses}</td></tr>
        `)}
   </tbody>
   </table>`);*/
}


const handle_request = async (req, res) => {
    if (req.method.toUpperCase() === 'GET') {
        if (req.url === "/") {
            start(res);
        }
        else if (req.url.startsWith("/history?")) {
            game(req, res);
        }
        else if (req.url === "/history") {
            history(req, res);
        }
    } else {
        guess(req, res);
    }
}

http.createServer(handle_request).listen(8080);