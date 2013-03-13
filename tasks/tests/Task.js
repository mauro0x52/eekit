/** Tests Tasks.Task
 *
 * @autor : Rafael Almeida Erthal Hermano
 * @since : 2012-09
 *
 * @description : Kit de testes do controller task do serviço tasks
 */

var should = require("should"),
    api = require("./utils.js").api,
    db = require("./utils.js").db,
    rand = require("./utils.js").rand;

describe('POST /task', function () {
    var www_token,
        token,
        category;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando',
            secret : 'www'
        }, function (error, data) {
            www_token = data.token;
            api.post('auth', '/service/tasks/auth', {
                secret : 'www',
                token : www_token
            }, function (error, data) {
                token = data.token;
                api.post('tasks', '/user', {token : token}, function (error, data, response) {
                    category = data.categories[0];
                    done();
                });
            });
        });
    });

    it('url tem que existir', function (done) {
        api.post('tasks', '/task', {}, function (error, data, response) {
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
        api.post('tasks', '/task', {
            category : category._id,
            title : 'teste ' + rand(),
            description : rand(),
            important : true,
            dateDeadline : new Date(),
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

    it('categoria em branco', function (done) {
        api.post('tasks', '/task', {
            title : 'teste ' + rand(),
            description : rand(),
            important : true,
            dateDeadline : new Date(),
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

    it('categoria inválida', function (done) {
        api.post('tasks', '/task', {
            category : 'inválida',
            title : 'teste ' + rand(),
            description : rand(),
            important : true,
            dateDeadline : new Date(),
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

    it('title em branco', function (done) {
        api.post('tasks', '/task', {
            category : category._id,
            description : rand(),
            important : true,
            dateDeadline : new Date(),
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

    it('cadastra task', function (done) {
        api.post('tasks', '/task', {
            category : category._id,
            title : 'teste ' + rand(),
            description : rand(),
            important : true,
            dateDeadline : new Date(),
            token : token
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('task');
                done();
            }
        });
    });

    it('cadastra task com embedded', function (done) {
        api.post('tasks', '/task', {
            category : category._id,
            title : 'teste ' + rand(),
            description : rand(),
            important : true,
            dateDeadline : new Date(),
            token : token,
            embeddeds : ['/teste/testando']
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('task').property('embeddeds').include('/teste/testando');
                done();
            }
        });
    });

    it('cadastra task com embedded fora do array', function (done) {
        api.post('tasks', '/task', {
            category : category._id,
            title : 'teste ' + rand(),
            description : rand(),
            important : true,
            dateDeadline : new Date(),
            token : token,
            embeddeds : '/teste/testando'
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('task').property('embeddeds').include('/teste/testando');
                done();
            }
        });
    });

})

describe('GET /task/[task_id]', function () {
    var www_token,
        token,
        category,
        task;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando',
            secret : 'www'
        }, function (error, data) {
            www_token = data.token;
            api.post('auth', '/service/tasks/auth', {
                secret : 'www',
                token : www_token
            }, function (error, data) {
                token = data.token;
                api.post('tasks', '/user', {token : token}, function (error, data, response) {
                    category = data.categories[0];
                    api.get('tasks', '/categories', {token : token}, function (error, data, response) {
                        api.post('tasks', '/task', {
                            category : category._id,
                            title : 'teste ' + rand(),
                            description : rand(),
                            important : true,
                            dateDeadline : new Date(),
                            token : token
                        }, function (error, data, response) {
                            task = data.task;
                            done();
                        });
                    });
                });
            });
        });
    });

    it('url tem que existir', function (done) {
        api.get('tasks', '/task/qualquer', {}, function (error, data, response) {
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
        api.get('tasks', '/task/' + task._id, {token : 'invalido'}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('task inexistente', function (done) {
        api.get('tasks', '/task/inexistente' , {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('exibe task', function (done) {
        api.get('tasks', '/task/' + task._id, {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('task');
                done();
            }
        });
    });

});

describe('POST /task/[task_id]/delete', function () {
    var www_token,
        token,
        category,
        task;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando',
            secret : 'www'
        }, function (error, data) {
            www_token = data.token;
            api.post('auth', '/service/tasks/auth', {
                secret : 'www',
                token : www_token
            }, function (error, data) {
                token = data.token;
                api.post('tasks', '/user', {token : token}, function (error, data, response) {
                    category = data.categories[0];
                    api.get('tasks', '/categories', {token : token}, function (error, data, response) {
                        api.post('tasks', '/task', {
                            category : category._id,
                            title : 'teste ' + rand(),
                            description : rand(),
                            important : true,
                            dateDeadline : new Date(),
                            token : token
                        }, function (error, data, response) {
                            task = data.task;
                            done();
                        });
                    });
                });
            });
        });
    });

    it('url tem que existir', function (done) {
        api.post('tasks', '/task/qualquer/delete', {}, function (error, data, response) {
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
        api.post('tasks', '/task/' + task._id + '/delete', {token : 'invalido'}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('task inexistente', function (done) {
        api.post('tasks', '/task/inexistente/delete' , {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('exclui task', function (done) {
        api.post('tasks', '/task/' + task._id + '/delete', {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data);
                api.get('tasks', '/task/' + task._id, {token : token}, function (error, data, response) {
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

describe('POST /task/[task_id]/done', function () {
    var www_token,
        token,
        category,
        task;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando',
            secret : 'www'
        }, function (error, data) {
            www_token = data.token;
            api.post('auth', '/service/tasks/auth', {
                secret : 'www',
                token : www_token
            }, function (error, data) {
                token = data.token;
                api.post('tasks', '/user', {token : token}, function (error, data, response) {
                    category = data.categories[0];
                    api.get('tasks', '/categories', {token : token}, function (error, data, response) {
                        api.post('tasks', '/task', {
                            category : category._id,
                            title : 'teste ' + rand(),
                            description : rand(),
                            important : true,
                            dateDeadline : new Date(),
                            token : token
                        }, function (error, data, response) {
                            task = data.task;
                            done();
                        });
                    });
                });
            });
        });
    });

    it('url tem que existir', function (done) {
        api.post('tasks', '/task/qualquer/done', {}, function (error, data, response) {
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
        api.post('tasks', '/task/' + task._id + '/done', {token : 'invalido'}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('task inexistente', function (done) {
        api.post('tasks', '/task/inexistente/done' , {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('marca task como feita', function (done) {
        api.post('tasks', '/task/' + task._id + '/done', {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('task').have.property('done', true);
                api.get('tasks', '/task/' + task._id, {token : token}, function (error, data, response) {
                    if (error) {
                        return done(error);
                    } else {
                        data.should.have.property('task').property('done', true);
                        done();
                    }
                });
            }
        });
    });

});

describe('GET /tasks sem filtro', function () {
    var www_token,
        token,
        category,
        handled = 0;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando',
            secret : 'www'
        }, function (error, data) {
            www_token = data.token;
            api.post('auth', '/service/tasks/auth', {
                secret : 'www',
                token : www_token
            }, function (error, data) {
                token = data.token;
                api.post('tasks', '/user', {token : token}, function (error, data, response) {
                    category = data.categories[0];
                    api.get('tasks', '/categories', {token : token}, function (error, data, response) {
                        for (var i = 0; i < 20; i++) {
                            api.post('tasks', '/task', {
                                category : category._id,
                                title : 'teste ' + rand(),
                                description : rand(),
                                important : true,
                                dateDeadline : new Date(),
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
    });

    it('url tem que existir', function (done) {
        api.get('tasks', '/tasks', {}, function (error, data, response) {
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
        api.get('tasks', '/tasks', {token : 'invalido'}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('lista task', function (done) {
        api.get('tasks', '/tasks', {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('tasks');
                done();
            }
        });
    });

});

describe('GET /tasks filter by done', function () {
    var www_token,
        token,
        category,
        handled = 0;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando',
            secret : 'www'
        }, function (error, data) {
            www_token = data.token;
            api.post('auth', '/service/tasks/auth', {
                secret : 'www',
                token : www_token
            }, function (error, data) {
                token = data.token;
                api.post('tasks', '/user', {token : token}, function (error, data, response) {
                    category = data.categories[0];
                    api.get('tasks', '/categories', {token : token}, function (error, data, response) {
                        for (var i = 0; i < 20; i++) {
                            api.post('tasks', '/task', {
                                category : category._id,
                                title : 'teste ' + rand(),
                                description : rand(),
                                important : true,
                                dateDeadline : new Date(),
                                token : token
                            }, function (error, data, response) {
                                api.post('tasks', '/task/' + data.task._id + '/done', {token : token}, function (error, data, response) {
                                    handled++;
                                    if (handled === 20) {
                                        done();
                                    }
                                });
                            });
                        }
                    });
                });
            });
        });
    });

    it('url tem que existir', function (done) {
        api.get('tasks', '/tasks', {filterByDone : true}, function (error, data, response) {
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
        api.get('tasks', '/tasks', {token : 'invalido', filterByDone : true}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('lista task', function (done) {
        api.get('tasks', '/tasks', {token : token, filterByDone : true}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('tasks');
                data.tasks.length.should.be.above(19);
                for (var i in data.tasks) {
                    data.tasks[i].should.have.property('done').equal(true);
                }
                done();
            }
        });
    });

});
/*
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
            api.post('tasks', '/user', {token : token}, function (error, data, response) {
                api.get('tasks', '/categories', {token : token}, function (error, data, response) {
                    category = data.categories[0];
                    for (var i in data.categories) {
                        categories.push(data.categories[i]._id);
                    }
                    for (var i = 0; i < 20; i++) {
                        api.post('tasks', '/task', {
                            category : category._id,
                            title : 'teste ' + rand(),
                            description : rand(),
                            important : true,
                            dateDeadline : new Date(),
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
        api.get('tasks', '/tasks', {filterByCategory : categories}, function (error, data, response) {
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
        api.get('tasks', '/tasks', {token : 'invalido', filterByCategory : categories}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('lista task todas as categorias', function (done) {
        api.get('tasks', '/tasks', {token : token, filterByCategory : categories}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('tasks');
                done();
            }
        });
    });

    it('lista task apenas uma categoria com resultados', function (done) {
        api.get('tasks', '/tasks', {token : token, filterByCategory : categories[0]}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('tasks');
                data.tasks.length.should.be.above(19);
                for (var i in data.tasks) {
                    data.tasks[i].should.have.property('category').equal(categories[0]);
                }
                done();
            }
        });
    });

});

describe('GET /tasks filter by embedded', function () {
    var token,
        category,
        categories = [],
        handled = 0,
        embeddedName = '/teste/testando/'+rand();

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function (error, data) {
            token = data.user.token;
            api.post('tasks', '/user', {token : token}, function (error, data, response) {
                api.get('tasks', '/categories', {token : token}, function (error, data, response) {
                    category = data.categories[0];
                    for (var i in data.categories) {
                        categories.push(data.categories[i]._id);
                    }
                    for (var i = 0; i < 20; i++) {
                        api.post('tasks', '/task', {
                            category : category._id,
                            title : 'teste ' + rand(),
                            description : rand(),
                            important : true,
                            dateDeadline : new Date(),
                            token : token,
                            embeddeds : [embeddedName]
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


    it('lista task com array de embedded', function (done) {
        api.get('tasks', '/tasks', {token : token, filterByEmbeddeds : [embeddedName]}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('tasks');
                data.tasks.length.should.be.above(10);
                for (var i in data.tasks) {
                    data.tasks[i].should.have.property('embeddeds').include(embeddedName);
                }
                done();
            }
        });
    });


    it('lista task apenas um embedded', function (done) {
        api.get('tasks', '/tasks', {token : token, filterByEmbeddeds : embeddedName}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('tasks');
                data.tasks.length.should.be.above(10);
                for (var i in data.tasks) {
                    data.tasks[i].should.have.property('embeddeds').include(embeddedName);
                }
                done();
            }
        });
    });

});
*/