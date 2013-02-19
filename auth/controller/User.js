/** User
 * @author : Rafael Almeida Erthal Hermano
 * @since : 2012-07
 *
 * @description : Módulo que implementa as funcionalidades de conta de usuário
 */

module.exports = function (app) {
    "use strict";

    var Model = require('./../model/Model.js'),
        User  = Model.User;

    /** GET /users
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Lista usuários do banco
     *
     * @allowedApp : Apenas o www
     * @allowedUser : Millor
     *
     * @response : {users}
     */
    app.get('/users', function (request, response) {
        response.contentType('txt');
        response.header('Access-Control-Allow-Origin', '*');

        User.find(function (error, users) {
            var i;

            if (error) {
                response.send({error : error});
            } else {
                response.write('"Id","Username"');
                response.write('\n');
                for (i in users) {
                    response.write('"' + users[i]._id + '","' + users[i].username + '"');
                    response.write('\n');
                }
                response.end();
            }
        });
    });

    /** POST /user
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Cadastra novo usuário
     *
     * @allowedApp : Apenas o www
     * @allowedUser : Público
     *
     * @request : {username, password, password_confirmation}
     * @response : {user : {_id, token}}
     */
    app.post('/user', function (request, response) {
        var user;

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        // valida se a senha e a confirmação senha conferem
        if (request.param('password', null) === request.param('password_confirmation', null)) {
            //pega os dados do post e coloca em um novo objeto
            user = new User({
                username : request.param('username', null),
                password : request.param('password', null),
                dateCreated : new Date(),
                status   : 'active'
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
                            response.send({user : {_id : user._id, token : tokenKey}});
                        }
                    });
                }
            });
        } else {
            response.send({error : {message : 'invalid password confirmation', name : 'ValidationError', errors : {password_confirmation : {message : 'invalid password confirmation', name : 'ValidatorError', path : 'password_confirmation', type : 'confirmation' }}}});
        }
    });

    /** POST /user/:login/deactivate
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : desativa conta do usuário
     *
     * @allowedApp : Aplicativo: Apenas o www
     * @allowedUser : Logado
     *
     * @request : {token}
     * @response : {user : {_id}}
     */
    app.post('/user/:login/deactivate', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        //localiza o usuário
        User.findByIdentity(request.params.login, function (error, user) {
            if (error) {
                response.send({error : { message : 'user not found', name : 'NotFoundError', id : request.params.login, path : 'user'}});
            } else {
                //verifica se o usuario foi encontrado
                if (user === null) {
                    response.send({error : {message :  'user not found', name : 'NotFoundError', id : request.params.login, path : 'user' }});
                } else {
                    //checa token
                    user.checkToken(request.param('token', null), function (valid) {
                        if (!valid) {
                            response.send({error : {message : 'invalid token', name : 'InvalidTokenError'}});
                        } else {
                            //desativa a conta do usuário
                            user.deactivate(function (error) {
                                if (error) {
                                    response.send({error : error});
                                } else {
                                    response.send({user : {_id : user._id}});
                                }
                            });
                        }
                    });
                }
            }
        });
    });

    /** POST /user/:login/activate
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : ativa conta do usuário
     *
     * @allowedApp: Apenas o www
     * @allowedUser : Logado
     *
     * @request : {token}
     * @response : {user : {_id}}
     */
    app.post('/user/:login/activate', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        //localiza o usuário
        User.findByIdentity(request.params.login, function (error, user) {
            if (error) {
                response.send({error : { message : 'user not found', name : 'NotFoundError', id : request.params.login, path : 'user'}});
            } else {
                //verifica se o usuario foi encontrado
                if (user === null) {
                    response.send({error : {message :  'user not found', name : 'NotFoundError', id : request.params.login, path : 'user' }});
                } else {
                    //checa token
                    user.checkToken(request.param('token', null), function (valid) {
                        if (!valid) {
                            response.send({error : {message : 'invalid token', name : 'InvalidTokenError'}});
                        } else {
                            //ativa a conta do usuário
                            user.activate(function (error) {
                                if (error) {
                                    response.send({error : error});
                                } else {
                                    response.send({user : {_id : user._id}});
                                }
                            });
                        }
                    });
                }
            }
        });
    });

    /** POST /user/:login/change-password
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : recupera senha do usuário
     *
     * @allowedApp : Apenas o www, redirecionamento por e-mail
     * @allowedUser : Público
     *
     * @request : {token, newpassword, newpasswordconfirmation}
     * @response : {user : {_id}}
     */
    app.post('/user/:login/change-password', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        // valida se a senha e a confirmação senha conferem
        if (request.param('newpassword', null) === request.param('newpasswordconfirmation', null)) {
            //localiza o usuário
            User.findByIdentity(request.params.login, function (error, user) {
                if (error) {
                    response.send({error : { message : 'user not found', name : 'NotFoundError', id : request.params.login, path : 'user'}});
                } else {
                    //verifica se o usuario foi encontrado
                    if (user === null) {
                        response.send({error : {message :  'user not found', name : 'NotFoundError', id : request.params.login, path : 'user' }});
                    } else {
                        //checa token
                        user.checkToken(request.param('token', null), function (valid) {
                            if (!valid) {
                                response.send({error : {message : 'invalid token', name : 'InvalidTokenError'}});
                            } else {
                                //altera a senha
                                user.changePassword(request.param('newpassword', null), function (error) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //reloga o usuário
                                        user.login(function (error) {
                                            if (error) {
                                                response.send({error : error});
                                            } else {
                                                response.send({user : {_id : user._id}});
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
            });
        } else {
            response.send({error : {message : 'invalid password confirmation', name : 'ValidationError', errors : {password_confirmation : {message : 'invalid password confirmation', name : 'ValidatorError', path : 'password_confirmation', type : 'confirmation' }}}});
        }
    });

    /** POST /user/:login/login
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : autentica o usuário
     *
     * @allowedApp : Apenas o www
     * @allowedUser : Público
     *
     * @request : {login, password}
     * @response : { token}
     */
    app.post('/user/:login/login', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');
        response.header('Access-Control-Allow-Methods', 'POST');

        //localiza o usuário
        User.findByIdentity(request.params.login, function (error, user) {
            if (error) {
                response.send({error : { message : 'user not found', name : 'NotFoundError', id : request.params.login, path : 'user'}});
            } else {
                //verifica se o usuario foi encontrado
                if (user === null) {
                    response.send({error : { message : 'invalid username or password', name : 'InvalidLoginError'}});
                } else {
                    //verifica a senha do usuário
                    if (user.password !== User.encryptPassword(request.param('password', null))) {
                        response.send({error : { message : 'invalid username or password', name : 'InvalidLoginError'}});
                    } else {
                        //loga o usuário
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
    });

    /** POST /user/:login/logout
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : desautentica o usuário
     *
     * @allowedApp : Apenas o www
     * @allowedUser : Logado
     *
     * @request : {token}
     * @response : null
     */
    app.post('/user/:login/logout', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        //localiza o usuário
        User.findByIdentity(request.params.login, function (error, user) {
            if (error) {
                response.send({error : { message : 'user not found', name : 'NotFoundError', id : request.params.login, path : 'user'}});
            } else {
                //verifica se o usuario foi encontrado
                if (user === null) {
                    response.send({error : {message :  'user not found', name : 'NotFoundError', id : request.params.login, path : 'user' }});
                } else {
                    //verifica o token do usuário
                    user.checkToken(request.param('token', null), function (valid) {
                        if (!valid) {
                            response.send({error : {message : 'invalid token', name : 'InvalidTokenError'}});
                        } else {
                            //desloga o usuário
                            user.logout(request.param('token', null), function (error) {
                                if (error) {
                                    response.send({error : error});
                                } else {
                                    response.send(null);
                                }
                            });
                        }
                    });
                }
            }
        });
    });

    /** GET /user/validate
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : valida token
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Logado
     *
     * @request : {token}
     * @response : {user : {_id}}
     */
    app.get('/user/validate', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        //localiza o usuário
        User.findByValidToken(request.param('token', ''), function (error, user) {
            if (error) {
                response.send({ error : { message : 'Invalid token', name : 'InvalidTokenError'}});
            } else {
                //verifica se o usuario foi encontrado
                if (user === null) {
                    response.send({ error : { message : 'Invalid token', name : 'InvalidTokenError'}});
                } else {
                    response.send({user : {_id : user._id}});
                }
            }
        });
    });
};
