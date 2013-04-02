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

describe('POST /mail/self', function () {
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
        api.post('jaiminho', '/mail/self', {
            token : 'euhaheuaheauheaeauh',
            subject : 'Testando Jaiminho!',
            html : 'Jaiminho sem fadiga! =]',
            name : 'teste',
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
        api.post('jaiminho', '/mail/self', {
            subject : 'Testando Jaiminho!',
            html : 'Jaiminho sem fadiga! =]',
            name : 'teste',
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
        api.post('jaiminho', '/mail/self', {
            token : token,
            html : 'Jaiminho sem fadiga! =]',
            name : 'teste',
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
        api.post('jaiminho', '/mail/self', {
            token : token,
            subject : 'Testando Jaiminho!',
            name : 'teste',
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
        api.post('jaiminho', '/mail/self', {
            token : token,
            subject : 'Testando Jaiminho!',
            name : 'teste'
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error');
                done();
            }
        });
    });

    it('envia email sem category', function (done) {
        api.post('jaiminho', '/mail/self', {
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
        api.post('jaiminho', '/mail/self', {
            token : token,
            subject : 'Testando Jaiminho!',
            html : 'Jaiminho sem fadiga! =]',
            name : 'teste',
            service : 'serviço de teste'
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.not.have.property('error');
                data.should.have.property('mail').property('subject').include('Testando Jaiminho!');
                data.should.have.property('mail').property('html').include('Jaiminho sem fadiga! =]');
                data.should.have.property('mail').property('categories').include('eekit test serviço de teste: teste');
                done();
            }
        });
    });
});

describe('POST /mail/admin', function () {
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
        api.post('jaiminho', '/mail/admin', {
            token : 'euhaheuaheauheaeauh',
            subject : 'Testando Jaiminho!',
            html : 'Jaiminho sem fadiga! =]',
            name : 'teste',
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
        api.post('jaiminho', '/mail/admin', {
            subject : 'Testando Jaiminho!',
            html : 'Jaiminho sem fadiga! =]',
            name : 'teste',
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
        api.post('jaiminho', '/mail/admin', {
            token : token,
            html : 'Jaiminho sem fadiga! =]',
            name : 'teste',
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
        api.post('jaiminho', '/mail/admin', {
            token : token,
            subject : 'Testando Jaiminho!',
            name : 'teste',
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
        api.post('jaiminho', '/mail/admin', {
            token : token,
            subject : 'Testando Jaiminho!',
            name : 'teste'
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error');
                done();
            }
        });
    });

    it('envia email', function (done) {
        api.post('jaiminho', '/mail/admin', {
            token : token,
            subject : 'Oi admin!',
            html : 'Email para o admin',
            name : 'teste',
            service : 'serviço de teste'
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.not.have.property('error');
                data.should.have.property('mail').property('subject').include('Oi admin!');
                data.should.have.property('mail').property('html').include('Email para o admin');
                data.should.have.property('mail').property('categories').include('eekit test admin serviço de teste: teste');
                done();
            }
        });
    });

    it('envia email para alguem em especifico', function (done) {
        api.post('jaiminho', '/mail/admin', {
            token : token,
            subject : 'Aew admin!',
            html : 'Email para o admin',
            name : 'teste',
            service : 'serviço de teste',
            to : 'testes+aew@empreendemia.com.br'
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.not.have.property('error');
                data.should.have.property('mail').property('subject').include('Aew admin!');
                data.should.have.property('mail').property('html').include('Email para o admin');
                data.should.have.property('mail').property('categories').include('eekit test admin serviço de teste: teste');
                done();
            }
        });
    });
});