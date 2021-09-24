const http = require('http');
const PORT = 3250;
const DEFAULT_HEADER = { 'Content-Type': 'application/json'};

const HeroFactory = require('./factories/heroFactory');
const heroService = HeroFactory.generateInstance();

const routes = {
    '/heroes:get': async (req, res) => {
        const { id } = req.queryString;
        const heroes = await heroService.find(id)
        res.write(JSON.stringify({ results: heroes }))
        return res.end();
    },
    default: (req, res) => {
        res.write('Hello!');
        res.end();
    }  
};

const handler = (req, res) => {
    const{ url, method } = req;
    const [first, route, id] = url.split('/');
    req.queryString = { id: isNaN(id) ? id: Number(id) };
    
    const key = `/${route}:${method.toLowerCase()}`;
    
    res.writeHead(200, DEFAULT_HEADER);

    const chosen = routes[key] || routes.default;
    return chosen(req, res);
};

http.createServer(handler)
    .listen(PORT, () => console.log('rodando na ', PORT));