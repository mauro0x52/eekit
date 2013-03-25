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

    it('token inválido', function (done) {
        api.post('jaiminho', '/mail', {
            token : 'euhaheuaheauheaeauh',
            subject : 'Testando Jaiminho!',
            html : 'Jaiminho sem fadiga! =]',
            categories : 'teste',
            service : 'serviço de teste'
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error');
                done();
            }
        });
    });

    it('sem token', function (done) {
        api.post('jaiminho', '/mail', {
            subject : 'Testando Jaiminho!',
            html : 'Jaiminho sem fadiga! =]',
            categories : 'teste',
            service : 'serviço de teste'
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error');
                done();
            }
        });
    });

    it('sem subject', function (done) {
        api.post('jaiminho', '/mail', {
            token : token,
            html : 'Jaiminho sem fadiga! =]',
            categories : 'teste',
            service : 'serviço de teste'
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error');
                done();
            }
        });
    });

    it('sem html', function (done) {
        api.post('jaiminho', '/mail', {
            token : token,
            subject : 'Testando Jaiminho!',
            categories : 'teste',
            service : 'serviço de teste'
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error');
                done();
            }
        });
    });

    it('sem service', function (done) {
        api.post('jaiminho', '/mail', {
            token : token,
            subject : 'Testando Jaiminho!',
            categories : 'teste'
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error');
                done();
            }
        });
    });

    it('sem category', function (done) {
        api.post('jaiminho', '/mail', {
            token : token,
            subject : 'Testando Jaiminho!',
            html : 'Jaiminho sem fadiga! =]',
            service : 'serviço de teste'
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.not.have.property('error');
                done();
            }
        });
    });

    it('envia email', function (done) {
        api.post('jaiminho', '/mail', {
            token : token,
            subject : 'Testando Jaiminho!',
            html : 'Jaiminho sem fadiga! =]',
            categories : 'teste',
            service : 'serviço de teste'
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.not.have.property('error');
                data.should.have.property('mail').property('subject').include('Testando Jaiminho!');
                data.should.have.property('mail').property('html').include('Jaiminho sem fadiga! =]');
                data.should.have.property('mail').property('categories').include('eekit serviço de teste: teste');
                done();
            }
        });
    });
});
