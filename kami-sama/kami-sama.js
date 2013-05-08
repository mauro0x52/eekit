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

function emit(source, target, data) {
    if (target.tokens[source.service]) {
        require('restler').get('http://'+config.services.auth.url+':'+config.services.auth.port+'/validate', {
            data: {
                secret : source.secret,
                token  : target.tokens[source.service]
            }
        }).on('success', function(res) {
            if (target.secret || target.company === res.company._id) {
                data.token = target.tokens[source.service];
                target.emit('trigger', data);   
            }
        });
    } else {
        require('restler').post('http://'+config.services.auth.url+':'+config.services.auth.port+'/service/' + source.service + '/authorize', {
            data: {
                secret : config.security.secret,
                token  : data.token
            }
        }).on('success', function(res) {
            target.tokens[source.service] = res.token;
            if (target.secret || target.company === res.company._id) {
                data.token = target.tokens[source.service];
                target.emit('trigger', data);
            }
        });
    }
}

io.sockets.on('connection', function (socket) {
    socket.user = socket.handshake.address.address;
    socket.tokens = {};

    socket.on('auth', function (data) {
        if (data.service) {
            socket.service = data.service;
            socket.secret = data.secret;
            services.push(socket)
        } else {
            socket.service = 'www';
            socket.company = data.company;
            clients.push(socket)
        }
    });

    socket.on('trigger', function (data) {
        data.source = socket.service;
        for (var i in clients) {
            if (clients[i]) {
                emit(socket, clients[i], data);
            }
        }
        for (var i in services) {
            if (services[i]) {
                emit(socket, services[i], data);
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