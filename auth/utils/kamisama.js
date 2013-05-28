/** Kami-sama
 *
 * @autor : Rafael Erthal
 * @since : 2013-04
 *
 * @description : Bivlioteca de comunicação com kami-sama
 */

var config = require('../config.js'),
	socket = require('socket.io-client').connect('http://' + config.services.kamisama.url + ':' + config.services.kamisama.port),
	events = [];

/** Bind
 * @author : Rafael Erthal
 * @since : 2013-04
 *
 * @description : binda evento no kami-sama
 * @param label : nome do evento
 * @param callback : função a ser chamada
 */
var bind = function (label, callback) {
	events.push({
		label : label,
		callback : callback
	});
};

/** Trigger
 * @author : Rafael Erthal
 * @since : 2013-04
 *
 * @description : dispara evento no kami-sama
 * @param label : nome do evento
 * @param token : token do usuario
 * @param data : dados a serem enviados
 */
var trigger = function (token, label, data) {
	socket.emit('trigger', {
		label : label,
		token : token,
		data  : data
	});
};

socket.on('connect', function () {

	/* Autentica no kami-sama */
	socket.emit('auth', {
		service : 'www',
		secret  : config.services.www.secret
	});

	/* Escuta qualquer evento que venha do kami-sama */
	socket.on('trigger', function(data){
		for (var i in events) {
			if (events[i].label === data.label) {
				events[i].callback(data.data);
			}
		}
	});
});

module.exports = {
	bind    : bind,
	trigger : trigger
};