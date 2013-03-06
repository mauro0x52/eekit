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
        Service  = Model.Service;

    /** POST /service/:id/auth
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : autentica o usuário no serviço
     *
     * @allowedApp : Apenas o www
     * @allowedUser : Logado
     *
     * @request : {secret, token, service_slug}
     * @response : {token}
     */
    app.post('/service/:service_slug/auth', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        Service.findOne({secret : request.param('secret', null)}, function (error, service) {
            if (error) {
                response.send({error : error});
            } else {
                if (service === null) {
                    response.send({error : { message : 'service unauthorized', name : 'InvalidServiceError', path : 'service'}});
                } else {
                    if (service.slug !== 'www') {
                        response.send({error : { message : 'service unauthorized', name : 'InvalidServiceError', path : 'service'}});
                    } else {
                        User.findByToken(request.param('token', null), function (error, user) {
                            if (error) {
                                response.send({error : { message : 'user not found', name : 'NotFoundError', id : request.params.login, path : 'user'}});
                            } else {
                                if (user === null) {
                                    response.send({error : {message :  'user not found', name : 'NotFoundError', id : request.params.login, path : 'user' }});
                                } else {
                                    if (user.checkToken(request.param('token', null), service._id)) {
                                        Service.findOne({slug : request.params.service_slug}, function (error, service) {
                                            if (error) {
                                                response.send({error : error});
                                            } else {
                                                if (service === null) {
                                                    response.send({error : { message : 'service not found', name : 'NotFoundError', path : 'service'}});
                                                } else {
                                                    user.auth(service._id, function (error, token) {
                                                        if (error) {
                                                            response.send({error : error});
                                                        } else {
                                                            response.send({token : token});
                                                        }
                                                    });
                                                }
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
            }
        });
    });

    /** POST /service/:id/app/:id/auth
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : autentica o usuário no serviço
     *
     * @allowedApp : Apenas o www
     * @allowedUser : Logado
     *
     * @request : {secret, token, service_slug, app_slug}
     * @response : {token}
     */
    app.post('/service/:service_slug/app/:app_slug/auth', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        Service.findOne({secret : request.param('secret', null)}, function (error, service) {
            if (error) {
                response.send({error : error});
            } else {
                if (service === null) {
                    response.send({error : { message : 'service unauthorized', name : 'InvalidServiceError', path : 'service'}});
                } else {
                    if (service.slug !== 'www') {
                        response.send({error : { message : 'service unauthorized', name : 'InvalidServiceError', path : 'service'}});
                    } else {
                        User.findByToken(request.param('token', null), function (error, user) {
                            if (error) {
                                response.send({error : { message : 'user not found', name : 'NotFoundError', id : request.params.login, path : 'user'}});
                            } else {
                                if (user === null) {
                                    response.send({error : {message :  'user not found', name : 'NotFoundError', id : request.params.login, path : 'user' }});
                                } else {
                                    if (user.checkToken(request.param('token', null), service._id)) {
                                        Service.findById(request.params.service_slug, function (error, service) {
                                            var i;
                                            if (error) {
                                                response.send({error : error});
                                            } else {
                                                if (service === null) {
                                                    response.send({error : { message : 'service not found', name : 'NotFoundError', path : 'service'}});
                                                } else {
                                                    for (i in user.auths) {
                                                        if (user.auths[i].service.toString() === service._id.toString()) {
                                                            user.auths[i].apps.push(request.params.app_slug);
                                                        }
                                                    }
                                                    response.send({auth : true});
                                                }
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
            }
        });
    });

    /** GET /validate
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : valida token
     *
     * @allowedApp : Qualquer serviço
     * @allowedUser : Logado
     *
     * @request : {token, secret}
     * @response : {_id}
     */
    app.get('/validate', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        Service.findOne({secret : request.param('secret', null)}, function (error, service) {
            if (error) {
                response.send({error : error});
            } else {
                if (service === null) {
                    response.send({error : { message : 'service unauthorized', name : 'InvalidServiceError', path : 'service'}});
                } else {
                    User.findByToken(request.param('token', null), function (error, user) {
                        if (error) {
                            response.send({error : { message : 'user not found', name : 'NotFoundError', id : request.params.login, path : 'user'}});
                        } else {
                            if (user === null) {
                                response.send({error : {message :  'user not found', name : 'NotFoundError', id : request.params.login, path : 'user' }});
                            } else {
                                if (user.checkToken(request.param('token', null), service._id)) {
                                    result._id = user._id;
                                    if (service.permissions.username) {
                                        result.username = user.username;
                                    }
                                    if (service.permissions.tokens) {
                                        result.username = user.auths;
                                    }
                                    response.send({user : result});
                                } else {
                                    response.send({ error : { message : 'Invalid token', name : 'InvalidTokenError'}});
                                }
                            }
                        }
                    });
                }
            }
        });
    });
};