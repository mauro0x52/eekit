/** Tests Tasks.Task
 *
 * @autor : Rafael Almeida Erthal Hermano
 * @since : 2012-09
 *
 * @description : Kit de testes do controller task do serviço tasks
 */

var should = require("should"),
    api = require("./utils.js").api,
    rand = require("./utils.js").rand,
    auth = require("./utils.js").auth;

describe('POST /task', function () {
    var token,
        category;

    before(function (done) {
        auth('tasks', function (newToken) {
            token = newToken;
            api.post('tasks', '/company', {token : token}, function (error, data, response) {
                category = data.categories[0];
                done();
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
    var token,
        category,
        task;

    before(function (done) {
        auth('tasks', function (newToken) {
            token = newToken;
            api.post('tasks', '/company', {token : token}, function (error, data, response) {
                category = data.categories[0];
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
    var token,
        category,
        task;

    before(function (done) {
        auth('tasks', function (newToken) {
            token = newToken;
            api.post('tasks', '/company', {token : token}, function (error, data, response) {
                category = data.categories[0];
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
    var token,
        category,
        task;

    before(function (done) {
        auth('tasks', function (newToken) {
            token = newToken;
            api.post('tasks', '/company', {token : token}, function (error, data, response) {
                category = data.categories[0];
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
                data.should.have.property('task');
                done();
            }
        });
    });

});

describe('GET /tasks sem filtro', function () {
    var token,
        category,
        handled = 0;

    before(function (done) {
        auth('tasks', function (newToken) {
            token = newToken;
            api.post('tasks', '/company', {token : token}, function (error, data, response) {
                category = data.categories[0];
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