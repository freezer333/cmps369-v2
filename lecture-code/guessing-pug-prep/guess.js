const http = require('http');
const Framework = require('fwcmps369');
const Database = require('gdbcmps369');
const pug = require('pug');

const guess_t = pug.compileFile('./views/guess.pug');
const success_t = pug.compileFile('./views/success.pug');
const history_t = pug.compileFile('./views/history.pug');
const guess_history_t = pug.compileFile('./views/guess_history.pug');

const db = new Database();
db.initialize();

const send_page = (res, html) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(html);
    res.end();
}

const start = async (req, res) => {
    const secret = Math.floor((Math.random() * 10 - 0.1)) + 1;
    const id = await db.createGame(secret);
    send_page(res, guess_t({ gameId: id, guesses: [] }));
}

const guess = async (req, res) => {
    const game = await db.findGame(req.body.gameId);
    if (!game) {
        res.writeHead(404);
        res.end();
        return;
    }

    await db.recordGuess(game, req.body.guess);
    const guesses = await db.findGuesses(req.body.gameId);
    guesses.forEach(g => g.secret = game.secret);

    if (req.body.guess < game.secret) {
        send_page(res, guess_t({ gameId: game.id, message: "too low", guesses: guesses }));
    } else if (req.body.guess > game.secret) {
        send_page(res, guess_t({ gameId: game.id, message: "too high", guesses: guesses }));
    } else {
        await db.complete(game);
        send_page(res, success_t({ guesses: guesses }));
    }
}

const history = async (req, res) => {
    const games = await db.findCompleteGames();
    const html = history_t({ games: games });
    send_page(res, html);
}

const game_history = async (req, res) => {
    const game_guesses = await db.findGuesses(req.query.gameId);
    const html = guess_history_t({ game_guesses: game_guesses });
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