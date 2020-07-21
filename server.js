const Express = require('express');
const Spdy = require('spdy');
const Https = require('https');
const { certificate, getFileHttp1 } = require('./shared');
const PORT_HTTP2 = process.env.PORT_HTTP2 || 3000;
const PORT_HTTP1 = process.env.PORT_HTTP1 || 3001;
const simulateLatency = require('express-simulate-latency');

const lag = simulateLatency({ min: 1000, max: 5000 });

// HTTP1
const http1app = Express();
http1app.use(Express.static('assets'));
http1app.use(lag)

// HTTP2
const http2app = Express();
http2app.use((req, res) => {
    const reqPath = req.url === '/' ? '/index2.html' : req.url
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
    const file = getFileHttp1(reqPath)
    res.writeHead(200, { 'Content-Type': file.contentType });
    res.end(file.content, 'utf-8');
});
http2app.use(lag)

Https.createServer(certificate, http1app).listen(PORT_HTTP1, () => {
    Spdy.createServer(certificate, http2app).listen(PORT_HTTP2, () => {
        console.log(`Running at https://localhost:3000`)
    });
});