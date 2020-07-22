const Express = require('express');
const Spdy = require('spdy');
const Https = require('https');
const path = require('path')
const { certificate, getFileHttp1 } = require('./shared');
const PORT_HTTP2 = process.env.PORT_HTTP2 || 3000;
const PORT_HTTP1 = process.env.PORT_HTTP1 || 3001;

// HTTP1
const http1app = Express();
http1app.use(Express.static('assets'));
http1app.set('views', path.join(__dirname, 'views'));
http1app.set('view engine', 'pug');

// HTTP2
const http2app = Express();
http2app.set('views', path.join(__dirname, 'views'));
http2app.set('view engine', 'pug');
http2app.use((req, res) => {
    const host = req.headers.host.split(':')[0];
    const reqPath = req.url === '/' ? '../views/index.pug' : req.url
        // const reqPath = req.url === '/' ? 'index2.html' : req.url
    if (req.url === '/') {
        for (let i = 1; i <= 100; i++) {
            const assetPath = `/download (${i}).jpeg`;
            const file = getFileHttp1(assetPath);
            const stream = res.push(assetPath, {
                request: { accept: '*/*' },
                response: { 'content-type': file.contentType }
            });
            stream.end(file.content)
        }
    }
    // const file = getFileHttp1(reqPath)
    // res.writeHead(200, { 'Content-Type': file.contentType });
    // res.end(file.content, 'utf-8');
    res.render('index', { title: 'Hey', host: host, PORT_HTTP2: PORT_HTTP2, PORT_HTTP1: PORT_HTTP1 })
});

Https.createServer(certificate, http1app).listen(PORT_HTTP1, () => {
    Spdy.createServer(certificate, http2app).listen(PORT_HTTP2, () => {
        console.log(`Running app`)
    });
});