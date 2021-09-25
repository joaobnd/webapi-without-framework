const http = require('http');
const PORT = 3250;
const DEFAULT_HEADER = { 'Content-Type': 'application/json' };

const HeroFactory = require('./factories/heroFactory');
const heroService = HeroFactory.generateInstance();
const Hero = require('./entities/hero');

const routes = {
    '/heroes:get': async (req, res) => {
        const { id } = req.queryString;
        const heroes = await heroService.find(id)
        res.write(JSON.stringify({ results: heroes }))
        return res.end();
    },

    '/heroes:post': async (req, res) => {
        //async iterator
        for await (const data of req) {
            try {
                // await Promise.reject('/heroes:post')
                const item = JSON.parse(data)
                const hero = new Hero(item)
                const { error, valid } = hero.isValid()

                if (!valid) {
                    res.writeHead(400, DEFAULT_HEADER)
                    res.write(JSON.stringify({ error: error.join(',') }))
                    return res.end()
                }

                const id = await heroService.create(hero)
                res.writeHead(201, DEFAULT_HEADER)
                res.write(JSON.stringify({ success: 'User Created with success!', id }))

                //so tem return aqui pois sabemos que é UM objeto body por requisiçao
                //se fosse um arquivo, que sobe sob demanda
                //ele poderia entrar mais vezes em um mesmo evento, ai removeriamos o return
                return res.end()

            } catch (error) {
                return handleError(res)(error)
            }
        }
    },
    default: (req, res) => {
        res.write('Hello!');
        res.end();
    }
};

const handleError = res => {
    return error => {
        console.error('Deu ruim fml!***', error)
        res.writeHead(500, DEFAULT_HEADER)
        res.write(JSON.stringify({ error: 'Internal Server Error!!' }))

        return res.end()
    }
}

const handler = (req, res) => {
    const { url, method } = req;
    const [first, route, id] = url.split('/');
    req.queryString = { id: isNaN(id) ? id : Number(id) };

    const key = `/${route}:${method.toLowerCase()}`;

    res.writeHead(200, DEFAULT_HEADER);

    const chosen = routes[key] || routes.default;
    return chosen(req, res).catch(handleError(res));
};

http.createServer(handler)
    .listen(PORT, () => console.log('rodando na ', PORT));