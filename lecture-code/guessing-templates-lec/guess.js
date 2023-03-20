const http = require('http');
const pug = require('pug');
const Framework = require('fwcmps369');
const Database = require('gdbcmps369');

const db = new Database();
db.initialize();

const guess_t = pug.compileFile('./views/guess.pug');
const complete_t = pug.compileFile('./views/complete.pug');
const history_t = pug.compileFile('./views/history.pug');
const game_t = pug.compileFile('./views/game.pug');

const render = (res, html) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(html);
    res.end();
}

const start = async (req, res) => {
    const secret = Math.floor((Math.random() * 10 - 0.1)) + 1;
    const id = await db.createGame(secret);
    render(res, guess_t({ gameId: id, secret: secret, guesses: [] }));
}

const guess = async (req, res) => {
    const game = await db.findGame(req.body.gameId);
    if (!game) {
        res.writeHead(404);
        res.end();
        return;
    }

    await db.recordGuess(game, req.body.guess);
    const guesses = await db.findGuesses(game.id);
    console.log(guesses);

    if (req.body.guess < game.secret) {
        render(res, guess_t({ gameId: game.id, result: 'too low', secret: game.secret, guesses: guesses }));
    } else if (req.body.guess > game.secret) {
        render(res, guess_t({ gameId: game.id, result: 'too high', secret: game.secret, guesses: guesses }));
    } else {
        await db.complete(game);
        render(res, complete_t({ secret: game.secret, guesses: guesses }))
    }
}

const history = async (req, res) => {
    const games = await db.findCompleteGames();
    render(res, history_t({ games: games }));
}

const game_history = async (req, res) => {
    const game_guesses = await db.findGuesses(req.query.gameId);
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