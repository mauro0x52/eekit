/** User
 * @author : Rafael Almeida Erthal Hermano
 * @since : 2013-02
 *
 * @description : Módulo que implementa as funcionalidades de autenticação de serviços e apps
 */

module.exports = function (app) {
    "use strict";

    var Model = require('./../model/Model.js'),
        User  = Model.User,
        Service  = Model.Service,
        config  = require('../config.js');

    /** POST /service/:id/auth
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : autentica o usuário no serviço
     *
     * @request : {secret, token}
     * @response : {token}
     */
    app.post('/service/:service_slug/auth', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        var service = null;

        for (var i in config.services) {
            if (config.services[i].secret === request.param('secret', '')) {
                service = config.services[i]
                service.slug = i;
            }
        }

        if (service === null) {
            response.send({error : { message : 'service unauthorized', name : 'InvalidServiceError', path : 'service'}});
        } else {
            if (service.slug !== 'www') {
                response.send({error : { message : 'service unauthorized', name : 'InvalidServiceError', path : 'service'}});
            } else {
                User.findByToken(request.param('token', null), function (error, user) {
                    if (error) {
                        response.send({error : { message : 'user not found', name : 'InvalidTokenError', id : request.params.login, path : 'user'}});
                    } else {
                        if (user === null) {
                            response.send({error : {message :  'user not found', name : 'InvalidTokenError', id : request.params.login, path : 'user' }});
                        } else {
                            if (user.checkToken(request.param('token', null), service.slug)) {
                                user.auth(request.params.service_slug, function (error, token) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        response.send({token : token});
                                    }
                                });
                            } else {
                                response.send({ error : { message : 'Invalid token', name : 'InvalidTokenError'}});
                            }
                        }
                    }
                });
            }
        }
    });

    /** POST /service/:id/app/:id/auth
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : autentica o usuário no serviço
     *
     * @request : {secret, token}
     * @response : {auth}
     */
    app.post('/service/:service_slug/app/:app_slug/auth', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');
        var service = null, foundService = false;

        for (var i in config.services) {
            if (config.services[i].secret === request.param('secret', '')) {
                service = config.services[i]
                service.slug = i;
            }
        }

        if (service === null) {
            response.send({error : { message : 'service unauthorized', name : 'InvalidServiceError', path : 'service'}});
        } else {
            if (service.slug !== 'www') {
                response.send({error : { message : 'service unauthorized', name : 'InvalidServiceError', path : 'service'}});
            } else {
                User.findByToken(request.param('token', null), function (error, user) {
                    if (error) {
                        response.send({error : { message : 'user not found', name : 'InvalidTokenError', id : request.params.login, path : 'user'}});
                    } else {
                        if (user === null) {
                            response.send({error : {message :  'user not found', name : 'InvalidTokenError', id : request.params.login, path : 'user' }});
                        } else {
                            if (user.checkToken(request.param('token', null), service.slug)) {
                                for (i in user.auths) {
                                    if (user.auths[i].service === request.params.service_slug) {
                                        user.auths[i].apps.push(request.params.app_slug);
                                        foundService = true;
                                    }
                                }
                                if (foundService) {
                                    user.save(function() {
                                        response.send({ auth : true });
                                    })
                                } else {
                                    response.send({ error : { message : 'service unauthorized', name : 'InvalidServiceError'}});
                                }
                            } else {
                                response.send({ error : { message : 'Invalid token', name : 'InvalidTokenError'}});
                            }
                        }
                    }
                });
            }
        }
    });

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
                } else {
                    if (user === null) {
                        response.send({error : {message :  'invalid token', name : 'InvalidTokenError' }});
                    } else {
                        if (user.checkToken(request.param('token', null), service.slug)) {
                            result._id = user._id;
                            if (service.permissions.username) {
                                result.username = user.username;
                            }
                            if (service.permissions.tokens) {
                                result.auths = user.auths;
                            }
                            response.send({user : result});
                        } else {
                            response.send({ error : { message : 'Invalid token', name : 'InvalidTokenError'}});
                        }
                    }
                }
            });
        }
    });
};