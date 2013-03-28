/** Tests Finances.Account
 *
 * @autor : Rafael Almeida Erthal Hermano
 * @since : 2012-10
 *
 * @description : Kit de testes do controller account do serviço finances
 */

var should = require("should"),
    api = require("./utils.js").api,
    db = require("./utils.js").db,
    rand = require("./utils.js").rand;

describe('POST /account', function () {
    var token;

    before(function (done) {
        auth('finances', function (newToken) {
            token = newToken;
            api.post('finances', '/company', {token : token}, function (error, data, response) {
                done();
            });
        });
    });
    
    it('url tem que existir', function (done) {
        api.post('finances', '/account', {}, function (error, data, response) {
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
        api.post('finances', '/account', {
            token : 'invalido',
            name : 'Nome ' + rand()
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
        api.post('finances', '/account', {
            token : token
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'ValidationError');
                done();
            }
        });
    });
    
    it('cadastra conta', function (done) {
        api.post('finances', '/account', {
            token : token,
            name : 'Nome ' + rand()
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('account')
                done();
            }
        });
    });
})

describe('GET /account/id', function () {
    var token,
        account;

    before(function (done) {
        auth('finances', function (newToken) {
            token = newToken;
            api.post('finances', '/company', {token : token}, function (error, data, response) {
                account = data.accounts[0];
                done();
            });
        });
    });
    
    it('url tem que existir', function (done) {
        api.get('finances', '/account/id', {}, function (error, data, response) {
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
        api.get('finances', '/account/' + account._id, {token : 'invalido'}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });
    
    it('conta inexistente', function (done) {
        api.get('finances', '/account/inexistnte', {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'NotFoundError');
                done();
            }
        });
    });
    
    it('pega conta', function (done) {
        api.get('finances', '/account/' + account._id, {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('account')
                done();
            }
        });
    });
    
});

describe('POST /account/id/delete', function () {
    var token,
        account;

    before(function (done) {
        auth('finances', function (newToken) {
            token = newToken;
            api.post('finances', '/company', {token : token}, function (error, data, response) {
                account = data.accounts[0];
                done();
            });
        });
    });
    
    it('url tem que existir', function (done) {
        api.post('finances', '/account/id/delete', {}, function (error, data, response) {
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
        api.post('finances', '/account/' + account._id + '/delete', {token : 'invalido'}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });
    
    it('conta inexistente', function (done) {
        api.post('finances', '/account/inexistente/delete', {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'NotFoundError');
                done();
            }
        });
    });
    
    it('exclui conta', function (done) {
        api.post('finances', '/account/' + account._id + '/delete', {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                api.get('finances', '/account/' + account._id, {token : token}, function (error, data, response) {
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

describe('POST /account/id/update', function () {
    var token,
        account;

    before(function (done) {
        auth('finances', function (newToken) {
            token = newToken;
            api.post('finances', '/company', {token : token}, function (error, data, response) {
                account = data.accounts[0];
                done();
            });
        });
    });
    
    it('url tem que existir', function (done) {
        api.post('finances', '/account/id/update', {}, function (error, data, response) {
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
        api.post('finances', '/account/' + account._id + '/update', {token : 'invalido'}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });
    
    it('conta inexistente', function (done) {
        api.post('finances', '/account/inexistente/update', {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'NotFoundError');
                done();
            }
        });
    });
    
    it('edita conta', function (done) {
        var newName = 'Nome' + rand()
        api.post('finances', '/account/' + account._id + '/update', {
            token : token,
            name  : newName
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                api.get('finances', '/account/' + account._id, {token : token}, function (error, data, response) {
                    if (error) {
                        return done(error);
                    } else {
                        data.should.have.property('account').property('name', newName);
                        done();
                    }
                });
            }
        });
    });
});

describe('GET /accounts', function () {
    var token,
        handled = 0;

    before(function (done) {
        auth('finances', function (newToken) {
            token = newToken;
            api.post('finances', '/company', {token : token}, function (error, data, response) {
                for (var i = 0; i < 20; i++) {
                    api.post('finances', '/account', {
                        token : token,
                        name : 'Nome ' + rand()
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

    it('url tem que existir', function (done) {
        api.get('finances', '/accounts', {token : token}, function (error, data, response) {
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
        api.get('finances', '/accounts', {token : 'invalido'}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('lista contas', function (done) {
        api.get('finances', '/accounts', {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('accounts');
                done();
            }
        });
    });

});