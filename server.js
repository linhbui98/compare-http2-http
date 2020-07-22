const Express = require('express');
const Spdy = require('spdy');
const Https = require('https');
const path = require('path')
const { certificate } = require('./shared');
const config = require('./config')
const PORT_HTTP1 = config.portHttp1 || 3001;
const PORT_HTTP2 = config.portHttp2 || 3000;
const indexRoute = require('./routes/index');

// HTTP1
const http1app = Express();
http1app.set('etag', false);
http1app.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next()
});
http1app.use(Express.static('assets'));


// HTTP2
const http2app = Express();
http2app.set('views', path.join(__dirname, 'views'));
http2app.set('view engine', 'pug');
http2app.get('/', indexRoute)

Https.createServer(certificate, http1app).listen(PORT_HTTP1, () => {
    Spdy.createServer(certificate, http2app).listen(PORT_HTTP2, () => {
        console.log(`Running app`)
    });
});