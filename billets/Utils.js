/** Utils
 *
 * @autor : Rafael Erthal
 * @since : 2013-03
 *
 * @description : Biblioteca de utilidades
 */
var config = require('./config.js');

/** Auth
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : valida o token de um usuário no serviço Auth
 * @param login : username do usuário
 * @param token : token do usuário
 * @param cb : callback a ser chamado após validado o token
 */
exports.auth = function (token, cb) {
    "use strict";

    require('restler').get('http://'+config.services.auth.url+':'+config.services.auth.port+'/validate', {
        data: {
            token  : token,
            secret : config.security.secret
        }
    }).on('success', function(data) {
        if (data.user) {
            cb(null, data);
        } else if (data.error) {
            cb(data.error, null);
        } else {
            cb(null, null);
        }
    }).on('error', function(error) {
        cb(error, null);
    });
};

/** Bind
 * @author : Rafael Erthal
 * @since : 2013-03
 *
 * @description : binda evento no kami-sama
 * @param name : nome do evento
 * @param method : método para chamar a url
 * @param callback : url a ser chamada no disparo do evento
 */
exports.bind = function (token, name, method, callback) {
    "use strict";

    require('restler').post('http://' + config.services.kamisama.url + ':' + config.services.kamisama.port + '/bind', {
        data: {
            token : token,
            secret : config.security.secret,
            label : name,
            method : method,
            callback : callback
        }
    }).on('success', function() {}).on('error', function() {});
};

/** Trigger
 * @author : Rafael Erthal
 * @since : 2013-03
 *
 * @description : dispara evento no kami-sama
 * @param name : nome do evento
 * @param method : método para chamar a url
 * @param callback : url a ser chamada no disparo do evento
 */
exports.trigger = function (token, name, data) {
    "use strict";

    require('restler').post('http://' + config.services.kamisama.url + ':' + config.services.kamisama.port + '/tigger', {
        data: {
            token : token,
            secret : config.security.secret,
            label : name,
            data : data
        }
    }).on('success', function() {}).on('error', function() {});
};