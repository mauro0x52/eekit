/** User
 * @author : Rafael Almeida Erthal Hermano
 * @since : 2012-07
 *
 * @description : Módulo que implementa as funcionalidades de conta de usuário
 */

module.exports = function (params) {
    "use strict";

    /**
     * Lista todos os usuários do banco
     *
     * @author Rafael Erthal
     * @since  2012-07
     *
     * @request     {secret}
     * @response    {users[]}
     */
    params.app.get('/users', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        var service = null;

        for (var i in params.config.services) {
            if (params.config.services[i].secret === request.param('secret', '')) {
                service = params.config.services[i]
                service.slug = i;
            }
        }

        if (service === null) {
            response.send({error : { message : 'service unauthorized', name : 'InvalidServiceError', path : 'service'}});
        } else {
            if (!service.permissions.users) {
                response.send({error : { message : 'service unauthorized', name : 'InvalidServiceError', path : 'service'}});
            } else {
                params.model.User.find({}, '_id name username company info dateCreated', function (error, users) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        response.send({users : users});
                    }
                });
            }
        }
    });

    /**
     * Lista as informações de um usuário
     *
     * @author Mauro Ribeiro
     * @since  2013-04
     *
     * @request     {id,secret}
     * @response    {users[]}
     */
    params.app.get('/user/:id', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        var service = null, result = {};

        for (var i in params.config.services) {
            if (params.config.services[i].secret === request.param('secret', '')) {
                service = params.config.services[i]
                service.slug = i;
            }
        }

        if (service === null) {
            response.send({error : { message : 'service unauthorized', name : 'InvalidServiceError', path : 'service'}});
        } else {
            params.model.User.findOne({_id:request.params.id}, '_id name username company informations dateCreated tokens', function (error, user) {
                if (error || !user) {
                    response.send({error : { message : 'user not found', name : 'NotFoundError', path : 'id', id : request.params.id}});
                } else {
                    result._id = user._id;
                    result.name = user.name;
                    result.company = user.company;
                    if (service.permissions.username) {
                        result.username = user.username;
                    }
                    if (service.permissions.tokens) {
                        result.tokens = user.tokens;
                    }
                    if (service.permissions.informations) {
                        result.informations = user.informations;
                    }
                    response.send({user : result});
                }
            });
        }
    });

    /**
     * Cadastra novo usuário na empresa
     *
     * @author Rafael Erthal
     * @since  2012-07
     *
     * @request     {name, username, password, secret}
     * @response    {user}
     */
    params.app.post('/user', function (request, response) {
        var newUser,
            service = null;

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        for (var i in params.config.services) {
            if (params.config.services[i].secret === request.param('secret', '')) {
                service = params.config.services[i]
                service.slug = i;
            }
        }

        if (service === null) {
            response.send({error : { message : 'service unauthorized', name : 'InvalidServiceError', path : 'service'}});
        } else if (service.slug !== 'www') {
            // valida se o serviço que esta cadastrando o usuário é o WWW
            response.send({error : { message : 'service unauthorized', name : 'InvalidServiceError', path : 'service'}});
        } else {
            // procura token
            params.model.User.findByToken(request.param('token', null), function(error, user) {
                if (error || !user) {
                    response.send({error : { message : 'invalid token', name : 'InvalidTokenError', id : request.param('token', null), path : 'token'}});
                } else {
                    // procura a empresa
                    Company.findById(user.company, function(error, company) {
                        if (error || !company) {
                            response.send({error : { message : 'invalid token', name : 'InvalidTokenError', id : request.param('token', null), path : 'token'}});
                        } else {
                            // cria novo usuário
                            newUser = new params.model.User({
                                name     : request.param('name', null),
                                username : request.param('username', null),
                                password : request.param('password', null),
                                company  : company._id,
                                dateCreated : new Date()
                            });
                            // adiciona no perfil da empresa
                            company.users.push(newUser._id);
                            // salva usuário
                            newUser.save(function(error) {
                                if (error) {
                                    if (error.code == 11000) {
                                        // usuário já existe
                                        response.send({error : {message : 'username already registered', name : 'ValidationError', errors : {username : {message : 'username already registered', name : 'ValidatorError', path : 'username', type : 'unique' }}}});
                                    } else {
                                        response.send({error : error});
                                    }
                                } else {
                                    response.send({
                                        company : {_id : company._id},
                                        user : {
                                            _id : newUser._id,
                                            name : newUser.name,
                                            username : newUser.username
                                        }
                                    });
                                    params.kamisama.trigger(request.param('token'), 'create user', {
                                        _id : newUser._id,
                                        name : newUser.name,
                                        username : newUser.username
                                    });
                                    // salva a empresa com novo usuário
                                    company.save();
                                }
                            })
                        }
                    });
                }
            })
        }
    });

    /**
     * Lista os usuários de uma empresa
     *
     * @author Rafael Erthal
     * @since  2012-07
     *
     * @request     {token}
     * @response    {users}
     */
    params.app.get('/company/users', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        // procura token
        params.model.User.findByToken(request.param('token', null), function(error, user) {
            if (error || !user) {
                response.send({error : { message : 'invalid token', name : 'InvalidTokenError', id : request.param('token', null), path : 'token'}});
            } else {
                params.model.User.find({company : user.company}, function (error, users) {
                    var result = [];
                    if (error) {
                        response.send({error : error});
                    } else {
                        for (var i in users) {
                            result.push({
                                _id : users[i]._id,
                                name : users[i].name
                            });
                        }
                        response.send({users : result, company : user.company});
                    }
                });
            }
        });
    });

    /**
     * Loga o usuário
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @request : {login, password, secret}
     * @response : {token}
     */
    params.app.post('/user/login', function (request, response) {
        var service = null;

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        for (var i in params.config.services) {
            if (params.config.services[i].secret === request.param('secret', '')) {
                service = params.config.services[i]
                service.slug = i;
            }
        }

        if (service === null || service.slug !== 'www') {
            response.send({error : { message : 'service unauthorized', name : 'InvalidServiceError', path : 'service'}});
        } else {
            params.model.User.findOne({username : request.param('username', null), password : params.model.User.encryptPassword(request.param('password', null))}, function (error, user) {
                if (error) {
                    response.send({error : { message : 'invalid username or password', name : 'InvalidLoginError'}});
                } else if (user === null) {
                    response.send({error : { message : 'invalid username or password', name : 'InvalidLoginError'}});
                } else {
                    user.login('www', function (error, token) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            response.send({
                                user : {_id : token.user},
                                company : {_id : token.company},
                                token : token
                            });
                        }
                    });
                }
            });
        }
    });

    /**
     * Desloga do sistema
     *
     * @author Rafael Erthal
     * @since  2012-07
     *
     * @request : {token, secret}
     * @response : null
     */
    params.app.post('/user/logout', function (request, response) {
        var service = null;

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        for (var i in params.config.services) {
            if (params.config.services[i].secret === request.param('secret', '')) {
                service = params.config.services[i]
                service.slug = i;
            }
        }

        if (service === null || service.slug !== 'www') {
            response.send({error : { message : 'service unauthorized', name : 'InvalidServiceError', path : 'service'}});
        } else {
            params.model.User.findByToken(request.param('token', null), function(error, user) {
                if (error || !user) {
                    response.send({error : { message : 'invalid token', name : 'InvalidTokenError', id : request.param('token', null), path : 'token'}});
                } else {
                    user.removeToken(request.param('token', null),function(error) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            response.send(null);
                        }
                    })
                }
            });
        }
    });

    /**
     * Envia email para mudar senha
     *
     * @author Rafael Erthal
     * @since  2013-03
     *
     * @request  {login}
     * @response {}
     */
    params.app.post('/user/forgot-password', function (request, response) {
        var service = null;

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        for (var i in params.config.services) {
            if (params.config.services[i].secret === request.param('secret', '')) {
                service = params.config.services[i]
                service.slug = i;
            }
        }

        if (service === null || service.slug !== 'www') {
            response.send({error : { message : 'service unauthorized', name : 'InvalidServiceError', path : 'service'}});
        } else {
            params.model.User.findOne({username : request.param('username', null)}, function (error, user) {
                if (error || user === null) {
                    response.send({error : { message : 'user not found', name : 'NotFoundError'}});
                } else {
                    user.login('www', function (error, token) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            require('needle').post(
                                'http://' + params.config.services.jaiminho.url + ':' + params.config.services.jaiminho.port + '/mail/self',
                                {
                                    token      : token,
                                    subject    : 'Recuperação de senha',
                                    html       : '<p>Olá '+user.name+'</p><p>Foi solicitada a recuperação de senha da sua conta no Empreendekit. Caso você não tenha feito a solicitação, favor desconsidere este email.</p><p>Para criar uma nova senha no empreendekit <a href="http://www.empreendekit.com.br/?token=' + token + '#!/ee/usuarios">clique aqui</a>.</p><br /><br />',
                                    name : 'recuperar senha',
                                    service    : 'auth'
                                },
                                function (error, response, data) {
                                    response.send(null);
                                }
                            );
                        }
                    });
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
     * @request : {token, secret, password}
     * @response : null
     */
    params.app.post('/user/:id/change-password', function (request, response) {
        var service = null, found;

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        for (var i in params.config.services) {
            if (params.config.services[i].secret === request.param('secret', '')) {
                service = params.config.services[i]
                service.slug = i;
            }
        }

        if (service === null || service.slug !== 'www') {
            response.send({error : { message : 'service unauthorized', name : 'InvalidServiceError', path : 'service'}});
        } else {
            params.model.User.findByToken(request.param('token', null), function(error, user) {
                if (error || !user) {
                    response.send({error : { message : 'invalid token', name : 'InvalidTokenError', id : request.param('token', null), path : 'token'}});
                } else {
                    params.model.User.findOne({_id : request.params.id, company : user.company}, function (error, user) {
                        if (error || !user) {
                            response.send({error : { message : 'user not found', name : 'NotFoundError', id : request.params.id, path : 'user'}});
                        } else {
                            user.password = params.model.User.encryptPassword(request.param('password', null));
                            user.save(function (error) {
                                if (error) {
                                    response.send({error : error});
                                } else {
                                    response.send(null);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};