require('dotenv').config();
const http = require('http');
const pug = require('pug');
const Framework = require('fwcmps369');
const Database = require('dbcmps369');

const db = new Database();

const guess_t = pug.compileFile('./views/guess.pug');
const complete_t = pug.compileFile('./views/complete.pug');
const history_t = pug.compileFile('./views/history.pug');
const game_t = pug.compileFile('./views/game.pug');

const startup = async () => {
    await db.connect();

    await db.schema('Game', [
        { name: 'id', type: 'INTEGER' },
        { name: 'secret', type: 'INTEGER' },
        { name: 'time', type: 'TEXT' },
        { name: 'complete', type: 'INTEGER' },
        { name: 'num_guesses', type: 'INTEGER' },
    ], 'id');

    await db.schema('Guess', [
        { name: 'id', type: 'INTEGER' },
        { name: 'gameId', type: 'INTEGER' },
        { name: 'time', type: 'TEXT' },
        { name: 'value', type: 'INTEGER' },
    ], 'id')

    const incomplete = await db.read('Game', [{ column: 'complete', value: false }]);
    for (const g of incomplete) {
        await db.delete('Guess', [{ column: 'gameId', value: g.id }]);
        await db.delete('Game', [{ column: 'id', value: g.id }]);
    }
}

startup();

const game_lookup = async (gameId) => {
    const games = await db.read('Game', [{ column: 'id', value: gameId }]);
    if (games.length > 0) return games[0];
    else {
        return undefined;
    }
}

const render = (res, html) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(html);
    res.end();
}

const start = async (req, res) => {
    const secret = Math.floor((Math.random() * 10 - 0.1)) + 1;

    const id = await db.create('Game', [
        { column: 'secret', value: secret },
        { column: 'time', value: new Date() },
        { column: 'complete', value: false },
        { column: 'num_guesses', value: 0 }
    ])
    render(res, guess_t({ gameId: id }));
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

    await db.create('Guess',
        [
            { column: 'gameId', value: req.body.gameId },
            { column: 'time', value: new Date() },
            { column: 'value', value: req.body.guess }
        ]
    );

    if (req.body.guess < game.secret) {
        render(res, guess_t({ gameId: game.id, result: 'too low' }));
    } else if (req.body.guess > game.secret) {
        render(res, guess_t({ gameId: game.id, result: 'too high' }));
    } else {
        await db.update('Game',
            [{ column: 'complete', value: true }],
            [{ column: 'id', value: req.body.gameId }]
        );
        render(res, complete_t({}))
    }
}

const history = async (req, res) => {
    const games = await db.read('Game', [{ column: 'complete', value: true }]);
    render(res, history_t({ games: games }));
}

const game_history = async (req, res) => {
    const game_guesses = await db.read('Guess', [{ column: 'gameId', value: req.query.gameId }]);
    render(res, game_t({ game_guesses: game_guesses }));
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