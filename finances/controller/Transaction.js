/** Transaction
 * @author : Rafael Erthal
 * @since : 2012-10
 *
 * @description : Módulo que implementa as funcionalidades transaction
 */

module.exports = function (params) {
    "use strict";

    /** POST /transaction
     *
     * @autor : Rafael Erthal
     * @since : 2012-10
     *
     * @description : Cadastra uma transação
     *
     * @request : {category, account, name, subtitle, value, date, recurrence, embeddeds, observation, situation, type, isTransfer, token}
     * @response : {transaction}
     */
    params.app.post('/transaction', function (request,response) {
        var transaction,
            i, category;

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
                        transaction = new params.model.Transaction({
                            company     : company._id,
                            author      : data.user._id,
                            category    : request.param('category', null),
                            account     : request.param('account', null),
                            name        : request.param('name', null),
                            subtitle    : request.param('subtitle', null),
                            value       : request.param('value', null),
                            date        : request.param('date', null),
                            recurrence  : request.param('recurrence', null),
                            embeddeds   : request.param('embeddeds', null),
                            observation : request.param('observation', null),
                            situation   : request.param('situation', null),
                            type        : request.param('type', null),
                            isTransfer  : request.param('isTransfer', null)
                        });
                        transaction.save(function (error) {
                            if (error) {
                                response.send({error : error});
                            } else {
                                response.send({transaction : transaction});
                            }
                        });
                    }
                });
            }
        });
    });

    /** GET /transactions
     *
     * @autor : Rafael Erthal
     * @since : 2012-10
     *
     * @description : Lista transações
     *
     * @request : {token, filterByCategories, filterByAccounts, filterByEmbeddeds}
     * @response : {transactions[]}
     */
    params.app.get('/transactions', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        params.auth(request.param('token', null), function (error, data) {
            if (error) {
                response.send({error : error});
            } else {
                params.model.Company.findOne({company : data.company._id}, function (error, company) {
                    var query = {}
                    if (error) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else if (company === null) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else {
                        query.company = company._id;
                        if (request.param('filterByCategories')) {
                            if (typeof request.param('filterByCategories') === 'string') {
                                query.category = request.param('filterByCategories');
                            } else {
                                query.category = {$in : request.param('filterByCategories')};
                            }
                        }
                        if (request.param('filterByAccounts')) {
                            if (typeof request.param('filterByAccounts') === 'string') {
                                query.account = request.param('filterByAccounts');
                            } else {
                                query.account = {$in : request.param('filterByAccounts')};
                            }
                        }
                        if (request.param('filterByEmbeddeds')) {
                            query.embeddeds = {$in : [request.param('filterByEmbeddeds')]};
                        }
                        params.model.Transaction.find(query).sort({date : 1}).exec(function (error, transactions) {
                            if (error) {
                                response.send({error : error});
                            } else {
                                response.send({transactions : transactions});
                            }
                        });
                    }
                });
            }
        });
    });

    /** GET /transaction/:id
     *
     * @autor : Rafael Erthal
     * @since : 2012-10
     *
     * @description : Exibe uma transação
     *
     * @request : {token}
     * @response : {transaction}
     */
    params.app.get('/transaction/:id', function (request,response) {
        var transaction;

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
                        params.model.Transaction.findOne({company : company._id, _id : request.params.id}, function (error, transaction) {
                            if (error) {
                                response.send({error : { message : 'transaction not found', name : 'NotFoundError', id : request.params.id, path : 'transaction'}});
                            } else if (transaction === null) {
                                response.send({error : { message : 'transaction not found', name : 'NotFoundError', id : request.params.id, path : 'transaction'}});
                            } else {
                                response.send({transaction : transaction});
                            }
                        });
                    }
                });
            }
        });
    });

    /** POST /transaction/:id/delete
     *
     * @autor : Rafael Erthal
     * @since : 2012-10
     *
     * @description : Excluir uma transação
     *
     * @request : {token}
     * @response : {}
     */
    params.app.post('/transaction/:id/delete', function (request,response) {
        var transaction;

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
                        params.model.Transaction.findOne({company : company._id, _id : request.params.id}, function (error, transaction) {
                            if (error) {
                                response.send({error : { message : 'transaction not found', name : 'NotFoundError', id : request.params.id, path : 'transaction'}});
                            } else if (transaction === null) {
                                response.send({error : { message : 'transaction not found', name : 'NotFoundError', id : request.params.id, path : 'transaction'}});
                            } else if (
                                request.param('source',null) === 'contacts' &&
                                new Date(transaction.date) < new Date()
                            ) {
                                transaction.subtitle = null;
                                transaction.save(function (error) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        response.send(null);
                                    }
                                });
                            } else {
                                transaction.remove(function (error) {
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
    });

    /** POST /transaction/:id/update
     *
     * @autor : Rafael Erthal
     * @since : 2012-10
     *
     * @description : Editar uma transação
     *
     * @request : {category, account, name, subtitle, value, date, recurrence, embeddeds, observation, situation, token}
     * @response : {transaction}
     */
    params.app.post('/transaction/:id/update', function (request,response) {
        var transaction;

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
                        params.model.Transaction.findOne({company : company._id, _id : request.params.id}, function (error, transaction) {
                            var url;
                            if (error) {
                                response.send({error : { message : 'transaction not found', name : 'NotFoundError', id : request.params.id, path : 'transaction'}});
                            } else if (transaction === null) {
                                response.send({error : { message : 'transaction not found', name : 'NotFoundError', id : request.params.id, path : 'transaction'}});
                            } else {
                                transaction.category    = request.param('category', transaction.category);
                                transaction.account     = request.param('account', transaction.account);
                                transaction.name        = request.param('name', transaction.name);
                                transaction.subtitle    = request.param('subtitle', transaction.subtitle);
                                transaction.value       = request.param('value', transaction.value);
                                transaction.date        = request.param('date', transaction.date);
                                transaction.recurrence  = request.param('recurrence', transaction.recurrence);
                                transaction.embeddeds   = request.param('embeddeds', transaction.embeddeds);
                                transaction.observation = request.param('observation', transaction.observation);
                                transaction.situation   = request.param('situation', transaction.situation);
                                transaction.save(function (error) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        response.send({transaction : transaction});
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