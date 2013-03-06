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
    
    require('restler').get('http://'+config.services.auth.host+':'+config.services.auth.port+'/validate', {
        multipart: true,
        data: {
            token  : token,
            secret : config.security.secret
        }
    }).on('success', function(data) {
        cb(null, data.user);
    }).on('error', function(error) {
        cb(error, null);
    });
};