const qs = require('querystring');

class Parser {
    constructor(schema = []) {
        this.schema = schema;
    }
    apply_schema(payload) {
        for (const item of this.schema.filter(i => payload[i.key])) {
            if (item.type === 'int') {
                payload[item.key] = parseInt(payload[item.key])
            } else if (item.type === 'float') {
                payload[item.key] = parseInt(payload[item.key])
            } else if (item.type === 'bool') {
                payload[item.key] = payload[item.key] === "true"
            }
        }
        return payload
    }
}

class QueryParser extends Parser {
    constructor(schema = []) {
        super(schema);
    }
    parse(req) {
        if (req.url.indexOf("?") >= 0) {
            const query = qs.parse(req.url.split('?')[1]);
            this.apply_schema(query);
            return query;
        }
        else {
            return {}
        }
    }
}

class BodyParser extends Parser {
    constructor(schema = []) {
        super(schema);
    }
    async parse(req) {
        return new Promise((resolve, reject) => {
            let body = "";
            req.on('data', (chunk) => {
                body += chunk;
            });
            req.on('end', () => {
                body = qs.parse(body);
                try {
                    this.apply_schema(body);
                    resolve(body);
                } catch (ex) {
                    reject(ex);
                }
            });
        });
    }
}

class Matcher {
    constructor(method, path, has_query) {
        this.method = method;
        this.path = path;
        this.has_query = has_query;
    }

    matches(req) {
        if (req.method.toUpperCase() !== this.method) return false;
        if (this.has_query) {
            return req.url.startsWith(this.path + "?");
        } else {
            return req.url === this.path;
        }
    }
}

class Route {
    constructor(matcher, handler) {
        this.matcher = matcher;
        this.handler = handler;
    }

    match(req) {
        return this.matcher.matches(req);
    }

    serve(req, res) {
        this.handler(req, res);
    }
}

class Router {
    constructor(query_parser, body_parser) {
        this.routes = [];
        this.qp = query_parser;
        this.bp = body_parser;
    }
    get(path, handler, has_query = false) {
        this.routes.push(new Route(new Matcher('GET', path, has_query), handler));
    }
    post(path, handler, has_query = false) {
        this.routes.push(new Route(new Matcher('POST', path, has_query), handler));
    }
    async on_request(req, res) {
        // Attach query and body
        req.query = this.qp.parse(req);
        req.body = await this.bp.parse(req);
        for (const route of this.routes) {
            if (route.match(req)) {
                route.serve(req, res);
                return;
            }
        }
        // No route matched, return not found.
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.write('<!doctype html><html><head><title>Not Found</title></head><body><h1>Not Found</h1></body></html>')
        res.end();
    }
}

exports.QueryParser = QueryParser;
exports.BodyParser = BodyParser;
exports.Route = Route;
exports.Matcher = Matcher;
exports.Router = Router;