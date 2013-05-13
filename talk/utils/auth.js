/** Auth
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : valida o token de um usuário no serviço Auth
 * @param token : token do usuário
 * @param cb : callback a ser chamado após validado o token
 */
module.exports = function (token, cb) {
    "use strict";

    var config = require('../config.js'),
        qs = require('querystring');

    require('needle').get('http://'+config.services.auth.url+':'+config.services.auth.port+'/validate?' + qs.stringify({ token  : token, secret : config.security.secret }),
        function (error, response, data) {
            if (error) {
                cb(error, null);
            } else {
                if (data.company) {
                    cb(null, data);
                } else if (data.error) {
                    cb(data.error, null);
                } else {
                    cb(null, null);
                }
            }
        }
    );
};