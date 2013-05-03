/** Kami-sama
 *
 * @autor : Rafael Erthal
 * @since : 2013-01
 *
 * @description : Server do barreamento de eventos da empreendemia
 */

var config = require('./config.js'),
    io = require('socket.io').listen(config.host.port),
    clients = [],
    services = [];

function emit(socket, data, service) {
    if (socket.tokens[service]) {
        data.token = socket.tokens[service];
        socket.emit('trigger', data);
    } else {
        require('restler').post('http://'+config.services.auth.url+':'+config.services.auth.port+'/service/' + service + '/authorize', {
            data: {
                secret : config.security.secret,
                token  : data.token
            }
        }).on('success', function(res) {
            socket.tokens[service] = res.token;
            data.token = res.token;
            socket.emit('trigger', data);
        });
    }
}

io.sockets.on('connection', function (socket) {
    socket.user = socket.handshake.address.address;
    socket.tokens = {};

    socket.on('auth', function (data) {
        if (data.service) {
            socket.service = data.service;
            services.push(socket)
        } else {
            socket.client = data.user;
            clients.push(socket)
        }
    });

    socket.on('trigger', function (data) {
        data.source = socket.service;
        for (var i in clients) {
            if (clients[i]) {
                emit(clients[i], data, 'www');
            }
        }
        for (var i in services) {
            if (services[i]) {
                emit(services[i], data, services[i].service);
            }
        }
    });

    socket.on('disconnect', function () {
        for (var i in clients) {
            if (clients[i] === socket) {
                delete clients[i];
            }
        }
        for (var i in services) {
            if (services[i] === socket) {
                delete services[i];
            }
        }
    });
});