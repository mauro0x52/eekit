/** Account
 * @author : Rafael Erthal
 * @since : 2012-10
 *
 * @description : Módulo que implementa as funcionalidades account
 */

module.exports = function (app) {
    var Model = require('./../model/Model.js'),
        auth = require('../Utils.js').auth,
        User = Model.User;

    /** POST /account
     *
     * @autor : Rafael Erthal
     * @since : 2012-10
     *
     * @description : Cadastra uma conta
     *
     * @allowedApp : Qualquer APP
     * @allowedUser : Logado
     *
     * @request : {name, token}
     * @response : {account}
     */
    app.post('/account', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                User.findOne({user : user._id}, function (error, user) {
                    if (error) {
                        response.send({error : { message : 'user not found', name : 'NotFoundError', token : request.params.token, path : 'user'}});
                    } else {
                        if (user === null) {
                            response.send({error : { message : 'user not found', name : 'NotFoundError', token : request.params.token, path : 'user'}});
                        } else {
                            user.accounts.push({
                                name : request.param('name', null),
                                bank : request.param('bank', null),
                                account : request.param('account', null),
                                agency : request.param('agency', null),
                                initialBalance : request.param('initialBalance', null),
                                initialDate    : request.param('initialDate', null)
                            });
                            user.save(function (error) {
                                if (error) {
                                    response.send({error : error});
                                } else {
                                    response.send({account : user.accounts.pop()});
                                }
                            });
                        }
                    }
                });
            }
        });
    });

    /** GET /accounts
     *
     * @autor : Rafael Erthal
     * @since : 2012-10
     *
     * @description : Lista contas
     *
     * @allowedApp : Qualquer APP
     * @allowedUser : Logado
     *
     * @request : {token}
     * @response : {accounts}
     */
    app.get('/accounts', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                User.findOne({user : user._id}, function (error, user) {
                    if (error) {
                        response.send({error : { message : 'user not found', name : 'NotFoundError', token : request.params.token, path : 'user'}});
                    } else {
                        if (user === null) {
                            response.send({error : { message : 'user not found', name : 'NotFoundError', token : request.params.token, path : 'user'}});
                        } else {
                            response.send({accounts : user.accounts});
                        }
                    }
                });
            }
        });
    });

    /** GET /account/:id
     *
     * @autor : Rafael Erthal
     * @since : 2012-10
     *
     * @description : Exibe uma conta
     *
     * @allowedApp : Qualquer APP
     * @allowedUser : Logado
     *
     * @request : {token}
     * @response : {account}
     */
    app.get('/account/:id', function (request,response) {
        var account;

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                User.findOne({user : user._id}, function (error, user) {
                    if (error) {
                        response.send({error : { message : 'user not found', name : 'NotFoundError', token : request.params.token, path : 'user'}});
                    } else {
                        if (user === null) {
                            response.send({error : { message : 'user not found', name : 'NotFoundError', token : request.params.token, path : 'user'}});
                        } else {
                            user.findAccount(request.params.id, function (error, account) {
                                if (error) {
                                    response.send({error : { message : 'account not found', name : 'NotFoundError', token : request.params.id, path : 'account'}});
                                } else {
                                    if (account === null) {
                                        response.send({error : { message : 'account not found', name : 'NotFoundError', token : request.params.id, path : 'account'}});
                                    } else {
                                        response.send({account : account});
                                    }
                                }
                            });
                        }
                    }
                });
            }
        });
    });

    /** POST /account/:id/delete
     *
     * @autor : Rafael Erthal
     * @since : 2012-10
     *
     * @description : Excluir uma conta
     *
     * @allowedApp : Qualquer APP
     * @allowedUser : Logado
     *
     * @request : {token}
     * @response : {}
     */
    app.post('/account/:id/delete', function (request,response) {
        var account;

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                User.findOne({user : user._id}, function (error, user) {
                    if (error) {
                        response.send({error : { message : 'user not found', name : 'NotFoundError', token : request.params.token, path : 'user'}});
                    } else {
                        if (user === null) {
                            response.send({error : { message : 'user not found', name : 'NotFoundError', token : request.params.token, path : 'user'}});
                        } else {
                            user.findAccount(request.params.id, function (error, account) {
                                if (error) {
                                    response.send({error : { message : 'account not found', name : 'NotFoundError', token : request.params.id, path : 'account'}});
                                } else {
                                    if (account === null) {
                                        response.send({error : { message : 'account not found', name : 'NotFoundError', token : request.params.id, path : 'account'}});
                                    } else {
                                        account.remove();
                                        user.save(function (error) {
                                            if (error) {
                                                response.send({error : error});
                                            } else {
                                                response.send(null);
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        });
    });

    /** POST /account/:id/update
     *
     * @autor : Rafael Erthal
     * @since : 2012-10
     *
     * @description : Editar uma conta
     *
     * @allowedApp : Qualquer APP
     * @allowedUser : Logado
     *
     * @request : {name, token}
     * @response : {account}
     */
    app.post('/account/:id/update', function (request,response) {
        var account;

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                User.findOne({user : user._id}, function (error, user) {
                    if (error) {
                        response.send({error : { message : 'user not found', name : 'NotFoundError', token : request.params.token, path : 'user'}});
                    } else {
                        if (user === null) {
                            response.send({error : { message : 'user not found', name : 'NotFoundError', token : request.params.token, path : 'user'}});
                        } else {
                            user.findAccount(request.params.id, function (error, account) {
                                if (error) {
                                    response.send({error : { message : 'account not found', name : 'NotFoundError', token : request.params.id, path : 'account'}});
                                } else {
                                    if (account === null) {
                                        response.send({error : { message : 'account not found', name : 'NotFoundError', token : request.params.id, path : 'account'}});
                                    } else {
                                        account.name = request.param('name', account.name);
                                        account.bank = request.param('bank', account.bank);
                                        account.account = request.param('account', account.account);
                                        account.agency = request.param('agency', account.agency);
                                        account.initialBalance = request.param('initialBalance', account.initialBalance);
                                        account.initialDate = request.param('initialDate', account.initialDate);
                                        user.save(function (error) {
                                            if (error) {
                                                response.send({error : error});
                                            } else {
                                                response.send({account : account});
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        });
    });

}