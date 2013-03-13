/** Testes do Tracker.Event
 *
 * @autor : Rafael Erthal
 * @since : 2013-01
 *
 * @description : Kit de testes do controller Event do serviço TRacker
 */

var should = require("should"),
    config = require("../config.js"),
    api = require("./utils.js").api,
    rand = require("./utils.js").rand;

describe('POST /event', function () {
    var token;
    
    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando',
            secret : 'www'
        }, function (error, data) {
            token = data.token;
            done();
        });
    });

    it('url tem que existir', function (done) {
        api.post('tracker', '/event', {}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });

    it('usuário logado', function (done) {
        api.post('tracker', '/event', {
            app : 'app',
            source : 'source',
            label : 'teste',
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

    it('usuário deslogado', function (done) {
        api.post('tracker', '/event', {
            app : 'app',
            source : 'source',
            label : 'teste'
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
