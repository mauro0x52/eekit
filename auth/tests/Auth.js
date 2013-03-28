/**
 * Testes do Auth.Auth
 *
 * @author  Mauro Ribeiro
 * @since  2012-08
 */

var should = require("should"),
    api = require("./utils.js").api,
    db = require("./utils.js").db,
    rand = require("./utils.js").rand,
    services = require('../config.js').services,
    user, company, token, token2;

describe('before all', function() {
    it('before', function (done) {
        // cadastra empresa e admin
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
                done();
            }
        });
    });
});


describe('GET /validate', function () {
    it('sem token', function (done) {
        api.get('auth', '/validate', {
            secret : services.www.secret
        },
        function (error, data, response) {
            if (error) {
                done(error);
            } else {
                data.should.have.property('error').have.property('name', 'InvalidTokenError');
                done();
            }
        });
    });
    it('token inválido', function (done) {
        api.get('auth', '/validate', {
            token : 'ehiauheaieuheaiuh token errado mano',
            secret : services.www.secret
        },
        function (error, data, response) {
            if (error) {
                done(error);
            } else {
                data.should.have.property('error').have.property('name', 'InvalidTokenError');
                done();
            }
        });
    });
    it('sem secret', function (done) {
        api.get('auth', '/validate', {
            token : token
        },
        function (error, data, response) {
            if (error) {
                done(error);
            } else {
                data.should.have.property('error').have.property('name', 'InvalidServiceError');
                done();
            }
        });
    });
    it('secret errado', function (done) {
        api.get('auth', '/validate', {
            token : token,
            secret : 'contacts'
        },
        function (error, data, response) {
            if (error) {
                done(error);
            } else {
                data.should.have.property('error').have.property('name', 'InvalidTokenError');
                done();
            }
        });
    });
    it('valida show', function (done) {
        api.get('auth', '/validate', {
            token : token,
            secret : services.www.secret
        },
        function (error, data, response) {
            if (error) {
                done(error);
            } else {
                data.should.not.have.property('error');
                data.should.have.property('user').property('_id', user._id);
                data.should.have.property('company').property('_id', company._id);
                data.should.have.property('token');
                done();
            }
        });
    });
    it('invalida token antigo', function (done) {
        api.post('auth', '/user/logout', {
            token : token,
            secret : services.www.secret
        },
        function (error, data, response) {
            if (error) {
                done(error);
            } else {
                api.post('auth', '/login', {
                    user : user.username,
                    password : 'testando',
                    secret : services.www.secret
                },
                function (error, data, response) {
                    if (error) {
                        done(error);
                    } else {
                        api.get('auth', '/validate', {
                            token : token,
                            secret : services.www.secret
                        },
                        function (error, data, response) {
                            if (error) {
                                done(error);
                            } else {
                                data.should.have.property('error').have.property('name', 'InvalidTokenError');
                                done();
                            }
                        });
                    }
                });
            }
        });
    });
});