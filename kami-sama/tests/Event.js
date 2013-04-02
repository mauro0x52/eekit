/** Testes do Kami-sama.Event
 *
 * @autor : Rafael Erthal
 * @since : 2013-01
 *
 * @description : Kit de testes do controller Event do serviço Kami-sama
 */

var should = require("should"),
    api = require("./utils.js").api,
    rand = require("./utils.js").rand,
    auth = require("./utils.js").auth;

describe('POST /bind', function () {
    var token;

    before(function (done) {
        auth('contacts', function (newToken) {
            token = newToken;
            done();
        });
    });

    it('url tem que existir', function (done) {
        api.post('kamisama', '/bind', {}, function (error, data, response) {
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
        api.post('kamisama', '/bind', {
            label    : 'teste',
            callback : 'http://wwww.google.com',
            method   : 'GET',
            token : 'inválido',
            secret : 'contacts'
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('label em branco', function (done) {
        api.post('kamisama', '/bind', {
            callback : 'http://wwww.google.com',
            method   : 'GET',
            token : token,
            secret : 'contacts'
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'ValidationError');
                done();
            }
        });
    });

    it('callback em branco', function (done) {
        api.post('kamisama', '/bind', {
            label    : 'teste',
            method   : 'GET',
            token : token,
            secret : 'contacts'
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'ValidationError');
                done();
            }
        });
    });

    it('method em branco', function (done) {
        api.post('kamisama', '/bind', {
            label    : 'teste',
            callback : 'http://wwww.google.com',
            token : token,
            secret : 'contacts'
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'ValidationError');
                done();
            }
        });
    });

    it('registra evento', function (done) {
        api.post('kamisama', '/bind', {
            label    : 'teste',
            callback : 'http://wwww.google.com',
            method   : 'GET',
            token : token,
            secret : 'contacts'
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data);
                done();
            }
        });
    });
});

describe('POST /trigger', function () {
    var token;

    before(function (done) {
        auth('contacts', function (newToken) {
            token = newToken;
            done();
        });
    });

    it('url tem que existir', function (done) {
        api.post('kamisama', '/trigger', {}, function (error, data, response) {
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
        api.post('kamisama', '/trigger', {
            label    : 'teste',
            token : 'inválido',
            secret : 'contacts'
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('dispara evento', function (done) {
        api.post('kamisama', '/trigger', {
            label    : 'teste',
            token : token,
            secret : 'contacts'
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                done();
            }
        });
    });
});
