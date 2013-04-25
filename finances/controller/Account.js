/** Account
 * @author : Rafael Erthal
 * @since : 2012-10
 *
 * @description : Módulo que implementa as funcionalidades account
 */

module.exports = function (params) {
    "use strict";

    /** POST /account
     *
     * @autor : Rafael Erthal
     * @since : 2012-10
     *
     * @description : Cadastra uma conta
     *
     * @request : {name, bank, account, agency, initialBalance, token}
     * @response : {account}
     */
    params.app.post('/account', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        params.auth(request.param('token', null), function (error, data) {
            if (error) {
                response.send({error : error});
            } else {
                params.model.Company.findOne({company : data.company._id}, function (error, company) {
                    if (error) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else if (company === null) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else {
                        company.accounts.push({
                            name : request.param('name', null),
                            bank : request.param('bank', null),
                            account : request.param('account', null),
                            agency : request.param('agency', null),
                            initialBalance : request.param('initialBalance', null)
                        });
                        company.save(function (error) {
                            var account = company.accounts.pop();
                            if (error) {
                                response.send({error : error});
                            } else {
                                params.kamisama.trigger(request.param('token'), 'create account', account);
                                response.send({account : account});
                            }
                        });
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
     * @request : {token}
     * @response : {accounts[]}
     */
    params.app.get('/accounts', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        params.auth(request.param('token', null), function (error, data) {
            if (error) {
                response.send({error : error});
            } else {
                params.model.Company.findOne({company : data.company._id}, function (error, company) {
                    if (error) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else if (company === null) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else {
                        response.send({accounts : company.accounts});
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
     * @request : {token}
     * @response : {account}
     */
    params.app.get('/account/:id', function (request,response) {
        var account;

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        params.auth(request.param('token', null), function (error, data) {
            if (error) {
                response.send({error : error});
            } else {
                params.model.Company.findOne({company : data.company._id}, function (error, company) {
                    if (error) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else if (company === null) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else {
                        company.findAccount(request.params.id, function (error, account) {
                            if (error) {
                                response.send({error : { message : 'account not found', name : 'NotFoundError', token : request.params.id, path : 'account'}});
                            } else if (account === null) {
                                response.send({error : { message : 'account not found', name : 'NotFoundError', token : request.params.id, path : 'account'}});
                            } else {
                                response.send({account : account});
                            }
                        });
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
     * @request : {name, bank, account, agency, initialBalance, token}
     * @response : {account}
     */
    params.app.post('/account/:id/update', function (request,response) {
        var account;

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        params.auth(request.param('token', null), function (error, data) {
            if (error) {
                response.send({error : error});
            } else {
                params.model.Company.findOne({company : data.company._id}, function (error, company) {
                    if (error) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else if (company === null) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else {
                        company.findAccount(request.params.id, function (error, account) {
                            if (error) {
                                response.send({error : { message : 'account not found', name : 'NotFoundError', token : request.params.id, path : 'account'}});
                            } else if (account === null) {
                                response.send({error : { message : 'account not found', name : 'NotFoundError', token : request.params.id, path : 'account'}});
                            } else {
                                account.name = request.param('name', account.name);
                                account.bank = request.param('bank', account.bank);
                                account.account = request.param('account', account.account);
                                account.agency = request.param('agency', account.agency);
                                account.initialBalance = request.param('initialBalance', account.initialBalance);
                                company.save(function (error) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        params.kamisama.trigger(request.param('token'), 'update account ' + account._id, account);
                                        response.send({account : account});
                                    }
                                });
                            }
                        });
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
     * @request : {token}
     * @response : {}
     */
    params.app.post('/account/:id/delete', function (request,response) {
        var account;

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        params.auth(request.param('token', null), function (error, data) {
            if (error) {
                response.send({error : error});
            } else {
                params.model.Company.findOne({company : data.company._id}, function (error, company) {
                    if (error) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else if (company === null) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else {
                        company.findAccount(request.params.id, function (error, account) {
                            if (error) {
                                response.send({error : { message : 'account not found', name : 'NotFoundError', token : request.params.id, path : 'account'}});
                            } else if (account === null) {
                                response.send({error : { message : 'account not found', name : 'NotFoundError', token : request.params.id, path : 'account'}});
                            } else {
                                account.remove();
                                company.save(function (error) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                params.kamisama.trigger(request.param('token'), 'remove account ' + account._id, account);
                                        response.send(null);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    });
}