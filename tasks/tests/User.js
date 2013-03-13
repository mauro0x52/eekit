/** Tests Tasks.User
 *
 * @autor : Rafael Almeida Erthal Hermano
 * @since : 2012-09
 *
 * @description : Kit de testes do controller user do serviço tasks
 */

var should = require("should"),
    api = require("./utils.js").api,
    db = require("./utils.js").db,
    rand = require("./utils.js").rand;
    
describe('POST /user', function () {
    var www_token,
        token;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando',
            secret : 'www'
        }, function (error, data) {
            www_token = data.token;
            api.post('auth', '/service/tasks/auth', {
                secret : 'www',
                token : www_token
            }, function (error, data) { 
                token = data.token;
                done();
            });
        });
    });
    
    it('url tem que existir', function (done) {
        api.post('tasks', '/user', {}, function (error, data, response) {
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
        api.post('tasks', '/user', {token : 'invalido'}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });
    
    it('registra usuário', function (done) {
        api.post('tasks', '/user', {token : token}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('categories')
                done();
            }
        });
    });
    
})