/** Tests Finances.User
 *
 * @autor : Rafael Almeida Erthal Hermano
 * @since : 2012-10
 *
 * @description : Kit de testes do controller user do serviço finances
 */

var should = require("should"),
    api = require("./utils.js").api,
    db = require("./utils.js").db,
    rand = require("./utils.js").rand;
    
describe('POST /company', function () {
    var token;

    before(function (done) {
        auth('finances', function (newToken) {
            token = newToken;
            done();
        });
    });

    it('url tem que existir', function (done) {
        api.post('finances', '/company', {}, function (error, data, response) {
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
        api.post('finances', '/company', {token : 'invalido'}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('registra usuário', function (done) {
        api.post('finances', '/company', {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('categories')
                done();
            }
        });
    });
})