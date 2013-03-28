/**
 * Testes do Auth.Service
 *
 * @author  Mauro Ribeiro
 * @since  2013-03
 */

var should = require("should"),
    api = require("./utils.js").api,
    db = require("./utils.js").db,
    rand = require("./utils.js").rand,
    services = require('../config.js').services,
    user, company, token;

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


describe('GET /services', function () {
    it('lista servicos', function (done) {
        api.get('auth', '/services', {},
            function(error, data, response) {
                if (error) {
                    done(error);
                } else {
                    data.should.not.have.property('error');
                    data.should.have.property('services').property('auth');
                    data.should.have.property('services').property('www');
                    done();
                }
            }
        );
    });
});

describe('POST /service/:service_slug/authorize', function () {
    it('token em branco', function (done) {
        api.post('auth', '/service/contacts/authorize', {
                secret : 'www'
            },
            function(error, data, response) {
                if (error) {
                    done(error);
                } else {
                    data.should.have.property('error').have.property('name', 'InvalidTokenError');
                    done();
                }
            }
        );
    });
    it('token inválido', function (done) {
        api.post('auth', '/service/contacts/authorize', {
                secret : 'www',
                token : 'kkkkk tokn invlido'
            },
            function(error, data, response) {
                if (error) {
                    done(error);
                } else {
                    data.should.have.property('error').have.property('name', 'InvalidTokenError');
                    done();
                }
            }
        );
    });
    it('serviço que não existe', function (done) {
        api.post('auth', '/service/contacts/authorize', {
                token : token,
                secret : 'kkkkk est sekret esta errdo kkkkk'
            },
            function(error, data, response) {
                if (error) {
                    done(error);
                } else {
                    data.should.have.property('error').have.property('name', 'InvalidServiceError');
                    done();
                }
            }
        );
    });
    it('outro serviço', function (done) {
        api.post('auth', '/service/contacts/authorize', {
                token : token,
                secret : 'tasks'
            },
            function(error, data, response) {
                if (error) {
                    done(error);
                } else {
                    data.should.have.property('error').have.property('name', 'InvalidServiceError');
                    done();
                }
            }
        );
    });
    it('autentica', function (done) {
        api.post('auth', '/service/contacts/authorize', {
                token : token,
                secret : 'www'
            },
            function(error, data, response) {
                if (error) {
                    done(error);
                } else {
                    data.should.have.property('token');
                    done();
                }
            }
        );
    });
});

describe('POST /service/:service_slug/app/:app_slug/authorize', function () {
    it('token vazio', function (done) {
        api.post('auth', '/service/contacts/app/000000000000000000000003/authorize', {
                secret : 'www'
            },
            function(error, data, response) {
                if (error) {
                    done(error);
                } else {
                    data.should.have.property('error').have.property('name', 'InvalidTokenError');
                    done();
                }
            }
        );
    });
    it('token inválido', function (done) {
        api.post('auth', '/service/contacts/app/000000000000000000000003/authorize', {
                token : 'kkkkk tkn malfeit da prra',
                secret : 'www'
            },
            function(error, data, response) {
                if (error) {
                    done(error);
                } else {
                    data.should.have.property('error').have.property('name', 'InvalidTokenError');
                    done();
                }
            }
        );
    });
    it('serviço não existe', function (done) {
        api.post('auth', '/service/servco_quie_naum_xiste/app/000000000000000000000003/authorize', {
                token : token,
                secret : 'www'
            },
            function(error, data, response) {
                if (error) {
                    done(error);
                } else {
                    data.should.have.property('error').have.property('name', 'InvalidServiceError');
                    done();
                }
            }
        );
    });
    it('serviço diferente', function (done) {
        api.post('auth', '/service/contacts/app/000000000000000000000003/authorize', {
                token : token,
                secret : 'contacts'
            },
            function(error, data, response) {
                if (error) {
                    done(error);
                } else {
                    data.should.have.property('error').have.property('name', 'InvalidServiceError');
                    done();
                }
            }
        );
    });
    it('autoriza', function (done) {
        api.post('auth', '/service/contacts/app/000000000000000000000003/authorize', {
                token : token,
                secret : 'www'
            },
            function(error, data, response) {
                if (error) {
                    done(error);
                } else {
                    should.not.exist(data);
                    done();
                }
            }
        );
    });
});