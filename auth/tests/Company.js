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
    var user, company, token;

    it('sem nome', function(done) {
        api.post('auth', '/company', {
            admin : {
                name     : 'Nome do Camarada',
                username : 'testes+' + rand() + '@empreendemia.com.br',
                password : 'testando'
            },
            secret : services.www.secret
        }, function(error, data, response) {
            if (error) done(error);
            else {
                data.should.have.property('error').property('name', 'ValidationError');
                done();
            }
        });
    });

    it('sem admin', function(done) {
        api.post('auth', '/company', {
            name : 'Nome da Empresa',
            secret : services.www.secret
        }, function(error, data, response) {
            if (error) done(error);
            else {
                data.should.have.property('error').property('name', 'ValidationError');
                done();
            }
        });
    });

    it('admin sem nome', function(done) {
        api.post('auth', '/company', {
            name : 'Nome da Empresa',
            admin : {
                username : 'testes+' + rand() + '@empreendemia.com.br',
                password : 'testando'
            },
            secret : services.www.secret
        }, function(error, data, response) {
            if (error) done(error);
            else {
                data.should.have.property('error').property('name', 'ValidationError');
                done();
            }
        });
    });

    it('admin sem username', function(done) {
        api.post('auth', '/company', {
            name : 'Nome da Empresa',
            admin : {
                name     : 'Nome do Camarada',
                password : 'testando'
            },
            secret : services.www.secret
        }, function(error, data, response) {
            if (error) done(error);
            else {
                data.should.have.property('error').property('name', 'ValidationError');
                done();
            }
        });
    });

    it('admin sem senha', function(done) {
        api.post('auth', '/company', {
            name : 'Nome da Empresa',
            admin : {
                name     : 'Nome do Camarada',
                username : 'testes+' + rand() + '@empreendemia.com.br'
            },
            secret : services.www.secret
        }, function(error, data, response) {
            if (error) done(error);
            else {
                data.should.have.property('error').property('name', 'ValidationError');
                done();
            }
        });
    });

    it('sem secret', function(done) {
        api.post('auth', '/company', {
            name : 'Nome da Empresa',
            admin : {
                name     : 'Nome do Camarada',
                username : 'testes+' + rand() + '@empreendemia.com.br',
                password : 'testando'
            }
        }, function(error, data, response) {
            if (error) done(error);
            else {
                data.should.have.property('error').property('name', 'InvalidServiceError');
                done();
            }
        });
    });

    it('outro secret', function(done) {
        api.post('auth', '/company', {
            name : 'Nome da Empresa',
            admin : {
                name     : 'Nome do Camarada',
                username : 'testes+' + rand() + '@empreendemia.com.br',
                password : 'testando'
            },
            secret : services.contacts.secret
        }, function(error, data, response) {
            if (error) done(error);
            else {
                data.should.have.property('error').property('name', 'InvalidServiceError');
                done();
            }
        });
    });

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
});