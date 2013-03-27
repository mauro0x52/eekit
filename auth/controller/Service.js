/** Services
 * @author : Rafael Almeida Erthal Hermano
 * @since : 2013-02
 *
 * @description : Módulo que implementa as funcionalidades de serviços
 */

module.exports = function (app) {
    "use strict";

    var config  = require('../config.js');

    /** GET /validate
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : valida token
     *
     * @request : {token, secret}
     * @response : {user}
     */
    app.get('/services', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        var result = {};

        for (var i in config.services) {
            if (i === 'www') {
                result[i] = {
                    host : config.services[i].url,
                    port : config.services[i].port,
                    secret : config.services[i].secret
                };
            } else {
                result[i] = {
                    host : config.services[i].url,
                    port : config.services[i].port
                };
            }
        }

        response.send({services : result});
    });
};