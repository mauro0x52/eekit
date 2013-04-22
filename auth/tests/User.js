/**
 * Testes do Auth.User
 *
 * @author Mauro Ribeiro
 * @since  2012-08
 */

var should = require("should"),
    api = require("./utils.js").api,
    db = require("./utils.js").db,
    rand = require("./utils.js").rand,
    services = require('../config.js').services,
    user, company, token, user2, outUser;

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
            secret : 'www'
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                data.should.have.property('user');
                data.should.have.property('company');
                data.should.have.property('token');
                user = data.user;
                company = data.company;
                token = data.token;
                api.post('auth', '/company', {
                    name : 'Nome da Empresa 2',
                    admin : {
                        name     : 'Nome do Camarada 2',
                        username : 'testes+' + rand() + '@empreendemia.com.br',
                        password : 'testando'
                    },
                    secret : services.www.secret
                }, function(error, data, response) {
                    if (error) done(error);
                    else {
                        outUser = data.user;
                        done();
                    }
                });
            }
        });
    });
});

describe('GET /user/:id', function() {
    it('sem secret', function (done) {
        api.get('auth', '/user/'+user._id, {
        },
        function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'InvalidServiceError');
                done();
            }
        });
    });
    it('id que não existe', function (done) {
        api.get('auth', '/user/inexistente', {
            secret : 'contacts'
        },
        function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error');
                done();
            }
        });
    });
    it('sem permissão de ver todas as informações', function (done) {
        api.get('auth', '/user/'+user._id, {
            secret : 'contacts'
        },
        function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('user').property('_id');
                data.should.have.property('user').property('name');
                done();
            }
        });
    });
    it('com permissão de ver todas as informações', function (done) {
        api.get('auth', '/user/'+user._id, {
            secret : 'contacts'
        },
        function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('user').property('_id');
                data.should.have.property('user').property('name');
                data.should.have.property('user').property('company');
                done();
            }
        });
    });
});

describe('POST /user', function () {

    it('sem serviço', function (done) {
        api.post('auth', '/user', {
            token : token
        },
        function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'InvalidServiceError');
                done();
            }
        });
    });

    it('serviço inválido', function (done) {
        api.post('auth', '/user', {
            token : token,
            secret : 'kkkkk est sekret esta errdo kkkkk'
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'InvalidServiceError');
                done();
            }
        });
    });

    it('sem username', function (done) {
        api.post('auth', '/user', {
            password : 'testando',
            token : token,
            secret : services.www.secret
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'ValidationError');
                done();
            }
        });
    });

    it('sem password', function (done) {
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            token : token,
            secret : services.www.secret
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'ValidationError');
                done();
            }
        });
    });

    it('username já existe', function(done) {
        api.post('auth', '/user', {
            username : user.username,
            password : 'testando',
            token : token,
            secret : services.www.secret
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'ValidationError');
                done();
            }
        });
    });

    it('cadastra usuário', function(done) {
        api.post('auth', '/user', {
            name : 'Nome do Broder',
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            status : 'active',
            token : token,
            secret : services.www.secret
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                data.should.not.have.property('error');
                data.should.have.property('company');
                data.should.have.property('user');
                user2 = data.user;
                done();
            }
        });
    });
});


describe('POST /user/logout', function() {
    it('serviço vazio', function (done) {
        api.post('auth', '/user/logout', {
            token : token
        },
        function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'InvalidServiceError');
                done();
            }
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
                return done(error);
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
                return done(error);
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
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'InvalidTokenError');
                done();
            }
        }
        );
    });
    it('token em branco', function (done) {
        api.post('auth', '/user/logout', {
            //token : token+"asd123",
            secret : services.www.secret
        },
        function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'InvalidTokenError');
                done();
            }
        }
        );
    });
    it('deslogado com sucesso', function (done) {
        api.post('auth', '/user/logout', {
            token : token,
            secret : services.www.secret
        },
        function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data, "não era para retornar nehum dado");
                done();
            }
        }
        );
    });
});

describe('POST /user/login', function() {
    it('sem serviço', function (done) {
        api.post('auth', '/user/login', {
            username : user.username,
            password : "testando"
        },
        function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'InvalidServiceError');
                done();
            }
        });
    });
    it('serviço inválido', function (done) {
        api.post('auth', '/user/login', {
            username : user.username,
            password : "testando",
            secret : 'kkkkk est sekret esta errdo kkkkk'
        },
        function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'InvalidServiceError');
                done();
            }
        });
    });
    it('usuário não existe', function (done) {
        api.post('auth', '/user/login', {
            username : 'usuarioqnaumexiste@naoexiste.com',
            password : "testando",
            secret : services.www.secret
        },
        function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'InvalidLoginError');
                done();
            }
        }
        );
    });
    it('usuário em branco', function (done) {
        api.post('auth', '/user/login', {
            password : "testando",
            secret : services.www.secret
        },
        function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'InvalidLoginError');
                done();
            }
        }
        );
    });
    it('senha em branco', function (done) {
        api.post('auth', '/user/login', {
            username : user.username,
            secret : services.www.secret
        },
        function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'InvalidLoginError');
                done();
            }
        }
        );
    });
    it('senha errada', function (done) {
        api.post('auth', '/user/login', {
            username : user.username,
            password : "1234567",
            secret : services.www.secret
        },
        function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'InvalidLoginError');
                done();
            }
        }
        );
    });

    it('autenticado com sucesso', function (done) {
        api.post('auth', '/user/login', {
            username : user.username,
            password : "testando",
            secret : services.www.secret
        },
        function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.not.have.property('error');
                data.should.have.property('token');
                data.should.have.property('company');
                data.should.have.property('user');
                token = data.token;
                done();
            }
        }
        );
    });
});

describe('POST /user/id/change-password', function () {
    it('sem secret', function(done) {
        api.post('auth', '/user/'+user._id+'/change-password', {
            token : token,
            password : 'testando'
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'InvalidServiceError');
                done();
            }
        });
    });
    it('secret errado', function(done) {
        api.post('auth', '/user/'+user._id+'/change-password', {
            token : token,
            password : 'testando',
            secret : 'aeuiaehieauheaihae'
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'InvalidServiceError');
                done();
            }
        });
    });
    it('token em branco', function(done) {
        api.post('auth', '/user/'+user._id+'/change-password', {
            password : 'testando',
            secret : services.www.secret
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'InvalidTokenError');
                done();
            }
        });
    });
    it('sem token', function(done) {
        api.post('auth', '/user/'+user._id+'/change-password', {
            password : 'testando',
            secret : services.www.secret
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'InvalidTokenError');
                done();
            }
        });
    });
    it('token errado', function(done) {
        api.post('auth', '/user/'+user._id+'/change-password', {
            password : 'testando',
            token : token+"asdad123123asd",
            secret : services.www.secret
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'InvalidTokenError');
                done();
            }
        });
    });
    it('Senha em branco', function(done) {
        api.post('auth', '/user/'+user._id+'/change-password', {
            token : token,
            secret : services.www.secret
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                data.should.have.property('error').have.property('name', 'ValidationError');
                done();
            }
        });
    });
    it('usuário que não existe', function(done) {
        api.post('auth', '/user/'+outUser._id+'/change-password', {
            password : 'testando2',
            token : token,
            secret : services.www.secret
        }, function(error, data, response) {
            if (error) {
                done(error);
            } else {
                data.should.have.property('error').property('name', 'NotFoundError');
                done();
            }
        });
    });
    it('usuário de outra empresa', function(done) {
        api.post('auth', '/user/'+outUser._id+'/change-password', {
            password : 'testando2',
            token : token,
            secret : services.www.secret
        }, function(error, data, response) {
            if (error) {
                done(error);
            } else {
                data.should.have.property('error').property('name', 'NotFoundError');
                done();
            }
        });
    });
    it('trocar senha de outro usuário da empresa', function(done) {
        api.post('auth', '/user/'+user2._id+'/change-password', {
            password : 'testando2',
            token : token,
            secret : services.www.secret
        }, function(error, data, response) {
            if (error) {
                done(error);
            } else {
                should.not.exist(data);
                done();
            }
        });
    });
    it('trocar de senha com sucesso', function(done) {
        api.post('auth', '/user/'+user._id+'/change-password', {
            password : 'testando2',
            token : token,
            secret : services.www.secret
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data);
                done();
            }
        });
    });
    it('tenta logar com senha antiga', function (done) {
        api.post('auth', '/user/logout', {
            token : token,
            secret : services.www.secret
        },
        function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                api.post('auth', '/user/login', {
                    username : user.username,
                    password : 'testando',
                    secret : services.www.secret
                },
                function(error, data, response) {
                    if (error) {
                        return done(error);
                    } else {
                        data.should.have.property('error');
                        done();
                    }
                });
            }
        });
    });
    it('loga com senha nova', function (done) {
        api.post('auth', '/user/logout', {
            token : token,
            secret : services.www.secret
        },
        function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                api.post('auth', '/user/login', {
                    username : user.username,
                    password : 'testando2',
                    secret : services.www.secret
                },
                function(error, data, response) {
                    if (error) {
                        return done(error);
                    } else {
                        data.should.not.have.property('error');
                        data.should.have.property('token');
                        data.should.have.property('company');
                        data.should.have.property('user');
                        done();
                    }
                });
            }
        });
    });
});


describe('GET /users', function () {
    it('tenta listar sem autorização', function(done) {
        api.get('auth', '/users', {
            secret : 'contacts'
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'InvalidServiceError');
                done();
            }
        });
    });
    it('lista de usuários', function(done) {
        api.get('auth', '/users', {
            secret : 'tracker'
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('users').instanceOf(Array);
                data.users[0].should.have.property('name');
                data.users[0].should.have.property('username');
                data.users[0].should.have.property('company');
                data.users[0].should.not.have.property('password');
                done();
            }
        });
    });
});