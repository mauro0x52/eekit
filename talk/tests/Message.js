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

describe('POST /thread/:id/message', function () {
    var token,
        thread;

    before(function (done) {
        auth('talk', function (newToken) {
            token = newToken;
            api.post('talk', '/user', {token : token, alias : 'teste'}, function (error, data, response) {
                api.post('talk', '/thread', {token : token}, function (error, data, response) {
                    thread = data.thread;
                    done();
                });
            });
        });
    });

    it('url tem que existir', function (done) {
        api.post('talk', '/thread/qualquer/message', {}, function (error, data, response) {
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
        api.post('talk', '/thread/' + thread._id + '/message', {
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

    it('cadastra mensagem', function (done) {
        api.post('talk', '/thread/' + thread._id + '/message', {
            token : token,
            message : 'test'
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('message');
                done();
            }
        });
    });
})

describe('GET /thread/:id/messages', function () {
    var token,
        thread,
        handled = 0;

    before(function (done) {
        auth('talk', function (newToken) {
            token = newToken;
            api.post('talk', '/user', {token : token, alias : 'teste'}, function (error, data, response) {
                api.post('talk', '/thread', {token : token}, function (error, data, response) {
                    thread = data.thread;
                    for (var i = 0; i < 20; i++) {
                        api.post('talk', '/thread/' + thread._id + 'message', {
                            token : token,
                            message : 'test'
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
        api.get('talk', '/thread/qualquer/messages', {}, function (error, data, response) {
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
        api.get('talk', '/thread/' + thread._id + '/messages', {token : 'invalido'}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('lista threads', function (done) {
        api.get('talk', '/thread/' + thread._id + '/messages', {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('messages');
                done();
            }
        });
    });

});