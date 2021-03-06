/** Tests Contacts.Field
 *
 * @autor : Rafael Almeida Erthal Hermano
 * @since : 2013-01
 *
 * @description : Kit de testes do controller field do serviço contacts
 */

var should = require("should"),
    api = require("./utils.js").api,
    rand = require("./utils.js").rand,
    auth = require("./utils.js").auth;

describe('POST /field', function () {
    var token;

    before(function (done) {
        auth('contacts', function (newToken) {
            token = newToken;
            api.post('contacts', '/company', {token : token}, function (error, data, response) {
                done();
            });
        });
    });

    it('url tem que existir', function (done) {
        api.post('contacts', '/field', {}, function (error, data, response) {
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
        api.post('contacts', '/field', {
            name : 'Nome ' + rand(),
            token : 'invalido'
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('name em branco', function (done) {
        api.post('contacts', '/field', {
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

    it('cadastra campo', function (done) {
        api.post('contacts', '/field', {
            name : 'Nome ' + rand(),
            token : token
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('field');
                done();
            }
        });
    });
})

describe('GET /field/[field]', function () {
    var token,
        field;

    before(function (done) {
        auth('contacts', function (newToken) {
            token = newToken;
            api.post('contacts', '/company', {token : token}, function (error, data, response) {
                api.post('contacts', '/field', {token : token, name : 'name'}, function (error, data, response) {
                    field = data.field;
                    done();
                });
            });
        });
    });

    it('url tem que existir', function (done) {
        api.get('contacts', '/field/qualquer', {}, function (error, data, response) {
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
        api.get('contacts', '/field/' + field._id, {token : 'invalido'}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('campo inexistente', function (done) {
        api.get('contacts', '/field/inexistente' , {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('exibe campo', function (done) {
        api.get('contacts', '/field/' + field._id, {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('field');
                done();
            }
        });
    });

});

describe('POST /field/[field]/update', function () {
    var token,
        field;

    before(function (done) {
        auth('contacts', function (newToken) {
            token = newToken;
            api.post('contacts', '/company', {token : token}, function (error, data, response) {
                api.post('contacts', '/field', {token : token, name : 'name'}, function (error, data, response) {
                    field = data.field;
                    done();
                });
            });
        });
    });

    it('url tem que existir', function (done) {
        api.post('contacts', '/field/qualquer/update', {}, function (error, data, response) {
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
        api.post('contacts', '/field/' + field._id + '/update', {
            name : 'Nome ' + rand(),
            token : 'invalido'
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('campo inexistente', function (done) {
        api.post('contacts', '/field/inexistente/update' , {
            name : 'Nome ' + rand(),
            token : token
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('edita campo', function (done) {
        api.post('contacts', '/field/' + field._id + '/update', {
            name : 'Nome ' + rand(),
            token : token
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('field');
                done();
            }
        });
    });

});

describe('GET /fields', function () {
    var token,
        handled = 0;

    before(function (done) {
        auth('contacts', function (newToken) {
            token = newToken;
            api.post('contacts', '/company', {token : token}, function (error, data, response) {
                for (var i = 0; i < 20; i++) {
                    api.post('contacts', '/field', {name : 'Nome ' + rand(), token : token}, function (error, data, response) {
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
        api.get('contacts', '/fields', {}, function (error, data, response) {
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
        api.get('contacts', '/fields', {token : 'invalido'}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('lista campos', function (done) {
        api.get('contacts', '/fields', {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('fields');
                done();
            }
        });
    });

});