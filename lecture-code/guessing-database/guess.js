const http = require('http');
const Framework = require('./framework');
const Database = require('./db.js');

// This must be called first, in order to load the environment
// parameters.
require('dotenv').config()

const db = new Database();

const startup = async () => {
    await db.connect();

    await db.schema('Game', [
        { name: 'id', type: 'INTEGER' },
        { name: 'secret', type: 'INTEGER' },
        { name: 'time', type: 'TEXT' },
        { name: 'completed', type: 'INTEGER' },
        { name: 'num_guesses', type: 'INTEGER' },
    ], 'id');

    await db.schema('Guess', [
        { name: 'id', type: 'INTEGER' },
        { name: 'gameId', type: 'INTEGER' },
        { name: 'time', type: 'TEXT' },
        { name: 'value', type: 'INTEGER' },
    ], 'id')

    const incompletes = await db.read('Game', [{ column: 'completed', value: false }]);
    for (const g of incompletes) {
        await db.delete('Guess', [{ column: 'gameId', value: g.id }]);
        await db.delete('Game', [{ column: 'id', value: g.id }]);
    }
    console.log("Connected and cleaned")
}

startup();



const game_lookup = async (gameId) => {
    const games = await db.read('Game', [{ column: 'id', value: gameId }]);
    console.log(games);
    if (games.length > 0) return games[0];
    else return undefined;
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

const start = async (req, res) => {
    const secret = Math.floor((Math.random() * 10 - 0.1)) + 1;
    const id = await db.create('Game', [

        { column: 'secret', value: secret },
        { column: 'time', value: new Date },
        { column: 'completed', value: 0 },
        { column: 'num_guesses', value: 0 }

    ]);
    send_page(res, make_guess_page(id));
}

const guess = async (req, res) => {
    const game = await game_lookup(req.body.gameId);
    if (!game) {
        res.writeHead(404);
        res.end();
        return;
    }

    await db.update('Game',
        [{ column: 'num_guesses', value: (game.num_guesses + 1) }],
        [{ column: 'id', value: req.body.gameId }]
    );

    await db.create('Guess', [
        { column: 'gameId', value: req.body.gameId },
        { column: 'time', value: new Date() },
        { column: 'value', value: req.body.guess }
    ])


    if (req.body.guess < game.secret) {
        send_page(res, make_guess_page(game.id, 'too low'));
    } else if (req.body.guess > game.secret) {
        send_page(res, make_guess_page(game.id, 'too high'));
    } else {
        await db.update('Game',
            [{ column: 'completed', value: true }],
            [{ column: 'id', value: req.body.gameId }]
        );
        send_page(res, `<h1> Great job!</h1> <a href="/">Play again</a>`);
    }
}

const history = async (req, res) => {
    const games = await db.read('Game', [{ column: 'completed', value: true }]);
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
                        <td><a href="/history?gameId=${g.id}">${g.id}</a></td>
                        <td>${g.completed ? "Yes" : ""}</td>
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

const game_history = async (req, res) => {
    const game_guesses = await db.read('Guess', [{ column: 'gameId', value: req.query.gameId }]);
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