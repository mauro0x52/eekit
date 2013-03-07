/** User
 * @author : Rafael Almeida Erthal Hermano
 * @since : 2012-07
 *
 * @description : Módulo que implementa as funcionalidades de conta de usuário
 */

module.exports = function (app) {
    "use strict";

    var Model = require('./../model/Model.js'),
        User  = Model.User,
        config = require('../config.js'),
        Service  = Model.Service;

    /** GET /users
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Lista usuários do banco
     *
     * @request : {secret}
     * @response : {users[]}
     */
    app.get('/users', function (request, response) {
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
            if (!service.permissions.users) {
                response.send({error : { message : 'service unauthorized', name : 'InvalidServiceError', path : 'service'}});
            } else {
                User.find(function (error, users) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        response.send({users : users});
                    }
                });
            }
        }
    });

    /** POST /user
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Cadastra novo usuário
     *
     * @request : {username, password, password_confirmation, secret}
     * @response : {token}
     */
    app.post('/user', function (request, response) {
        var user,
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
        } else {
            // valida se o serviço que esta cadastrando o usuário é o WWW
            if (service.slug !== 'www') {
                response.send({error : { message : 'service unauthorized', name : 'InvalidServiceError', path : 'service'}});
            } else {
                // valida se a senha e a confirmação senha conferem
                if (request.param('password', null) !== request.param('password_confirmation', null)) {
                    response.send({error : {message : 'invalid password confirmation', name : 'ValidationError', errors : {password_confirmation : {message : 'invalid password confirmation', name : 'ValidatorError', path : 'password_confirmation', type : 'confirmation' }}}});
                } else {
                    //pega os dados do post e coloca em um novo objeto
                    user = new User({
                        username : request.param('username', null),
                        password : request.param('password', null),
                        dateCreated : new Date()
                    });
                    //salva novo usuário
                    user.save(function (error) {
                        if (error) {
                            if (error.code == 11000) {
                                // usuário já existe
                                response.send({error : {message : 'username already registered', name : 'ValidationError', errors : {username : {message : 'username already registered', name : 'ValidatorError', path : 'username', type : 'unique' }}}});
                            } else {
                                response.send({error : error});
                            }
                        } else {
                            //loga o usuário no sistema
                            user.login(function (error, tokenKey) {
                                if (error) {
                                    response.send({error : error});
                                } else {
                                    response.send({token : tokenKey});
                                }
                            });
                        }
                    });
                }
            }
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
};