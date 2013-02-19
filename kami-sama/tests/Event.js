/** Testes do Kami-sama.Event
 *
 * @autor : Rafael Erthal
 * @since : 2013-01
 *
 * @description : Kit de testes do controller Event do serviço Kami-sama
 */

var should = require("should"),
    api = require("./utils.js").api,
    rand = require("./utils.js").rand;

describe('POST /bind', function () {
    var token;
    
    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function (error, data) {
            token = data.user.token;
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
            token : 'inválido'
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

    it('callback em branco', function (done) {
        api.post('kamisama', '/bind', {
            label    : 'teste',
            method   : 'GET',
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

    it('method em branco', function (done) {
        api.post('kamisama', '/bind', {
            label    : 'teste',
            callback : 'http://wwww.google.com',
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

    it('registra evento', function (done) {
        api.post('kamisama', '/bind', {
            label    : 'teste',
            callback : 'http://wwww.google.com',
            method   : 'GET',
            token : token
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('event');
                done();
            }
        });
    });
});



describe('POST /trigger', function () {
    var token;
    
    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function (error, data) {
            token = data.user.token;
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
            token : 'inválido'
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
            token : token
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
