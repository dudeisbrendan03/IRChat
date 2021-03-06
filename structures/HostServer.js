const EventEmitter = require('events'),
    Transmitter = require('./Transmitter'),
    Server = require('./Server'),
    Connection = require('./Connection'),
    WebSocketServer = require('websocket').server,
    http = require('http');

module.exports = class HostServer extends EventEmitter {
    constructor(config) {
        super();
        this.httpServer = http.createServer((req, res) => {
            response.writeHead(404);
            response.end();
        }).listen(3000, () => {
            console.log("Server is listening");
        })
        this.server = new WebSocketServer({
            httpServer: this.httpServer,
            autoAcceptConnections: false
        }).on('request', (req) => {
            var connection = req.accept('echo-protocol', req.origin);
            this.emit('connection', connection);
            connection.on('message', (msg) => {

            })
        })



        this.activeConnections = [];
        this.transmitter = new Transmitter();

        this.chat = new Server(config.server.name);
        this.chat.createChannel("general");
    }

    isConnected(ip) {
        let r = false;
        this.activeConnections.forEach(con => {
            if(con.ip == ip) r = true;
        });
        return r;
    }

    addConnection(websocket) {
        let con = new Connection(websocket);
        if(this.isConnected(con.ip)) {
            //con.throwError(Error("Already connected"));
            //return;
        };

        this.activeConnections.push(con);
        websocket.on('close', (data) => {
            this.activeConnections.splice(this.activeConnections.indexOf(con, 1))
            this.chat.removeUser(con.user);
        })

        return con;
    }
}