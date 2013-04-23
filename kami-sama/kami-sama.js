/** Kami-sama
 *
 * @autor : Rafael Erthal
 * @since : 2013-01
 *
 * @description : Server do barreamento de eventos da empreendemia
 */

var config = require('./config.js'),
    xmpp = require('node-xmpp'),
    io = require('socket.io').listen(8010),
    serversEvents = [],
    sockets = [];

var server = new xmpp.C2SServer({
    port: config.host.port,
    domain: config.host.url
});

var triggerXMPP = function (event, token, postdata) {
    require('restler').post('http://'+config.services.auth.url+':'+config.services.auth.port+'/service/' + event.client.jid.user + '/authorize', {
        data: {
            secret : config.security.secret,
            token  : token
        }
    }).on('success', function(data) {
        event.client.send(
            new xmpp.Element('event')
                .c('label').t(event.label).up()
                .c('token').t(data.token).up()
                .c('data').t(postdata)
        );
    }).on('error', function(error) {});
};

server.on('connect', function(client) {
    server.on("register", function(opts, cb) {
        cb(true);
    });

    client.on('authenticate', function(opts, cb) {
        cb(null);
    });

    client.on('stanza', function(stanza) {
    	if (stanza.name === 'bind') {
    		serversEvents.push({
    			label   : stanza.children[0].children[0],
    			client  : client
    		});
    	}
    	if (stanza.name === 'trigger') {
            for (var i in serversEvents) {
                if (serversEvents[i].label === stanza.children[0].children[0]) {
                    triggerXMPP(serversEvents[i], stanza.children[1].children[0], stanza.children[2].children[0]);
                }
            }
            require('restler').post('http://'+config.services.auth.url+':'+config.services.auth.port+'/service/www/authorize', {
                data: {
                    secret : config.security.secret,
                    token  : stanza.children[1].children[0]
                }
            }).on('success', function(data) {
                for (var i in sockets) {
                    if (sockets[i].user._id === data.user._id) {
                        sockets[i].emit('trigger',{
                            label : stanza.children[0].children[0],
                            data  : stanza.children[2].children[0]
                        });
                    }
                }
            }).on('error', function(error) {});
    	}
    });
});

io.sockets.on('connection', function (socket) {
    socket.user = socket.handshake.address.address;
    sockets.push(socket);
    socket.on('auth', function (data) {
        socket.user = data.user;
    });
});