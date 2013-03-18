/** Transaction
 * @author : Rafael Erthal
 * @since : 2012-10
 *
 * @description : Módulo que implementa as funcionalidades transaction
 */

module.exports = function (app) {
    var Model = require('./../model/Model.js'),
        config = require('./../config.js'),
        auth = require('../Utils.js').auth,
        User = Model.User,
        Transaction = Model.Transaction;

    /** POST /transaction
     *
     * @autor : Rafael Erthal
     * @since : 2012-10
     *
     * @description : Cadastra uma transação
     *
     * @request : {category, account, name, subtitle, value, date, recurrence, embeddeds, noteNumber, situation, type, isTransfer, token}
     * @response : {transaction}
     */
    app.post('/transaction', function (request,response) {
        var transaction,
            i, category;

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
                            transaction = new Transaction({
                                user        : user._id,
                                category    : request.param('category', null),
                                account     : request.param('account', null),
                                name        : request.param('name', null),
                                subtitle    : request.param('subtitle', null),
                                value       : request.param('value', null),
                                date        : request.param('date', null),
                                recurrence  : request.param('recurrence', null),
                                embeddeds   : request.param('embeddeds', null),
                                noteNumber  : request.param('noteNumber', null),
                                situation   : request.param('situation', null),
                                type        : request.param('type', null),
                                isTransfer  : request.param('isTransfer', null)
                            });
                            transaction.save(function (error) {
                                if (error) {
                                    response.send({error : error});
                                } else {
                                    for (var i = 0; i < transaction.embeddeds.length; i++) {
                                        bind(request.param('token', null), 'update embed ' + transaction.embeddeds[i], 'POST', 'http://' + config.host.url + ':' + config.host.port + '/transaction/' + transaction._id + '/update');
                                        bind(request.param('token', null), 'delete embed ' + transaction.embeddeds[i], 'POST', 'http://' + config.host.url + ':' + config.host.port + '/transaction/' + transaction._id + '/delete');
                                    }
                                    if (request.param('reminder', null)) {
                                        response.send({transaction : transaction});
                                    } else {
                                        response.send({transaction : transaction});
                                    }

                                }
                            });
                        }
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
    app.get('/transactions', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                User.findOne({user : user._id}, function (error, user) {
                    var query = {}
                    if (error) {
                        response.send({error : { message : 'user not found', name : 'NotFoundError', token : request.params.token, path : 'user'}});
                    } else {
                        if (user === null) {
                            response.send({error : { message : 'user not found', name : 'NotFoundError', token : request.params.token, path : 'user'}});
                        } else {
                            query.user = user._id;
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
                                query.embeddeds = {$in : request.param('filterByEmbeddeds')};
                            }
                            Transaction.find(query, function (error, transactions) {
                                if (error) {
                                    response.send({error : error});
                                } else {
                                    response.send({transactions : transactions});
                                }
                            });
                        }
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
    app.get('/transaction/:id', function (request,response) {
        var transaction;

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
                            Transaction.findOne({user : user._id, _id : request.params.id}, function (error, transaction) {
                                if (error) {
                                    response.send({error : { message : 'transaction not found', name : 'NotFoundError', id : request.params.id, path : 'transaction'}});
                                } else {
                                    if (transaction === null) {
                                        response.send({error : { message : 'transaction not found', name : 'NotFoundError', id : request.params.id, path : 'transaction'}});
                                    } else {
                                        response.send({transaction : transaction});
                                    }
                                }
                            });
                        }
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
    app.post('/transaction/:id/delete', function (request,response) {
        var transaction;

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
                            Transaction.findOne({user : user._id, _id : request.params.id}, function (error, transaction) {
                                var task,
                                    url;
                                if (error) {
                                    response.send({error : { message : 'transaction not found', name : 'NotFoundError', id : request.params.id, path : 'transaction'}});
                                } else {
                                    if (transaction === null) {
                                        response.send({error : { message : 'transaction not found', name : 'NotFoundError', id : request.params.id, path : 'transaction'}});
                                    } else {
                                        task = transaction.task;
                                        transaction.remove(function (error) {
                                            if (error) {
                                                response.send({error : error});
                                            } else {
                                                if (task) {
                                                    /* @TODO: COLOCAR BARREAMENTO*/
                                                    response.send(null);
                                                } else {
                                                    response.send(null);
                                                }
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

    /** POST /transaction/:id/update
     *
     * @autor : Rafael Erthal
     * @since : 2012-10
     *
     * @description : Editar uma transação
     *
     * @request : {category, account, name, subtitle, value, date, recurrence, embeddeds, noteNumber, situation, token}
     * @response : {transaction}
     */
    app.post('/transaction/:id/update', function (request,response) {
        var transaction;

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
                            Transaction.findOne({user : user._id, _id : request.params.id}, function (error, transaction) {
                                var url;
                                if (error) {
                                    response.send({error : { message : 'transaction not found', name : 'NotFoundError', id : request.params.id, path : 'transaction'}});
                                } else {
                                    if (transaction === null) {
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
                                        transaction.noteNumber  = request.param('noteNumber', transaction.noteNumber);
                                        transaction.situation   = request.param('situation', transaction.situation);
                                        transaction.save(function (error) {
                                            if (error) {
                                                response.send({error : error});
                                            } else {
                                                if (transaction.task) {
                                                    /* @TODO: COLOCAR BARREAMENTO*/
                                                    response.send({transaction : transaction});
                                                } else {
                                                    response.send({transaction : transaction});
                                                }
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