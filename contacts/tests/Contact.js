/** Tests Contacts.Contact
 *
 * @autor : Rafael Almeida Erthal Hermano
 * @since : 2012-09
 *
 * @description : Kit de testes do controller contact do serviço contacts
 */

var should = require("should"),
    api = require("./utils.js").api,
    db = require("./utils.js").db,
    rand = require("./utils.js").rand;

describe('POST /contact', function () {
    var token,
        category;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function (error, data) {
            token = data.user.token;
            api.post('contacts', '/user', {token : token}, function (error, data, response) {
                api.get('contacts', '/categories', {token : token}, function (error, data, response) {
                    category = data.categories[0];
                    done();
                });
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

    it('estágio de negociação em branco', function (done) {
        api.post('contacts', '/contact', {
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

    it('estágio de negociação inválido', function (done) {
        api.post('contacts', '/contact', {
            category : 'invalido',
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
        category,
        contact;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function (error, data) {
            token = data.user.token;
            api.post('contacts', '/user', {token : token}, function (error, data, response) {
                api.get('contacts', '/categories', {token : token}, function (error, data, response) {
                    category = data.categories[0];
                    api.post('contacts', '/contact', {
                        category : category._id,
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

    it('cliente inexistente', function (done) {
        api.get('contacts', '/contact/inexistente' , {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('exibe cliente', function (done) {
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
        category,
        contact;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function (error, data) {
            token = data.user.token;
            api.post('contacts', '/user', {token : token}, function (error, data, response) {
                api.get('contacts', '/categories', {token : token}, function (error, data, response) {
                    category = data.categories[0];
                    api.post('contacts', '/contact', {
                        category : category._id,
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

    it('cliente inexistente', function (done) {
        api.post('contacts', '/contact/inexistente/update' , {
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
                data.should.have.property('error').property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('edita cliente category inválido', function (done) {
        api.post('contacts', '/contact/' + contact._id + '/update', {
            category : 'invalido',
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

    it('edita cliente nome em branco', function (done) {
        api.post('contacts', '/contact/' + contact._id + '/update', {
            category : category._id,
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

    it('edita cliente', function (done) {
        api.post('contacts', '/contact/' + contact._id + '/update', {
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

});


describe('GET /contacts sem filtro', function () {
    var token,
        category,
        handled = 0;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function (error, data) {
            token = data.user.token;
            api.post('contacts', '/user', {token : token}, function (error, data, response) {
                api.get('contacts', '/categories', {token : token}, function (error, data, response) {
                    category = data.categories[0];
                    for (var i = 0; i < 20; i++) {
                        api.post('contacts', '/contact', {
                            category : category._id,
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

    it('lista clientes', function (done) {
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

describe('GET /tasks filter by category', function () {
    var token,
        category,
        categories = [],
        handled = 0;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function (error, data) {
            token = data.user.token;
            api.post('contacts', '/user', {token : token}, function (error, data, response) {
                api.get('contacts', '/categories', {token : token}, function (error, data, response) {
                    category = data.categories[0];
                    for (var i in data.categories) {
                        categories.push(data.categories[i]._id);
                    }
                    for (var i = 0; i < 20; i++) {
                        api.post('contacts', '/contact', {
                            category : category._id,
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
    });

    it('url tem que existir', function (done) {
        api.get('contacts', '/contacts', {filterByCategory : categories}, function (error, data, response) {
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
        api.get('contacts', '/contacts', {token : 'invalido', filterByCategory : categories}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('lista clientes todas as etapas', function (done) {
        api.get('contacts', '/contacts', {token : token, filterByCategory : categories}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('contacts');
                done();
            }
        });
    });

    it('lista clientes apenas uma etapa com resultados', function (done) {
        api.get('contacts', '/contacts', {token : token, filterByCategory : categories[0]}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('contacts');
                for (var i in data.tasks) {
                    data.tasks[i].should.have.property('contacts').equal(categories[0]);
                }
                done();
            }
        });
    });

});