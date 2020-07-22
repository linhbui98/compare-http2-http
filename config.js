require('dotenv').config();

const PORT_HTTP2 = process.env.PORT_HTTP2;
const PORT_HTTP1 = process.env.PORT_HTTP1;

const config = {
    portHttp1: PORT_HTTP1,
    portHttp2: PORT_HTTP2
}
module.exports = config