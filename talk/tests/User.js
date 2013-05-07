/** Tests Talk.User
 *
 * @autor : Rafael Almeida Erthal Hermano
 * @since : 2013-04
 *
 * @description : Kit de testes do controller user do serviço talk
 */

var should = require("should"),
    api = require("./utils.js").api,
    rand = require("./utils.js").rand,
    auth = require("./utils.js").auth;

describe('POST /user', function () {
    var token;

    before(function (done) {
        auth('talk', function (newToken) {
            token = newToken;
            done();
        });
    });

    it('url tem que existir', function (done) {
        api.post('talk', '/user', {}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });

    it('usuário deslogado', function (done) {
        api.post('talk', '/user', {token : 'invalido', alias : 'teste'}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('user')
                done();
            }
        });
    });

    it('registra usuário', function (done) {
        api.post('talk', '/user', {token : token, alias : 'teste'}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('user')
                done();
            }
        });
    });

})