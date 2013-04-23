/** Kami-sama
 *
 * @autor : Rafael Erthal
 * @since : 2013-04
 *
 * @description : Bivlioteca de comunicação com kami-sama
 */

var config = require('../config.js'),
    xmpp = require('node-xmpp'),
    events = [];

kamisama = new xmpp.Client({
    jid     : config.security.name + "@service.empreendekit.com",
    password: config.security.secret,
    host    : "localhost",
    port    : 5222
});

kamisama.on('close', function () {
	throw 'kami-sama fora do ar, reiniciando serviço';
});

kamisama.on('stanza', function(stanza) {
	if (stanza.name === 'event') {
		for (var i in events) {
			if (events[i].label === stanza.children[0].children[0]) {
				events[i].callback(JSON.parse(stanza.children[2].children[0]));
			}
		}
	}
});

/** Bind
 * @author : Rafael Erthal
 * @since : 2013-04
 *
 * @description : binda evento no kami-sama
 * @param name : nome do evento
 * @param callback : função a ser chamada
 */
var bind = function (name, callback) {
	kamisama.send(
		new xmpp.Element('bind')
			.c('label').t(name)
	);
	events.push({
		label : name,
		callback : callback
	})
};

/** Trigger
 * @author : Rafael Erthal
 * @since : 2013-04
 *
 * @description : dispara evento no kami-sama
 * @param name : nome do evento
 * @param token : token do usuario
 * @param data : dados a serem enviados
 */
var trigger = function (token, name, data) {
	kamisama.send(
		new xmpp.Element('trigger')
			.c('label').t(name).up()
			.c('token').t(token).up()
			.c('data').t(JSON.stringify(data)).up()
	);
};

module.exports = function (cb) {
	kamisama.on('online', function(stanza) {
		cb({
			bind    : bind,
			trigger : trigger
		});
	});
};