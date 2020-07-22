const config = require('../config')
const PORT_HTTP1 = config.portHttp1 || 3001;
const PORT_HTTP2 = config.portHttp2 || 3000;
const { getFile } = require('../shared');

module.exports = {
    getImages: (req, res) => {
        const host = req.headers.host.split(':')[0];
        for (let i = 1; i <= 100; i++) {
            const assetPath = `/download (${i}).jpeg`;
            const file = getFile(assetPath);
            const stream = res.push(assetPath, {
                request: { accept: '*/*' },
                response: { 'content-type': file.contentType }
            });
            stream.end(file.content)
        }
        res.render('index', {
            title: 'HTTP/1.x vs HTTP/2',
            host: host,
            PORT_HTTP1: PORT_HTTP1,
            PORT_HTTP2: PORT_HTTP2,
        })
    }
};