/** Services
 * @author : Rafael Almeida Erthal Hermano
 * @since : 2013-02
 *
 * @description : Módulo que implementa as funcionalidades de serviços
 */

module.exports = function (params) {
    "use strict";

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
    params.app.get('/services', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        var result = {};

        for (var i in params.config.services) {
            if (i === 'www') {
                result[i] = {
                    host : params.config.services[i].url,
                    port : params.config.services[i].port,
                    secret : params.config.services[i].secret
                };
            } else {
                result[i] = {
                    host : params.config.services[i].url,
                    port : params.config.services[i].port
                };
            }
        }
        console.log(result);
        response.send({services : result});
    });


    /**
     * Autentica uma empresa em um serviço
     *
     * @author Rafael Erthal
     * @since  2012-07
     *
     * @request   {secret, token}
     * @response  {token}
     */
    params.app.post('/service/:service_slug/authorize', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        var service = null;

        for (var i in params.config.services) {
            if (params.config.services[i].secret === request.param('secret', '')) {
                service = params.config.services[i]
                service.slug = i;
            }
        }

        if (service === null || !service.permissions.auth) {
            response.send({error : { message : 'service unauthorized', name : 'InvalidServiceError', path : 'service'}});
        } else {
            params.model.User.findByToken(request.param('token', null), function (error, user) {
                if (error || !user) {
                    response.send({error : { message : 'invalid token', name : 'InvalidTokenError', id : request.param('token', null), path : 'token'}});
                } else {
                    params.model.Company.findById(user.company, function (error, company) {
                        if (error || !company) {
                            response.send({error : { message : 'company not found', name : 'NotFoundError', id : user.company, path : 'company'}});
                        } else {
                            // autoriza a empresa
                            company.authorizeService(request.params.service_slug, function (error) {
                                if (error) {
                                    response.write({error : error});
                                } else {
                                    user.login(request.params.service_slug, function(error, token) {
                                        if (error) {
                                            response.send({error : error});
                                        } else {
                                            var responseData = {
                                                user : {_id : user._id},
                                                company : {_id : user.company},
                                                token : token
                                            };
                                            if (service.permissions.username) {
                                                responseData.user.username = user.username;
                                            }
                                            if (service.permissions.tokens) {
                                                responseData.tokens = user.tokens;
                                            }
                                            if (service.permissions.informations) {
                                                responseData.informations = user.informations;
                                            }
                                            response.send(responseData);
                                        }
                                    })
                                }
                            });
                        }
                    });
                }
            });
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
    params.app.post('/service/:service_slug/app/:app_id/authorize', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');
        var service = null, foundService = false;

        for (var i in params.config.services) {
            if (params.config.services[i].secret === request.param('secret', '')) {
                service = params.config.services[i]
                service.slug = i;
            }
        }

        if (service === null || !service.permissions.auth) {
            response.send({error : { message : 'service unauthorized', name : 'InvalidServiceError', path : 'service'}});
        } else {
            params.model.User.findByTokenService(request.param('token', null), service.slug, function (error, user) {
                if (error || user === null) {
                    response.send({error : {message :  'invalid token', name : 'InvalidTokenError', id : request.params.login, path : 'user' }});
                } else  if (user.checkToken(request.param('token', null))) {
                    params.model.Company.findById(user.company, function (error, company) {
                       if (error || !company) {
                            response.send({error : { message : 'company not found', name : 'NotFoundError', id : user.company, path : 'company'}});
                       } else {
                            // autoriza o app
                            company.authorizeApp(
                                request.params.app_id,
                                request.params.service_slug,
                                function (error) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        response.send(null);
                                    }
                                }
                            );
                       }
                    });
                }
            });
        }
    });
};
