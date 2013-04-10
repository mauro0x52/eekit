/** Tests Contacts.User
 *
 * @autor : Rafael Almeida Erthal Hermano
 * @since : 2012-09
 *
 * @description : Kit de testes do controller user do serviço contacts
 */

var should = require("should"),
    api = require("./utils.js").api,
    rand = require("./utils.js").rand,
    auth = require("./utils.js").auth;

describe('POST /user', function () {
    var token;

    before(function (done) {
        auth('contacts', function (newToken) {
            token = newToken;
            done();
        });
    });

    it('url tem que existir', function (done) {
        api.post('contacts', '/company', {}, function (error, data, response) {
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
        api.post('contacts', '/company', {token : 'invalido'}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('registra usuário', function (done) {
        api.post('contacts', '/company', {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('categories')
                done();
            }
        });
    });
})