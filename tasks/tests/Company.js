/** Tests Tasks.User
 *
 * @autor : Rafael Almeida Erthal Hermano
 * @since : 2012-09
 *
 * @description : Kit de testes do controller user do serviço tasks
 */

var should = require("should"),
    api = require("./utils.js").api,
    rand = require("./utils.js").rand,
    auth = require("./utils.js").auth;
    
describe('POST /user', function () {
    var token;

    before(function (done) {
        auth('tasks', function (newToken) {
            token = newToken;
            done();
        });
    });
    
    it('url tem que existir', function (done) {
        api.post('tasks', '/company', {}, function (error, data, response) {
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
        api.post('tasks', '/company', {token : 'invalido'}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });
    
    it('registra usuário', function (done) {
        api.post('tasks', '/company', {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('categories')
                done();
            }
        });
    });
    
})