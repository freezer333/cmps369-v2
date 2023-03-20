require('dotenv').config();
const Database = require('dbcmps369');

class GuessingDB {
    constructor() {
        this.db = new Database();
    }

    async initialize() {
        await this.db.connect();

        await this.db.schema('Game', [
            { name: 'id', type: 'INTEGER' },
            { name: 'secret', type: 'INTEGER' },
            { name: 'time', type: 'TEXT' },
            { name: 'complete', type: 'INTEGER' },
            { name: 'num_guesses', type: 'INTEGER' },
        ], 'id');

        await this.db.schema('Guess', [
            { name: 'id', type: 'INTEGER' },
            { name: 'gameId', type: 'INTEGER' },
            { name: 'time', type: 'TEXT' },
            { name: 'value', type: 'INTEGER' },
        ], 'id')

        const incomplete = await this.db.read('Game', [{ column: 'complete', value: false }]);
        for (const g of incomplete) {
            await this.db.delete('Guess', [{ column: 'gameId', value: g.id }]);
            await this.db.delete('Game', [{ column: 'id', value: g.id }]);
        }
    }

    async createGame(secret) {
        const id = await this.db.create('Game', [
            { column: 'secret', value: secret },
            { column: 'time', value: new Date() },
            { column: 'complete', value: false },
            { column: 'num_guesses', value: 0 }
        ])
        return id;
    }

    async findGame(id) {
        const games = await this.db.read('Game', [{ column: 'id', value: id }]);
        if (games.length > 0) return games[0];
        else {
            return undefined;
        }
    }

    async recordGuess(game, guess) {
        await this.db.update('Game',
            [{ column: 'num_guesses', value: (game.num_guesses + 1) }],
            [{ column: 'id', value: game.id }]
        );

        await this.db.create('Guess',
            [
                { column: 'gameId', value: game.id },
                { column: 'time', value: new Date() },
                { column: 'value', value: guess }
            ]
        );
    }

    async complete(game) {
        await this.db.update('Game',
            [{ column: 'complete', value: true }],
            [{ column: 'id', value: game.id }]
        );
    }

    async findCompleteGames() {
        const games = await this.db.read('Game', [{ column: 'complete', value: true }]);
        return games;
    }

    async findGuesses(gameId) {
        const game_guesses = await this.db.read('Guess', [{ column: 'gameId', value: gameId }]);
        return game_guesses;
    }
}

module.exports = GuessingDB;