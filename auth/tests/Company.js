/**
 * Teste do Auth.Company
 *
 * @autor : Mauro Ribeiro
 * @since : 2013-03
 */

var should = require("should"),
    api = require("./utils.js").api,
    db = require("./utils.js").db,
    rand = require("./utils.js").rand,
    services = require('../config.js').services;

describe('POST /company', function () {
//    it('página /user não encontrada', function (done) {
//        api.post('auth', '/user', {
//            password : 'testando',
//            password_confirmation : 'testando',
//            status : 'active'
//        }, function (error, data, response) {
//            response.should.have.status(200);
//            done();
//        });
//    });
//
//    it('sem serviço', function (done) {
//        api.post('auth', '/user', {},
//        function (error, data, response) {
//            if (error) {
//                done(error);
//            } else {
//                data.should.have.property('error').have.property('name', 'InvalidServiceError');
//                done();
//            }
//        });
//    });
//
//    it('serviço inválido', function (done) {
//        api.post('auth', '/user', {
//            secret : 'kkkkk est sekret esta errdo kkkkk'
//        }, function (error, data, response) {
//            if (error) {
//                done(error);
//            } else {
//                data.should.have.property('error').have.property('name', 'InvalidServiceError');
//                done();
//            }
//        });
//    });
//
//    it('retorna erro se não preencher username', function (done) {
//        api.post('auth', '/user', {
//            password : 'testando',
//            password_confirmation : 'testando',
//            status : 'active',
//            secret : services.www.secret
//        }, function (error, data, response) {
//            if (error) {
//                done(error);
//            } else {
//                data.should.have.property('error').have.property('name', 'ValidationError');
//                done();
//            }
//        });
//    });
//
//    it('retorna erro se não preencher password', function (done) {
//        api.post('auth', '/user', {
//            username : 'testes+' + rand() + '@empreendemia.com.br',
//            status : 'active',
//            secret : services.www.secret
//        }, function(error, data, response) {
//            if (error) {
//                done(error);
//            } else {
//                data.should.have.property('error').have.property('name', 'ValidationError');
//                done();
//            }
//        });
//    });
//    it('retorna erro se preencher password_confirmation incorretamente', function(done) {
//        api.post('auth', '/user', {
//            username : 'testes+' + rand() + '@empreendemia.com.br',
//            password : 'testando',
//            password_confirmation : 'asuidiudhsas',
//            status : 'active',
//            secret : services.www.secret
//        }, function(error, data, response) {
//            if (error) {
//                done(error);
//            } else {
//                data.should.have.property('error').have.property('name', 'ValidationError');
//                done();
//            }
//        });
//    });
//    it('retorna erro se tenta cadastrar username que já existe', function(done) {
//        var username = 'testes+' + rand() + '@empreendemia.com.br';
//        api.post('auth', '/user', {
//            username : username,
//            password : 'testando',
//            password_confirmation : 'testando',
//            status : 'active',
//            secret : services.www.secret
//        }, function(error, data, response) {
//            api.post('auth', '/user', {
//                username : username,
//                password : 'testando',
//                password_confirmation : 'testando',
//                secret : services.www.secret,
//                status : 'active'
//            }, function (error, data, response) {
//                if (error) {
//                    done(error);
//                } else {
//                    data.should.have.property('error').have.property('name', 'ValidationError');
//                    done();
//                }
//            });
//        });
//    });
var user, company, token;
    it('cadastra empresa', function(done) {
        api.post('auth', '/company', {
            name : 'Nome da Empresa',
            admin : {
                name     : 'Nome do Camarada',
                username : 'testes+' + rand() + '@empreendemia.com.br',
                password : 'testando'
            },
            secret : services.www.secret
        }, function(error, data, response) {
            if (error) done(error);
            else {
                user = data.user;
                company = data.company;
                token = data.token;
                data.should.not.have.property('error');
                data.should.have.property('token');
                data.should.have.property('user');
                data.should.have.property('company');
                done();
            }
        });
    });
    it('cadastra usuário', function(done) {
        api.post('auth', '/user', {
            token : token,
            name     : 'Nome do Camarada',
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            secret : services.www.secret
        }, function(error, data, response) {
            if (error) done(error);
            else {
                data.should.not.have.property('error');
                data.should.have.property('user');
                done();
            }
        });
    });
    it('valida token', function(done) {
        api.get('auth', '/validate', {
            token : token,
            secret : services.www.secret
        }, function(error, data, response) {
            if (error) done(error);
            else {
                data.should.have.property('user');
                data.should.have.property('company');
                data.should.have.property('token');
                done();
            }
        });
    });
    it('desloga usuário', function(done) {
        api.post('auth', '/user/logout', {
            token : token,
            secret : services.www.secret
        }, function(error, data, response) {
            if (error) done(error);
            else {
                should.not.exist(data);
                done();
            }
        });
    });
    it('tenta validar token deslogado', function(done) {
        api.get('auth', '/validate', {
            token : token,
            secret : services.www.secret
        }, function(error, data, response) {
            if (error) done(error);
            else {
                data.should.have.property('error');
                done();
            }
        });
    });
    it('loga usuário', function(done) {
        api.post('auth', '/user/login', {
            username : user.username,
            password : 'testando',
            secret : services.www.secret
        }, function(error, data, response) {
            if (error) done(error);
            else {
                data.should.not.have.property('error');
                data.should.have.property('token');
                data.should.have.property('user');
                data.should.have.property('company');
                token = data.token;
                done();
            }
        });
    });
    it('muda senha', function(done) {
        api.post('auth', '/user/change-password', {
            token : token,
            password : 'testando2',
            secret : services.www.secret
        }, function(error, data, response) {
            if (error) done(error);
            else {
                should.not.exist(data);
                done();
            }
        });
    });
    it('desloga usuário com senha alterada', function(done) {
        api.post('auth', '/user/logout', {
            token : token,
            secret : services.www.secret
        }, function(error, data, response) {
            if (error) done(error);
            else {
                should.not.exist(data);
                done();
            }
        });
    });
    it('loga usuário com senha errada', function(done) {
        api.post('auth', '/user/login', {
            username : user.username,
            password : 'aeuiheiauhaeihuea',
            secret : services.www.secret
        }, function(error, data, response) {
            if (error) done(error);
            else {
                data.should.have.property('error');
                done();
            }
        });
    });
    it('loga usuário com senha alterada', function(done) {
        api.post('auth', '/user/login', {
            username : user.username,
            password : 'testando2',
            secret : services.www.secret
        }, function(error, data, response) {
            if (error) done(error);
            else {
                data.should.not.have.property('error');
                data.should.have.property('token');
                data.should.have.property('user');
                data.should.have.property('company');
                token = data.token;
                done();
            }
        });
    });
    it('autoriza empresa no contacts', function(done) {
        api.post('auth', '/service/contacts/authorize', {
            token : token,
            secret : services.www.secret
        }, function(error, data, response) {
            if (error) done(error);
            else {
                data.should.not.have.property('error');
                data.should.have.property('token');
                data.should.have.property('user');
                data.should.have.property('company');
                done();
            }
        });
    });
    it('autoriza app no servico contacts da empresa', function(done) {
        api.post('auth', '/service/contacts/app/51544aab34cf86dd97615f9a/authorize', {
            token : token,
            secret : services.www.secret
        }, function(error, data, response) {
            if (error) done(error);
            else {
                should.not.exist(data);
                done();
            }
        });
    });
});