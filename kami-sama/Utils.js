/** Utils
 *
 * @autor : Rafael Erthal
 * @since : 2013-03
 *
 * @description : Biblioteca de utilidades
 */
var config = require('./config.js');

/** Tokens
 * @author : Rafael Erthal
 * @since : 2013-04
 *
 * @description : retorna os tokens de um usuário
 * @param token : token do usuário
 * @param cb : callback a ser chamado
 */
exports.tokens = function (token, cb) {
    "use strict";

    require('restler').get('http://'+config.services.auth.url+':'+config.services.auth.port+'/service/kamisama/authorize', {
        data: {
            token  : token,
            secret : config.security.secret
        }
    }).on('success', function(data) {
        if (data.token) {
            require('restler').get('http://'+config.services.auth.url+':'+config.services.auth.port+'/validate', {
                data: {
                    token  : data.token,
                    secret : config.security.secret
                }
            }).on('success', function(data) {
                if (data.tokens) {
                    cb(null, data);
                } else if (data.error) {
                    cb(data.error, null);
                } else {
                    cb(null, null);
                }
            }).on('error', function(error) {
                cb(error, null);
            });
        } else if (data.error) {
            cb(data.error, null);
        } else {
            cb(null, null);
        }
    }).on('error', function(error) {
        cb(error, null);
    });    
};

/** Services
 * @author : Rafael Erthal
 * @since : 2013-04
 *
 * @description : lista serviços registrados
 * @param cb : callback a ser chamado
 */
exports.services = function (cb) {
    "use strict";
    
    require('restler').get('http://'+config.services.auth.url+':'+config.services.auth.port+'/services').on('success',
        function(data) {
            if (data.services) {
                cb(null, data.services);
            } else if (data.error) {
                cb(data.error, null);
            } else {
                cb(null, null);
            }
        }
    ).on('error', function(error) {
        cb(error, null);
    });
};