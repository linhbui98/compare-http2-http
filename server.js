const Express = require('express');
const Spdy = require('spdy');
const Https = require('https');
const { certificate, getFileHttp1 } = require('./shared');
const simulateLatency = require('express-simulate-latency');

const lag = simulateLatency({ min: 1000, max: 5000 });

// HTTP1
const http1app = Express();
http1app.use(Express.static('assets'));
http1app.use(lag)

// HTTP2
const http2app = Express();
http2app.use((req, res) => {
    const reqPath = req.url === '/' ? '/index.html' : req.url
    console.log("huy", reqPath)
    console.log("linh", req.url)
    if (req.url === '/') {
        for (let i = 1; i <= 10; i++) {
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

Https.createServer(certificate, http1app).listen(3001, 'localhost', () => {
    console.log("HTTP/1.x")
    Spdy.createServer(certificate, http2app).listen(3000, 'localhost', () => {
        console.log(`HTTP/2 running at https://localhost:3000`)
    });
});