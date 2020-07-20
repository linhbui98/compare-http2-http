const Fs = require('fs');
const Mime = require('mime')
const Path = require('path')

const imagesDir = `${__dirname}/../assets/`;

module.exports = {
    certificate: {
        key: Fs.readFileSync(`${__dirname}/../certificate/localhost.key`),
        cert: Fs.readFileSync(`${__dirname}/../certificate/localhost.crt`)
    },
    getFileHttp1: (reqPath) => {
        console.log("ddd", imagesDir)
        const filePath = Path.join(imagesDir, reqPath);
        const content = Fs.readFileSync(filePath);
        console.log("aaa", filePath)
            // const content = Fs.readFileSync("/home/d/BuiLinh/http2-express-demo/assets/download (1).jpeg");
        return {
            content,
            contentType: Mime.getType(filePath)
        }
    }
}