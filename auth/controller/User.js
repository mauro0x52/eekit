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

    /**
     * Lista todos os usuários do banco
     *
     * @author Rafael Erthal
     * @since  2012-07
     *
     * @request     {secret}
     * @response    {users[]}
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
                User.find({}, '_id name username company info', function (error, users) {
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
     * Cadastra novo usuário na empresa
     *
     * @author Rafael Erthal
     * @since  2012-07
     *
     * @request     {name, username, password, secret}
     * @response    {user}
     */
    app.post('/user', function (request, response) {
        var newUser,
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
        } else if (service.slug !== 'www') {
            // valida se o serviço que esta cadastrando o usuário é o WWW
            response.send({error : { message : 'service unauthorized', name : 'InvalidServiceError', path : 'service'}});
        } else {
            // procura token
            User.findByToken(request.param('token', null), function(error, user) {
                if (error || !user) {
                    response.send({error : { message : 'invalid token', name : 'InvalidTokenError', id : request.param('token', null), path : 'token'}});
                } else {
                    // procura a empresa
                    Company.findById(user.company, function(error, company) {
                        if (error || !company) {
                            response.send({error : { message : 'invalid token', name : 'InvalidTokenError', id : request.param('token', null), path : 'token'}});
                        } else {
                            // cria novo usuário
                            newUser = new User({
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
     * Loga o usuário
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
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
            User.findOne({username : request.param('username', null), password : User.encryptPassword(request.param('password', null))}, function (error, user) {
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
            User.findByToken(request.param('token', null), function(error, user) {
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
                } else if (user === null) {
                    response.send({error : { message : 'invalid username or password', name : 'InvalidLoginError'}});
                } else {
                    user.login(function (error, token) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            require('restler').post('http://' + config.services.jaiminho.url + ':' + config.services.jaiminho.port + '/mail', {
                                data: {
                                    token      : token,
                                    subject    : 'Recuperação de senha',
                                    html       : 'Para criar uma nova senha no empreendekit, entre no link <a href="http://www.empreendekit.com.br/?token=' + token + '#!/ee/mudar-senha">http://www.empreendekit.com.br/?token=' + token + '#!/ee/mudar-senha</a>',
                                    categories : 'password recovery',
                                    service    : 'auth'
                                }
                            }).on('success', function(data) {response.send(null);}).on('error', function() {});
                            response.send(null);
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
            User.findByToken(request.param('token', null), function(error, user) {
                if (error || !user) {
                    response.send({error : { message : 'invalid token', name : 'InvalidTokenError', id : request.param('token', null), path : 'token'}});
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
            });
        }
    });
};