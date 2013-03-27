/**
 * Company
 * Controller das companies (conjunto de pessoas)
 *
 * @author Mauro Ribeiro
 * @since  2013-03
 */

module.exports = function (app) {
    "use strict";

    var Model = require('./../model/Model.js'),
        User  = Model.User,
        Company  = Model.Company,
        config = require('../config.js');

    /**
     * Cadastra nova company (conjunto de pessoas)
     *
     * @author Mauro Ribeiro
     * @since  2013-03
     *
     * @request : {name, admin : {username, password, password_confirmation, secret, info}}
     * @response : {token}
     */
    app.post('/company', function (request, response) {
        var userData, user, company,
            service = null;

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        for (var i in config.services) {
            if (config.services[i].secret === request.param('secret', '')) {
                service = config.services[i]
                service.slug = i;
            }
        }

        if (service === null) {
            response.send({error : { message : 'service unauthorized', name : 'InvalidServiceError', path : 'service'}});
        } else  if (service.slug !== 'www') {
            // valida se o serviço que esta cadastrando o usuário é o WWW
            response.send({error : { message : 'service unauthorized', name : 'InvalidServiceError', path : 'service'}});
        } else  if (request.param('password', null) !== request.param('password_confirmation', null)) {
            // valida se a senha e a confirmação senha conferem
            response.send({error : {message : 'invalid password confirmation', name : 'ValidationError', errors : {password_confirmation : {message : 'invalid password confirmation', name : 'ValidatorError', path : 'password_confirmation', type : 'confirmation' }}}});
        } else {
            // cria a empresa
            company = new Company({
                name : request.param('name', null),
            });
            // cria o usuário
            userData = request.param('admin', {});
            user = new User({
                name     : userData.name,
                username : userData.username,
                password : userData.password,
                company  : company._id,
                dateCreated : new Date()
            });
            company.users = [user._id];
            // salva a empresa
            company.save(function (error) {
                if (error) {
                    response.send({error : error});
                } else {
                    //salva novo usuário
                    user.save(function (error) {
                        if (error) {
                            if (error.code == 11000) {
                                // usuário já existe
                                response.send({error : {message : 'username already registered', name : 'ValidationError', errors : {username : {message : 'username already registered', name : 'ValidatorError', path : 'username', type : 'unique' }}}});
                            } else {
                                response.send({error : error});
                            }
                            company.remove();
                        } else {
                            //loga o usuário no sistema
                            user.login('www', function (error, token) {
                                if (error) {
                                    response.send({error : error});
                                } else {
                                    response.send({
                                        company : {_id : company._id, name : company.name},
                                        user : {_id : user._id, name : user.name, username : user.username},
                                        token : token.token
                                    });
                                }
                            });
                        }
                    });
                }
            })
        }
    });

    /** POST /user/login
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : autentica o usuário
     *
     * @request : {login, password, secret}
     * @response : {token}
     */
    app.post('/user/login', function (request, response) {
        var service = null;

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        for (var i in config.services) {
            if (config.services[i].secret === request.param('secret', '')) {
                service = config.services[i]
                service.slug = i;
            }
        }

        if (service === null || service.slug !== 'www') {
            response.send({error : { message : 'service unauthorized', name : 'InvalidServiceError', path : 'service'}});
        } else {
            User.findOne({username : request.param('username', null)}, function (error, user) {
                if (error) {
                    response.send({error : { message : 'invalid username or password', name : 'InvalidLoginError'}});
                } else {
                    if (user === null) {
                        response.send({error : { message : 'invalid username or password', name : 'InvalidLoginError'}});
                    } else {
                        if (user.password !== User.encryptPassword(request.param('password', null))) {
                            response.send({error : { message : 'invalid username or password', name : 'InvalidLoginError'}});
                        } else {
                            user.login(function (error, tokenKey) {
                                if (error) {
                                    response.send({error : error});
                                } else {
                                    response.send({token : tokenKey});
                                }
                            });
                        }
                    }
                }
            });
        }
    });

    /** POST /user/logout
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : desautentica o usuário
     *
     * @request : {token, secret}
     * @response : null
     */
    app.post('/user/logout', function (request, response) {
        var service = null;

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        for (var i in config.services) {
            if (config.services[i].secret === request.param('secret', '')) {
                service = config.services[i]
                service.slug = i;
            }
        }

        if (service === null || service.slug !== 'www') {
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
                            user.logout(request.param('token', null), function (error) {
                                if (error) console.log(user)
                                if (error) {
                                    response.send({error : error});
                                } else {
                                    response.send(null);
                                }
                            });
                        } else {
                            response.send({ error : { message : 'Invalid token', name : 'InvalidTokenError'}});
                        }
                    }
                }
            });
        }
    });

    /** POST /user/forgot-password
     *
     * @autor : Rafael Erthal
     * @since : 2013-03
     *
     * @description : envia email para mudança de senha
     *
     * @request : {login}
     * @response : {}
     */
    app.post('/user/forgot-password', function (request, response) {
        var service = null;

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        for (var i in config.services) {
            if (config.services[i].secret === request.param('secret', '')) {
                service = config.services[i]
                service.slug = i;
            }
        }

        if (service === null || service.slug !== 'www') {
            response.send({error : { message : 'service unauthorized', name : 'InvalidServiceError', path : 'service'}});
        } else {
            User.findOne({username : request.param('username', null)}, function (error, user) {
                if (error) {
                    response.send({error : { message : 'invalid username or password', name : 'InvalidLoginError'}});
                } else {
                    if (user === null) {
                        response.send({error : { message : 'invalid username or password', name : 'InvalidLoginError'}});
                    } else {
                        user.login(function (error, tokenKey) {
                            if (error) {
                                response.send({error : error});
                            } else {
                                require('restler').post('http://' + config.services.jaiminho.url + ':' + config.services.jaiminho.port + '/mail', {
                                    data: {
                                        token      : tokenKey,
                                        subject    : 'Recuperação de senha',
                                        html       : 'Para criar uma nova senha no empreendekit, entre no link <a href="http://www.empreendekit.com.br/?token=' + tokenKey + '#!/ee/mudar-senha">http://www.empreendekit.com.br/?token=' + tokenKey + '#!/ee/mudar-senha</a>',
                                        categories : 'password recovery',
                                        service    : 'auth'
                                    }
                                }).on('success', function(data) {response.send(null);}).on('error', function() {});
                                response.send(null);
                            }
                        });
                    }
                }
            });
        }
    });

    /** POST /user/change-password
     *
     * @autor : Rafael Erthal
     * @since : 2013-03
     *
     * @description : desautentica o usuário
     *
     * @request : {token, secret}
     * @response : null
     */
    app.post('/user/change-password', function (request, response) {
        var service = null;

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        for (var i in config.services) {
            if (config.services[i].secret === request.param('secret', '')) {
                service = config.services[i]
                service.slug = i;
            }
        }

        if (service === null || service.slug !== 'www') {
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
                            if (request.param('password', null) !== request.param('password_confirmation', null)) {
                                response.send({error : {message : 'invalid password confirmation', name : 'ValidationError', errors : {password_confirmation : {message : 'invalid password confirmation', name : 'ValidatorError', path : 'password_confirmation', type : 'confirmation' }}}});
                            } else {
                                user.password = User.encryptPassword(request.param('password', null));
                                user.save(function (error) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        response.send(null);
                                    }
                                });
                            }
                        } else {
                            response.send({ error : { message : 'Invalid token', name : 'InvalidTokenError'}});
                        }
                    }
                }
            });
        }
    });
};