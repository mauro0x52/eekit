/** Testes do Auth.Auth
 *
 * @autor : Mauro Ribeiro
 * @since : 2012-08
 *
 * @description : Kit de testes do controller Auth do serviço Auth
 */

var should = require("should"),
    api = require("./utils.js").api,
    db = require("./utils.js").db,
    rand = require("./utils.js").rand,
    services = require('../config.js').services;

describe('POST /service/:service_slug/auth', function () {
    var token;

    before(function (done) {
        // cria um usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando',
            status : 'active',
            secret : services.www.secret
        }, function(error, data) {
            token = data.token;
            done();
        });
    });

    it('url existe', function (done) {
        api.post(
            'auth', '/service/contacts/auth', {
                token : token,
                secret : 'kkkkk est sekret esta errdo kkkkk'
            },
            function(error, data, response) {
                response.should.have.status(200);
                done();
            }
        );
    });
    it('token em branco', function (done) {
        api.post(
            'auth', '/service/contacts/auth', {
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
        api.post(
            'auth', '/service/contacts/auth', {
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
        api.post(
            'auth', '/service/contacts/auth', {
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
        api.post(
            'auth', '/service/contacts/auth', {
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
        api.post(
            'auth', '/service/contacts/auth', {
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

describe('POST /service/:service_slug/app/:app_slug/auth', function () {
    var token;

    before(function (done) {
        // cria um usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando',
            status : 'active',
            secret : services.www.secret
        }, function(error, data) {
            token = data.token;
            api.post(
                'auth', '/service/contacts/auth', {
                    token : token,
                    secret : 'www'
                },
                function(error, data, response) {
                    done();
                }
            );
        });
    });

    it('url existe', function (done) {
        api.post(
            'auth', '/service/contacts/app/000000000000000000000003/auth', {},
            function(error, data, response) {
                response.should.have.status(200);
                done();
            }
        );
    });
    it('token vazio', function (done) {
        api.post(
            'auth', '/service/contacts/app/000000000000000000000003/auth', {
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
        api.post(
            'auth', '/service/contacts/app/000000000000000000000003/auth', {
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
        api.post(
            'auth', '/service/servco_quie_naum_xiste/app/000000000000000000000003/auth', {
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
        api.post(
            'auth', '/service/contacts/app/000000000000000000000003/auth', {
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
        api.post(
            'auth', '/service/contacts/app/000000000000000000000003/auth', {
                token : token,
                secret : 'www'
            },
            function(error, data, response) {
                if (error) {
                    done(error);
                } else {
                    data.should.have.property('auth', true);
                    done();
                }
            }
        );
    });
});


describe('GET /validate', function() {
    var token, token2,
        username = 'testes+' + rand() + '@empreendemia.com.br';

    before(function (done) {
        // cria um usuario
        api.post('auth', '/user', {
            username : username,
            password : 'testando',
            password_confirmation : 'testando',
            status : 'active',
            secret : services.www.secret
        }, function(error, data) {
            token = data.token;
            done();
        });
    });
    it('página não encontrada', function (done) {
        api.get('auth', '/validate', {
            token : token
        },
        function(error, data, response) {
            response.should.have.status(200);
            done();
        }
        );
    });
    it('serviço inválido', function (done) {
        api.get('auth', '/validate', {
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
    it('token em branco', function (done) {
        api.get('auth', '/validate', {
            //token : token,
            secret : services.www.secret
        }, function (error, data, response) {
            data.should.have.property('error').have.property('name', 'InvalidTokenError');
            done();
        });
    });
    it('token errado', function (done) {
        api.get('auth', '/validate', {
            token : token+"asdasdasdas",
            secret : services.www.secret
        }, function (error, data, response) {
            data.should.have.property('error').have.property('name', 'InvalidTokenError');
            done();
        });
    });
    it('valida usuário com sucesso', function (done) {
        api.get('auth', '/validate', {
            token : token,
            secret : services.www.secret
        },
        function(error, data, response) {
            if (error) done(error);
            else {
                should.exist(data);
                data.should.not.have.property('error');
                data.should.have.property('user').have.property('_id');
                done();
            }
        }
        );
    });
});