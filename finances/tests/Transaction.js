/** Tests Finances.Transaction
 *
 * @autor : Rafael Almeida Erthal Hermano
 * @since : 2012-10
 *
 * @description : Kit de testes do controller transaction do serviço finances
 */

var should = require("should"),
    api = require("./utils.js").api,
    db = require("./utils.js").db,
    rand = require("./utils.js").rand;

describe('POST /transaction', function () {
    var token,
        category,
        account;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function (error, data) {
            token = data.user.token;
            api.post('finances', '/user', {token : token}, function (error, data, response) {
                api.post('finances', '/category', {
                    token : token,
                    name : 'Nome ' + rand()
                }, function (error, data, response) {
                    category = data.category;
                    api.post('finances', '/account', {
                        token : token,
                        name : 'Nome ' + rand()
                    }, function (error, data, response) {
                        account = data.account;
                        done();
                    });
                });
            });
        });
    });

    it('url tem que existir', function (done) {
        api.post('finances', '/transaction', {}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });

    it('token inválido', function (done) {
        api.post('finances', '/transaction', {
            token : 'invalido',
            name : 'Nome ' + rand(),
            value : 1000,
            categoy : category._id,
            account : account._id,
            date : new Date()
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('nome em branco', function (done) {
        api.post('finances', '/transaction', {
            token : token,
            value : 1000,
            categoy : category._id,
            account : account._id,
            situation : 'payed',
            type : 'debt',
            date : new Date()
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'ValidationError');
                done();
            }
        });
    });

    it('valor em branco', function (done) {
        api.post('finances', '/transaction', {
            token : token,
            name : 'Nome ' + rand(),
            categoy : category._id,
            account : account._id,
            situation : 'payed',
            type : 'debt',
            date : new Date()
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'ValidationError');
                done();
            }
        });
    });

    it('cadastra transação', function (done) {
        api.post('finances', '/transaction', {
            token : token,
            name : 'Nome ' + rand(),
            value : 1000,
            categoy : category._id,
            account : account._id,
            situation : 'payed',
            type : 'debt',
            date : new Date()
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('transaction')
                done();
            }
        });
    });

    it('cadastra transferência', function (done) {
        api.post('finances', '/transaction', {
            token : token,
            name : 'Nome ' + rand(),
            value : 1000,
            categoy : category._id,
            account : account._id,
            situation : 'paid',
            type : 'debt',
            date : new Date(),
            isTransfer : true
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('transaction').property('isTransfer').equal(true);
                done();
            }
        });
    });
})

describe('GET /transaction/id', function () {
    var token,
        category,
        account,
        transaction;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function (error, data) {
            token = data.user.token;
            api.post('finances', '/user', {token : token}, function (error, data, response) {
                api.post('finances', '/category', {
                    token : token,
                    name : 'Nome ' + rand()
                }, function (error, data, response) {
                    category = data.category;
                    api.post('finances', '/account', {
                        token : token,
                        name : 'Nome ' + rand(),
                        value : 1000
                    }, function (error, data, response) {
                        account = data.account;
                        api.post('finances', '/transaction', {
                            token : token,
                            name : 'Nome ' + rand(),
                            value : 1000,
                            categoy : category._id,
                            account : account._id,
                            situation : 'payed',
                            type : 'debt',
                            date : new Date()
                        }, function (error, data, response) {
                            transaction = data.transaction;
                            done();
                        });
                    });
                });
            });
        });
    });

    it('url tem que existir', function (done) {
        api.get('finances', '/transaction/id', {}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });

    it('token inválido', function (done) {
        api.get('finances', '/transaction/' + transaction._id, {token : 'invalido'}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('transação inexistente', function (done) {
        api.get('finances', '/transaction/inexistnte', {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('pega transação', function (done) {
        api.get('finances', '/transaction/' + transaction._id, {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('transaction')
                done();
            }
        });
    });

});

describe('POST /transaction/id/delete', function () {
    var token,
        category,
        account,
        transaction;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function (error, data) {
            token = data.user.token;
            api.post('finances', '/user', {token : token}, function (error, data, response) {
                api.post('finances', '/category', {
                    token : token,
                    name : 'Nome ' + rand()
                }, function (error, data, response) {
                    category = data.category;
                    api.post('finances', '/account', {
                        token : token,
                        name : 'Nome ' + rand(),
                        value : 1000
                    }, function (error, data, response) {
                        account = data.account;
                        api.post('finances', '/transaction', {
                            token : token,
                            name : 'Nome ' + rand(),
                            value : 1000,
                            categoy : category._id,
                            account : account._id,
                            situation : 'payed',
                            type : 'debt',
                            date : new Date()
                        }, function (error, data, response) {
                            transaction = data.transaction;
                            done();
                        });
                    });
                });
            });
        });
    });

    it('url tem que existir', function (done) {
        api.post('finances', '/transaction/id/delete', {}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });

    it('token inválido', function (done) {
        api.post('finances', '/transaction/' + transaction._id + '/delete', {token : 'invalido'}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('transação inexistente', function (done) {
        api.post('finances', '/transaction/inexistente/delete', {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('exclui transação', function (done) {
        api.post('finances', '/transaction/' + transaction._id + '/delete', {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                api.get('finances', '/transaction/' + transaction._id, {token : token}, function (error, data, response) {
                    if (error) {
                        return done(error);
                    } else {
                        data.should.have.property('error').property('name', 'NotFoundError');
                        done();
                    }
                });
            }
        });
    });
});

describe('POST /transaction/id/update', function () {
    var token,
        category,
        account,
        transaction;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function (error, data) {
            token = data.user.token;
            api.post('finances', '/user', {token : token}, function (error, data, response) {
                api.post('finances', '/category', {
                    token : token,
                    name : 'Nome ' + rand()
                }, function (error, data, response) {
                    category = data.category;
                    api.post('finances', '/account', {
                        token : token,
                        name : 'Nome ' + rand(),
                        value : 1000
                    }, function (error, data, response) {
                        account = data.account;
                        api.post('finances', '/transaction', {
                            token : token,
                            name : 'Nome ' + rand(),
                            value : 1000,
                            categoy : category._id,
                            account : account._id,
                            situation : 'payed',
                            type : 'debt',
                            date : new Date()
                        }, function (error, data, response) {
                            transaction = data.transaction;
                            done();
                        });
                    });
                });
            });
        });
    });

    it('url tem que existir', function (done) {
        api.post('finances', '/transaction/id/update', {}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });

    it('token inválido', function (done) {
        api.post('finances', '/transaction/' + transaction._id + '/update', {token : 'invalido'}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('conta inexistente', function (done) {
        api.post('finances', '/transaction/inexistente/update', {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('nome em branco', function (done) {
        api.post('finances', '/transaction/' + transaction._id + '/update', {
            token : token
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                api.get('finances', '/transaction/' + transaction._id, {token : token}, function (error, data, response) {
                    if (error) {
                        return done(error);
                    } else {
                        data.should.have.property('transaction').property('name', transaction.name);
                        done();
                    }
                });
            }
        });
    });

    it('edita transação', function (done) {
        var newName = 'Nome' + rand()
        api.post('finances', '/transaction/' + transaction._id + '/update', {
            token : token,
            name  : newName
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                api.get('finances', '/transaction/' + transaction._id, {token : token}, function (error, data, response) {
                    if (error) {
                        return done(error);
                    } else {
                        data.should.have.property('transaction').property('name', newName);
                        done();
                    }
                });
            }
        });
    });
});

describe('POST /transaction/id/reconcile', function () {
    var token,
        category,
        account,
        transaction;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function (error, data) {
            token = data.user.token;
            api.post('finances', '/user', {token : token}, function (error, data, response) {
                api.post('finances', '/category', {
                    token : token,
                    name : 'Nome ' + rand()
                }, function (error, data, response) {
                    category = data.category;
                    api.post('finances', '/account', {
                        token : token,
                        name : 'Nome ' + rand(),
                        value : 1000
                    }, function (error, data, response) {
                        account = data.account;
                        api.post('finances', '/transaction', {
                            token : token,
                            name : 'Nome ' + rand(),
                            value : 1000,
                            categoy : category._id,
                            account : account._id,
                            situation : 'payed',
                            type : 'debt',
                            date : new Date()
                        }, function (error, data, response) {
                            transaction = data.transaction;
                            done();
                        });
                    });
                });
            });
        });
    });

    it('url tem que existir', function (done) {
        api.post('finances', '/transaction/id/reconcile', {}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });

    it('token inválido', function (done) {
        api.post('finances', '/transaction/' + transaction._id + '/reconcile', {token : 'invalido'}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('conta inexistente', function (done) {
        api.post('finances', '/transaction/inexistente/reconcile', {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('concilia transação', function (done) {
        var newName = 'Nome' + rand()
        api.post('finances', '/transaction/' + transaction._id + '/reconcile', {
            token : token
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                api.get('finances', '/transaction/' + transaction._id, {token : token}, function (error, data, response) {
                    if (error) {
                        return done(error);
                    } else {
                        data.should.have.property('transaction').property('situation', 'payed');
                        done();
                    }
                });
            }
        });
    });
});

describe('GET /transactions', function () {
    var token,
        category,
        account,
        handled = 0;;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function (error, data) {
            token = data.user.token;
            api.post('finances', '/user', {token : token}, function (error, data, response) {
                api.post('finances', '/category', {
                    token : token,
                    name : 'Nome ' + rand()
                }, function (error, data, response) {
                    category = data.category;
                    api.post('finances', '/account', {
                        token : token,
                        name : 'Nome ' + rand(),
                        value : 1000
                    }, function (error, data, response) {
                        account = data.account;
                        for (var i = 0; i < 20; i++) {
                            api.post('finances', '/transaction', {
                                token : token,
                                name : 'Nome ' + rand(),
                                value : 1000,
                                categoy : category._id,
                                account : account._id,
                                situation : 'payed',
                                type : 'debt',
                                date : new Date()
                            }, function (error, data, response) {
                                handled++;
                                if (handled === 20) {
                                    done();
                                }
                            });
                        }
                    });
                });
            });
        });
    });

    it('url tem que existir', function (done) {
        api.get('finances', '/transactions', {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });

    it('token inválido', function (done) {
        api.get('finances', '/transactions', {token : 'invalido'}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('lista transações', function (done) {
        api.get('finances', '/transactions', {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('transactions');
                done();
            }
        });
    });

});