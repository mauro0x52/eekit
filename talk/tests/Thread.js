/** Tests Talk.Thread
 *
 * @autor : Rafael Almeida Erthal Hermano
 * @since : 2013-04
 *
 * @description : Kit de testes do controller thread do serviço talk
 */

var should = require("should"),
    api = require("./utils.js").api,
    rand = require("./utils.js").rand,
    auth = require("./utils.js").auth;

describe('POST /thread', function () {
    var token;

    before(function (done) {
        auth('talk', function (newToken) {
            token = newToken;
            api.post('talk', '/user', {token : token, alias : 'teste'}, function (error, data, response) {
                done();
            });
        });
    });

    it('url tem que existir', function (done) {
        api.post('talk', '/thread', {}, function (error, data, response) {
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
        api.post('talk', '/thread', {
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

    it('cadastra thread', function (done) {
        api.post('talk', '/thread', {
            token : token
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('thread');
                done();
            }
        });
    });
})

describe('GET /thread/[id]', function () {
    var token,
        thread;

    before(function (done) {
        auth('talk', function (newToken) {
            token = newToken;
            api.post('talk', '/user', {token : token, alias : 'teste'}, function (error, data, response) {
                api.post('talk', '/thread', {
                    token : token
                }, function (error, data, response) {
                    thread = data.thread;
                    done();
                });
            });
        });
    });

    it('url tem que existir', function (done) {
        api.get('talk', '/thread/qualquer', {}, function (error, data, response) {
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
        api.get('talk', '/thread/' + thread._id, {token : 'invalido'}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('thread inexistente', function (done) {
        api.get('talk', '/thread/inexistente' , {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('exibe thread', function (done) {
        api.get('talk', '/thread/' + thread._id, {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('thread');
                done();
            }
        });
    });

});

describe('GET /threads', function () {
    var token,
        handled = 0;

    before(function (done) {
        auth('talk', function (newToken) {
            token = newToken;
            api.post('talk', '/user', {token : token}, function (error, data, response) {
                for (var i = 0; i < 20; i++) {
                    api.post('talk', '/thread', {
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
        api.get('talk', '/threads', {}, function (error, data, response) {
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
        api.get('talk', '/threads', {token : 'invalido'}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('lista threads', function (done) {
        api.get('talk', '/threads', {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('threads');
                done();
            }
        });
    });

});

describe('POST /thread/id/talker', function () {
    var token,
        thread;

    before(function (done) {
        auth('talk', function (newToken) {
            token = newToken;
            api.post('talk', '/user', {token : token, alias : 'teste'}, function (error, data, response) {
                api.post('talk', '/thread', {
                    token : token
                }, function (error, data, response) {
                    thread = data.thread;
                    done();
                });
            });
        });
    });

    it('url tem que existir', function (done) {
        api.post('talk', '/thread/qualquer/talker', {}, function (error, data, response) {
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
        api.post('talk', '/thread/' + thread._id + '/talker', {token : 'invalido'}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('thread inexistente', function (done) {
        api.post('talk', '/thread/inexistente/talker' , {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('adiciona talker', function (done) {
        api.post('talk', '/thread/' + thread._id + '/talker', {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('thread');
                done();
            }
        });
    });

});