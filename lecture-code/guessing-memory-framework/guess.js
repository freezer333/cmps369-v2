const http = require('http');
const Framework = require('./framework');

const games = [];
const guesses = [];

const game_lookup = (gameId) => {
    if (gameId >= 0 && gameId < games.length) {
        return games[gameId];
    } else {
        return undefined;
    }
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
        <a href="/history">Game History</a>
    `;
}

const send_page = (res, body) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(heading() + body + footing());
    res.end();
}

const start = (req, res) => {
    const secret = Math.floor((Math.random() * 10 - 0.1)) + 1;
    const game = {
        gameId: games.length,
        secret: secret,
        time: new Date(),
        complete: false,
        num_guesses: 0
    }
    games.push(game);
    send_page(res, make_guess_page(game.gameId));
}

const guess = async (req, res) => {
    const game = game_lookup(req.body.gameId);
    if (!game) {
        res.writeHead(404);
        res.end();
        return;
    }

    game.num_guesses++;
    guesses.push({
        gameId: game.gameId,
        time: new Date(),
        value: req.body.guess
    });

    if (req.body.guess < game.secret) {
        send_page(res, make_guess_page(game.gameId, 'too low'));
    } else if (req.body.guess > game.secret) {
        send_page(res, make_guess_page(game.gameId, 'too high'));
    } else {
        game.complete = true;
        send_page(res, `<h1> Great job!</h1> <a href="/">Play again</a>`);
    }
}

const history = (req, res) => {
    const html = heading() +
        `
        <table>
            <thead>
                <tr>
                    <th>Game ID</th>
                    <th>Complete</th>
                    <th>Num Guesses</th>
                    <th>Started</th>
                </tr>
            </thead>
            <tbody>
                ${games.map(g => `
                    <tr>
                        <td><a href="/history?gameId=${g.gameId}">${g.gameId}</a></td>
                        <td>${g.complete ? "Yes" : ""}</td>
                        <td>${g.num_guesses}</td>
                        <td>${g.time}</td>
                    </tr>
                `).join('\n')}
            </tbody>
        </table>
        <a href="/">Play the game!</a>
        `
        + footing();
    send_page(res, html);
}

const game_history = (req, res) => {
    const game_guesses = guesses.filter(g => g.gameId == req.query.gameId);
    const html = heading() +
        `
        <table>
            <thead>
                <tr>
                    <th>Value</th>
                    <th>Time</th>
                </tr>
            </thead>
            <tbody>
                ${game_guesses.map(g => `
                    <tr>
                        <td>${g.value}</td>
                        <td>${g.time}</td>
                    </tr>
                `).join('\n')}
            </tbody>
        </table>
        <a href="/history">Game History</a>
        `
        + footing();
    send_page(res, html);
}

const bp = new Framework.BodyParser([
    { key: 'guess', type: 'int' },
    { key: 'gameId', type: 'int' }
]);

const qp = new Framework.QueryParser([
    { key: 'gameId', type: 'int' }
]);

const router = new Framework.Router(qp, bp);
router.get('/', start);
router.post('/', guess);
router.get('/history', history);
router.get('/history', game_history, true);

http.createServer((req, res) => { router.on_request(req, res) }).listen(8080);