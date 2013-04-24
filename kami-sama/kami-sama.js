/** Kami-sama
 *
 * @autor : Rafael Erthal
 * @since : 2013-01
 *
 * @description : Server do barreamento de eventos da empreendemia
 */

var config = require('./config.js'),
    io = require('socket.io').listen(config.host.port),
    sockets = [];

function emit (socket, evt) {
    require('restler').post('http://'+config.services.auth.url+':'+config.services.auth.port+'/service/' + socket.service + '/authorize', {
        data: {
            secret : config.security.secret,
            token  : evt.token
        }
    }).on('success', function(data) {
        evt.token = data.token;
        socket.emit('trigger', evt);
    });
}

io.sockets.on('connection', function (socket) {
    socket.user = socket.handshake.address.address;
    sockets.push(socket);

    socket.on('auth', function (data) {
        if (data.service) {
            socket.service = data.service;
        } else {
            socket.service = 'www';
            socket.client = data.user;
        }
    });

    socket.on('trigger', function (data) {
        data.source = socket.service;
        for (var i in sockets) {
            emit(sockets[i], data);
        }
    });
});