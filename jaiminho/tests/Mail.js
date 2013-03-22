/** Testes do Jaiminho.Mail
 *
 * @autor : Mauro Ribeiro
 * @since : 2013-03
 *
 * @description : Kit de testes do controller Mail
 */

var should = require("should"),
    api = require("./utils.js").api,
    rand = require("./utils.js").rand;

describe('POST /mail', function () {
    var token;

    before(function (done) {
        // cria um usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando',
            status : 'active',
            secret : 'www'
        }, function(error, data) {
            token = data.token;
            done();
        });
    });

    it('envia email', function (done) {
        api.post('jaiminho', '/mail', {
            token : token,
            subject : 'Testando Jaiminho!',
            body : 'Jaiminho sem fadiga! =]',
            category : 'teste',
            service : 'serviço de teste'
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                console.log(data)
                done();
            }
        });
    });
});
