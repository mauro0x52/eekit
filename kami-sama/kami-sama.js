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

function getCompany (token, secret, cb) {
    require('restler').get('http://'+config.services.auth.url+':'+config.services.auth.port+'/validate', {
        data: {
            secret : secret,
            token  : token
        }
    }).on('success', function(res) {
        if (res.company) {
            cb(res.company._id)
        }
    });
}

io.sockets.on('connection', function (socket) {
    sockets.push(socket);

    var service,
        secret,
        company,
        tokens = {};

    socket.say = function (source_service, source_secret, data) {
        if (service) {
            /* TODO: implementar o trigger para servico */
        }
        if (company) {
            getCompany(data.token, source_secret, function (event_company) {
                if (company === event_company) {
                    socket.emit('trigger', data);
                }
            });
        }
    };

    socket.on('auth', function (data) {
        if (data.service) {
            service = data.service;
            secret  = data.secret;
        } 
        if (data.company) {
            company = data.company;
        }
    });

    socket.on('trigger', function (data) {
        for (var i in sockets) {
            if (sockets[i] && service && secret) {
                sockets[i].say(service, secret, data);
            }
        }
    });

    socket.on('disconnect', function () {
        for (var i in sockets) {
            if (sockets[i] === socket) {
                delete sockets[i];
            }
        }
    });
});