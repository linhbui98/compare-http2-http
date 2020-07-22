const Fs = require('fs');
const Mime = require('mime')
const Path = require('path')

const imagesDir = `${__dirname}/../assets/`;

module.exports = {
    certificate: {
        key: Fs.readFileSync(`${__dirname}/../certificate/localhost.key`),
        cert: Fs.readFileSync(`${__dirname}/../certificate/localhost.crt`)
    },
    getFile: (reqPath) => {
        const filePath = Path.join(imagesDir, reqPath);
        const content = Fs.readFileSync(filePath);
        return {
            content,
            contentType: Mime.getType(filePath)
        }
    }
}