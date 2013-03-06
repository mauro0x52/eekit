/** Testes do Auth.User
 *
 * @autor : Mauro Ribeiro
 * @since : 2012-08
 *
 * @description : Kit de testes do controller User do serviço Auth
 */

var should = require("should"),
    api = require("./utils.js").api,
    db = require("./utils.js").db,
    rand = require("./utils.js").rand,
    services = require('../config.js').services;

describe('POST /user', function () {
    it('página /user não encontrada', function (done) {
        api.post('auth', '/user', {
            password : 'testando',
            password_confirmation : 'testando',
            status : 'active'
        }, function (error, data, response) {
            response.should.have.status(200);
            done();
        });
    });

    it('serviço inválido', function (done) {
        api.post('auth', '/user', {
            secret : 'kkkkk est sekret esta errdo kkkkk'
        }, function (error, data, response) {
            if (error) {
                done(error);
            } else {
                data.should.have.property('error').have.property('name', 'InvalidServiceError');
                done();
            }
        });
    });

    it('retorna erro se não preencher username', function (done) {
        api.post('auth', '/user', {
            password : 'testando',
            password_confirmation : 'testando',
            status : 'active',
            secret : services.www.secret
        }, function (error, data, response) {
            if (error) {
                done(error);
            } else {
                data.should.have.property('error').have.property('name', 'ValidationError');
                done();
            }
        });
    });

    it('retorna erro se não preencher password', function (done) {
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            status : 'active',
            security : services.www.secret
        }, function(error, data, response) {
            if (error) {
                done(error);
            } else {
                data.should.have.property('error').have.property('name', 'ValidationError');
                done();
            }
        });
    });
    it('retorna erro se preencher password_confirmation incorretamente', function(done) {
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'asuidiudhsas',
            status : 'active',
            security : services.www.secret
        }, function(error, data, response) {
            if (error) {
                done(error);
            } else {
                data.should.have.property('error').have.property('name', 'ValidationError');
                done();
            }
        });
    });
    it('retorna erro se tenta cadastrar username que já existe', function(done) {
        var username = 'testes+' + rand() + '@empreendemia.com.br';
        api.post('auth', '/user', {
            username : username,
            password : 'testando',
            password_confirmation : 'testando',
            status : 'active',
            security : services.www.secret
        }, function(error, data, response) {
            api.post('auth', '/user', {
                username : username,
                password : 'testando',
                password_confirmation : 'testando',
                status : 'active'
            }, function (error, data, response) {
                data.should.have.property('error').have.property('name', 'MongoError');
                done();
            });
        });
    });
    it('cadastra usuário', function(done) {
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando',
            status : 'active',
            security : services.www.secret
        }, function(error, data, response) {
            if (error) done(error);
            else {
                data.should.not.have.property('error');
                data.should.have.property('user').have.property('token');
                done();
            }
        });
    });
});
//
//describe('POST /user/[login]/deactivate', function () {
//    var token,
//        userId;
//
//    before(function (done) {
//        api.post('auth', '/user', {
//            username : 'testes+' + rand() + '@empreendemia.com.br',
//            password : 'testando',
//            password_confirmation : 'testando',
//            satus : 'active'
//        }, function(error, data) {
//            token = data.user.token;
//            userId = data.user._id;
//            done();
//        });
//    });
//    it('página não encontrada', function (done) {
//        api.post('auth', '/user/'+userId+"/deactivate", {
//            token : token
//        }, function (error, data, response) {
//            response.should.have.status(200);
//            done();
//        });
//    });
//    it('desativada com sucesso', function (done) {
//        api.post('auth', '/user/'+userId+"/deactivate", {
//            token : token
//        }, function (error, data, response) {
//            if (error) done(error);
//            else {
//                should.not.exist(data.error, "precisava retornar error");
//                data.should.have.property('user').have.property('_id');
//                done();
//            }
//        });
//    });
//    it('token em branco', function (done) {
//        api.post('auth', '/user/'+userId+"/deactivate", {
//            //token : token
//        }, function (error, data, response) {
//            data.should.have.property('error').have.property('name', 'InvalidTokenError');
//            done();
//        });
//    });
//    it('token errado', function (done) {
//        api.post('auth', '/user/'+userId+"/deactivate", {
//            token : token+"asdasdasdas"
//        }, function (error, data, response) {
//            data.should.have.property('error').have.property('name', 'InvalidTokenError');
//            done();
//        });
//    });
//});
//
//describe('POST /user/[login]/activate', function () {
//    var token,
//        userId;
//
//    before(function (done) {
//        // cria um usuario
//        api.post('auth', '/user', {
//            username : 'testes+' + rand() + '@empreendemia.com.br',
//            password : 'testando',
//            password_confirmation : 'testando',
//            satus : 'active'
//        }, function(error, data) {
//            token = data.user.token;
//            userId = data.user._id;
//            done();
//        });
//    });
//    it('página não encontrada', function (done) {
//        api.post('auth', '/user/'+userId+"/activate", {
//            token : token
//        }, function (error, data, response) {
//            response.should.have.status(200);
//            done();
//        });
//    });
//    it('ativada com sucesso', function (done) {
//        api.post('auth', '/user/'+userId+"/activate", {
//            token : token
//        }, function (error, data, response) {
//            if (error) done(error);
//            else {
//                should.not.exist(data.error, "precisava retornar error");
//                data.should.have.property('user').have.property('_id');
//                done();
//            }
//        });
//    });
//    it('token em branco', function (done) {
//        api.post('auth', '/user/'+userId+"/activate", {
//            //token : token
//        }, function (error, data, response) {
//            data.should.have.property('error').have.property('name', 'InvalidTokenError');
//            done();
//        });
//    });
//    it('token errado', function (done) {
//        api.post('auth', '/user/'+userId+"/activate", {
//            token : token+"asdasdasdas"
//        }, function (error, data, response) {
//            data.should.have.property('error').have.property('name', 'InvalidTokenError');
//            done();
//        });
//    });
//    it('usuário inválido', function (done) {
//        api.post('auth', '/user/'+userId+"223das123asd/activate", {
//            token : token
//        }, function (error, data, response) {
//            data.should.have.property('error').have.property('name', 'NotFoundError');
//            done();
//        });
//    });
//});
//
//describe('POST /user/[login]/change-password', function () {
//    var token,
//        userId;
//
//    before(function (done) {
//        // cria um usuario
//        api.post('auth', '/user', {
//            username : 'testes+' + rand() + '@empreendemia.com.br',
//            password : 'testando',
//            password_confirmation : 'testando',
//            satus : 'active'
//        }, function(error, data) {
//            token = data.user.token;
//            userId = data.user._id;
//            done();
//        });
//    });
//    it('página não encontrada', function (done) {
//        api.post('auth', '/user/'+userId+"/change-password", {
//            token : token
//        }, function (error, data, response) {
//            response.should.have.status(200);
//            done();
//        });
//    });
//    it('trocar de senha com sucesso', function(done) {
//        api.post('auth', '/user/'+userId+"/change-password", {
//            newpassword : 'testando2',
//            newpasswordconfirmation : 'testando2',
//            token : token
//        }, function(error, data, response) {
//            if (error) {
//                done(error);
//            } else {
//                if (error) done(error);
//                else {
//                    should.not.exist(data.error, "precisava retornar error");
//                    data.should.have.property('user').have.property('_id');
//                    done();
//                }
//            }
//        });
//    });
//    it('token em branco', function(done) {
//        api.post('auth', '/user/'+userId+"/change-password", {
//            newpassword : 'testando',
//            newpasswordconfirmation : 'testando'
//        }, function(error, data, response) {
//            if (error) {
//                done(error);
//            } else {
//                data.should.have.property('error').have.property('name', 'InvalidTokenError');
//                done();
//            }
//        });
//    });
//    it('usuário não cadastrado', function(done) {
//        api.post('auth', '/user/'+userId+"123asd123asd123/change-password", {
//            newpassword : 'testando',
//            newpasswordconfirmation : 'testando',
//            token : token
//        }, function(error, data, response) {
//            data.should.have.property('error').have.property('name', 'NotFoundError');
//            done();
//        });
//    });
//    it('token errado', function(done) {
//        api.post('auth', '/user/'+userId+"/change-password", {
//            newpassword : 'testando',
//            newpasswordconfirmation : 'testando',
//            token : token+"asdad123123asd"
//        }, function(error, data, response) {
//            data.should.have.property('error').have.property('name', 'InvalidTokenError');
//            done();
//        });
//    });
//    it('Senhas não batem', function(done) {
//        api.post('auth', '/user/'+userId+"/change-password", {
//            newpassword : 'testando',
//            newpasswordconfirmation : 'testando123123123123',
//            token : token
//        }, function(error, data, response) {
//            data.should.have.property('error').have.property('name', 'ValidationError');
//            done();
//        });
//    });
//    it('Senhas em branco', function(done) {
//        api.post('auth', '/user/'+userId+"/change-password", {
//            newpassword : '',
//            newpasswordconfirmation : '',
//            token : token
//        }, function(error, data, response) {
//            if (error) done(error);
//            else {
//                data.should.have.property('error').have.property('name', 'ValidationError');
//                done();
//            }
//        });
//    });
//});

describe('POST /user/login', function() {
    var token,
        username;

    before(function (done) {
        username = 'testes+' + rand() + '@empreendemia.com.br';
        // cria um usuario
        api.post('auth', '/user', {
            username : username,
            password : 'testando',
            password_confirmation : 'testando',
            status : 'active',
            secret : services.www.secret
        }, function(error, data) {
            token = data.user.token;
            done();
        });
    });
    it('página não encontrada', function (done) {
        api.post('auth', '/user/login', {},
        function(error, data, response) {
            response.should.have.status(200);
            done();
        }
        );
    });

    it('serviço inválido', function (done) {
        api.post('auth', '/user/login', {
            username : username,
            password : "testando",
            secret : 'kkkkk est sekret esta errdo kkkkk'
        },
        function(error, data, response) {
            if (error) {
                done(error);
            } else {
                data.should.have.property('error').have.property('name', 'InvalidServiceError');
                done();
            }
        });
    });

    it('autenticado com sucesso', function (done) {
        api.post('auth', '/user/login', {
            username : username,
            password : "testando",
            secret : services.www.secret
        },
        function(error, data, response) {
            should.not.exist(data.error, "não era para retornar erro");
            should.exist(data.tokens, "não retornou os tokens");
            done();
        }
        );
    });
    it('usuário não existe', function (done) {
        api.post('auth', '/user/login', {
            username : username,
            password : "testando",
            secret : services.www.secret
        },
        function(error, data, response) {
            data.should.have.property('error').have.property('name', 'NotFoundError');
            done();
        }
        );
    });
    it('usuário em branco', function (done) {
        api.post('auth', '/user/login', {
            username : '',
            password : "testando",
            secret : services.www.secret
        },
        function(error, data, response) {
            data.should.have.property('error').have.property('name', 'InvalidLoginError');
            done();
        }
        );
    });
    it('senha em branco', function (done) {
        api.post('auth', '/user/login', {
            username : username,
            password : "",
            secret : services.www.secret
        },
        function(error, data, response) {
            data.should.have.property('error').have.property('name', 'InvalidLoginError');
            done();
        }
        );
    });
    it('senha errada', function (done) {
        api.post('auth', '/user/login', {
            username : username,
            password : "1234567",
            secret : services.www.secret
        },
        function(error, data, response) {
            data.should.have.property('error').have.property('name', 'InvalidLoginError');
            done();
        }
        );
    });
});

describe('POST /user/logout', function() {
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
    it('página não encontrada', function (done) {
        api.post('auth', '/user/logout', {},
        function(error, data, response) {
            response.should.have.status(200);
            done();
        }
        );
    });
    it('serviço inválido', function (done) {
        api.post('auth', '/user/logout', {
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
    it('deslogar com serviço sem autorização', function (done) {
        api.post('auth', '/user/logout', {
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
    it('token errado', function (done) {
        api.post('auth', '/user/logout', {
            token : token+"asd123",
            secret : services.www.secret
        },
        function(error, data, response) {
            data.should.have.property('error').have.property('name', 'InvalidTokenError');
            done();
        }
        );
    });
    it('token em branco', function (done) {
        api.post('auth', '/user/logout', {
            //token : token+"asd123",
            secret : services.www.secret
        },
        function(error, data, response) {
            data.should.have.property('error').have.property('name', 'InvalidTokenError');
            done();
        }
        );
    });
    it('deslogado com sucesso', function (done) {
        api.post('auth', '/user/logout', {
            token : token,
            secret : services.www.secret
        },
        function(error, data, response) {
            should.not.exist(data, "não era para retornar nehum dado");
            done();
        }
        );
    });
});