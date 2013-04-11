/**
 * Autenticação de serviços e apps
 *
 * @author : Rafael Almeida Erthal Hermano
 * @since : 2013-02
 *
 * @description : Módulo que implementa as funcionalidades de autenticação de serviços e apps
 */

module.exports = function (app) {
    "use strict";

    var Model = require('./../model/Model.js'),
        User  = Model.User,
        config  = require('../config.js');


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
    app.get('/validate', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        var service = null, result = {};

        for (var i in config.services) {
            if (config.services[i].secret === request.param('secret', '')) {
                service = config.services[i]
                service.slug = i;
            }
        }

        if (service === null) {
            response.send({error : { message : 'service unauthorized', name : 'InvalidServiceError', path : 'service'}});
        } else {
            User.findByToken(request.param('token', null), function (error, user) {
                if (error) {
                    response.send({error : { message : 'invalid token', name : 'InvalidTokenError'}});
                } else if (user === null) {
                    response.send({error : {message :  'invalid token', name : 'InvalidTokenError' }});
                } else if (user.checkToken(request.param('token', null), service.slug)) {
                    result.user = {_id : user._id, name : user.name};
                    result.company = {_id : user.company};
                    result.token = request.param('token', null);
                    if (service.permissions.username) {
                        result.user.username = user.username;
                    }
                    if (service.permissions.tokens) {
                        result.tokens = user.tokens;
                    }
                    if (service.permissions.informations) {
                        result.informations = user.informations;
                    }
                    response.send(result);
                } else {
                    response.send({ error : { message : 'Invalid token', name : 'InvalidTokenError'}});
                }
            });
        }
    });
};