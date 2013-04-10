/** Tests Contacts.Contact
 *
 * @autor : Rafael Almeida Erthal Hermano
 * @since : 2012-09
 *
 * @description : Kit de testes do controller contact do serviço contacts
 */

var should = require("should"),
    api = require("./utils.js").api,
    rand = require("./utils.js").rand,
    auth = require("./utils.js").auth;

describe('POST /contact', function () {
    var token,
        category;

    before(function (done) {
        auth('contacts', function (newToken) {
            token = newToken;
            api.post('contacts', '/company', {token : token}, function (error, data, response) {
                category = data.categories[0];
                done();
            });
        });
    });

    it('url tem que existir', function (done) {
        api.post('contacts', '/contact', {}, function (error, data, response) {
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
        api.post('contacts', '/contact', {
            category : category._id,
            name : 'Nome ' + rand(),
            email : 'Email ' + rand(),
            phone : 'Telefone ' + rand(),
            notes : 'Notas ' + rand(),
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
        api.post('contacts', '/contact', {
            category : category._id,
            email : 'Email ' + rand(),
            phone : 'Telefone ' + rand(),
            notes : 'Notas ' + rand(),
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

    it('cadastra contact', function (done) {
        api.post('contacts', '/contact', {
            category : category._id,
            name : 'Nome ' + rand(),
            email : 'Email ' + rand(),
            phone : 'Telefone ' + rand(),
            notes : 'Notas ' + rand(),
            token : token
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('contact');
                done();
            }
        });
    });
})

describe('GET /contact/[contact]', function () {
    var token,
        contact;

    before(function (done) {
        auth('contacts', function (newToken) {
            token = newToken;
            api.post('contacts', '/company', {token : token}, function (error, data, response) {
                api.post('contacts', '/contact', {
                    category : data.categories[0]._id,
                    name : 'Nome ' + rand(),
                    email : 'Email ' + rand(),
                    phone : 'Telefone ' + rand(),
                    notes : 'Notas ' + rand(),
                    token : token
                }, function (error, data, response) {
                    contact = data.contact;
                    done();
                });
            });
        });
    });

    it('url tem que existir', function (done) {
        api.get('contacts', '/contact/qualquer', {}, function (error, data, response) {
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
        api.get('contacts', '/contact/' + contact._id, {token : 'invalido'}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('contato inexistente', function (done) {
        api.get('contacts', '/contact/inexistente' , {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('exibe contato', function (done) {
        api.get('contacts', '/contact/' + contact._id, {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('contact');
                done();
            }
        });
    });

});

describe('POST /contact/[contact]/update', function () {
    var token,
        contact;

    before(function (done) {
        auth('contacts', function (newToken) {
            token = newToken;
            api.post('contacts', '/company', {token : token}, function (error, data, response) {
                api.post('contacts', '/contact', {
                    category : data.categories[0]._id,
                    name : 'Nome ' + rand(),
                    email : 'Email ' + rand(),
                    phone : 'Telefone ' + rand(),
                    notes : 'Notas ' + rand(),
                    token : token
                }, function (error, data, response) {
                    contact = data.contact;
                    done();
                });
            });
        });
    });

    it('url tem que existir', function (done) {
        api.post('contacts', '/contact/qualquer/update', {}, function (error, data, response) {
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
        api.post('contacts', '/contact/' + contact._id + '/update', {
            name : 'Nome ' + rand(),
            email : 'Email ' + rand(),
            phone : 'Telefone ' + rand(),
            notes : 'Notas ' + rand(),
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

    it('contato inexistente', function (done) {
        api.post('contacts', '/contact/inexistente/update' , {
            name : 'Nome ' + rand(),
            email : 'Email ' + rand(),
            phone : 'Telefone ' + rand(),
            notes : 'Notas ' + rand(),
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

    it('edita contato', function (done) {
        api.post('contacts', '/contact/' + contact._id + '/update', {
            name : 'Nome ' + rand(),
            email : 'Email ' + rand(),
            phone : 'Telefone ' + rand(),
            notes : 'Notas ' + rand(),
            token : token
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('contact');
                done();
            }
        });
    });

});


describe('GET /contacts', function () {
    var token,
        handled = 0;

    before(function (done) {
        auth('contacts', function (newToken) {
            token = newToken;
            api.post('contacts', '/company', {token : token}, function (error, data, response) {
                for (var i = 0; i < 20; i++) {
                    api.post('contacts', '/contact', {
                        category : data.categories[0],
                        name : 'Nome ' + rand(),
                        email : 'Email ' + rand(),
                        phone : 'Telefone ' + rand(),
                        notes : 'Notas ' + rand(),
                        token : token
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
        api.get('contacts', '/contacts', {}, function (error, data, response) {
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
        api.get('contacts', '/contacts', {token : 'invalido'}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('lista contatos', function (done) {
        api.get('contacts', '/contacts', {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('contacts');
                done();
            }
        });
    });

});