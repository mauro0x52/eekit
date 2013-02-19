/** Testes  Profiles.Profile
 *
 * @autor : Mauro Ribeiro
 * @since : 2012-08
 *
 * @description : Kit de testes do controller Profile do serviço Profiles
 */

var should = require("should"),
    api = require("./utils.js").api,
    rand = require("./utils.js").rand,
    random, userA, profileA, profileB;

random = rand();
userA = {
    username : 'testes+' + random + '@empreendemia.com.br'
}

userB = {
    username : 'testes+b' + random + '@empreendemia.com.br'
}

describe('POST /profile', function () {
    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : userA.username,
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            userA.token = data.user.token;
            userA._id = data.user._id;
            // cria outro usuario
            api.post('auth', '/user', {
                username : userB.username,
                password : 'testando',
                password_confirmation : 'testando'
            }, function(error, data) {
                userB.token = data.user.token;
                userB._id = data.user._id;
                done();
            });
        });
    });

    it('dados obrigatórios não preenchidos', function(done) {
        api.post('profiles', '/profile', {
            token : userA.token
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                response.should.have.status(200);
                data.should.have.property('error').property('name', 'ValidationError');
                done();
            }
        });
    });
    it('token inválido', function(done) {
        api.post('profiles', '/profile', {
            token : 'arbufudbcu1b3124913r987bass978a',
            name : 'Nome' + random,
            surname : 'Sobrenome' + random
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                response.should.have.status(200);
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });
    it('cadastra profile', function(done) {
        api.post('profiles', '/profile', {
            token : userA.token,
            name : 'Nome' + random,
            surname : 'Sobrenome' + random,
            about : 'sobre'
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                data.should.not.have.property('error');
                data.should.have.property('profile').have.property('slug').equal('nome'+random+'-sobrenome'+random);
                data.should.have.property('profile').have.property('name').equal('Nome' + random);
                data.should.have.property('profile').have.property('surname').equal('Sobrenome' + random);
                profileA = data.profile;
                done();
            }
        });
    });
    it('outro profile com mesmo nome', function(done) {
        api.post('profiles', '/profile', {
            token : userB.token,
            name : 'Nome' + random,
            surname : 'Sobrenome' + random
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                data.should.not.have.property('error');
                data.should.have.property('profile').have.property('slug')
                    .include(profileA.slug)
                    .match(/nome[0-9,a-f]{2,}\-sobrenome[0-9,a-f]{2,}\-[0-9,a-f]{2,}/);
                data.should.have.property('profile').have.property('name').equal('Nome' + random);
                data.should.have.property('profile').have.property('surname').equal('Sobrenome' + random);
                profileB = data.profile;
                done();
            }
        });
    });
});

describe('GET /profile/:profile_id', function() {
    it('perfil que não existe', function (done) {
        api.get('profiles', '/profile/aosidnoiqewr9cx', {}, function(error, data, response) {
            if (error) done(error);
            else {
                response.should.have.status(200);
                data.should.have.property('error').property('name', 'NotFoundError');
                done();
            }
        });
    });
    it('perfil pelo id', function (done) {
        api.get('profiles', '/profile/' + profileA._id, {}, function(error, data, response) {
            if (error) done(error);
            else {
                data.should.not.have.property('error');
                data.should.have.property('profile').have.property('_id').equal(profileA._id);
                data.should.have.property('profile').have.property('slug').equal(profileA.slug);
                data.should.have.property('profile').have.property('name').equal(profileA.name);
                data.should.have.property('profile').have.property('surname').equal(profileA.surname);
                done();
            }
        });
    });
    it('perfil pelo slug', function (done) {
        api.get('profiles', '/profile/' + profileA.slug, {}, function(error, data, response) {
            if (error) done(error);
            else {
                data.should.not.have.property('error');
                data.should.have.property('profile').have.property('_id').equal(profileA._id);
                data.should.have.property('profile').have.property('slug').equal(profileA.slug);
                data.should.have.property('profile').have.property('name').equal(profileA.name);
                data.should.have.property('profile').have.property('surname').equal(profileA.surname);
                done();
            }
        });
    });
});

describe('POST /profile/:profile_id/update', function() {
    it('perfil que não existe', function (done) {
        api.post('profiles', '/profile/asdksdkvlnxlkgv/update', {
                token : userA.token,
                name : 'Outronome',
                surname : 'Outrosobrenome'
            }, function(error, data, response) {
                if (error) done(error);
                else {
                    data.should.have.property('error').property('name', 'NotFoundError');
                    done();
                }
            }
        );
    });
    it('token inválido', function (done) {
        api.post('profiles', '/profile/' + profileA.slug + '/update', {
                token : 'a87a985a987a875b8759b87',
                name : 'Outronome',
                surname : 'Outrosobrenome'
            }, function(error, data, response) {
                if (error) done(error);
                else {
                    data.should.have.property('error').property('name', 'InvalidTokenError');
                    done();
                }
            }
        );
    });
    it('setar um campo obrigatório como nulo', function (done) {
        api.post('profiles',  '/profile/' + profileA.slug + '/update', {
                token : userA.token,
                name : null
            }, function(error, data, response) {
                if (error) done(error);
                else {
                    data.should.have.property('error').property('name', 'ValidationError');
                    done();
                }
            }
        );
    });
    it('setar um campo opcional como nulo', function (done) {
        api.post('profiles',  '/profile/' + profileA.slug + '/update', {
                token : userA.token,
                about : null
            }, function(error, data, response) {
                if (error) done(error);
                else {
                    data.should.not.have.property('error');
                    data.should.have.property('profile').have.property('about');
                    should.not.exist(data.profile.about);
                    profileA = data.profile;
                    done();
                }
            }
        );
    });
    it('perfil de outro usuário', function (done) {
        api.post('profiles',  '/profile/' + profileA.slug + '/update', {
                token : userB.token,
                name : 'Outronome',
                surname : 'Outrosobrenome'
            }, function(error, data, response) {
                if (error) done(error);
                else {
                    data.should.have.property('error').property('name', 'PermissionDeniedError');
                    done();
                }
            }
        );
    });
    it('mantém o slug', function (done) {
        api.post('profiles',  '/profile/' + profileA.slug + '/update', {
                token : userA.token,
                about : 'Atualizando meu sobre!'
            }, function(error, data, response) {
                if (error) done(error);
                else {
                    data.should.not.have.property('error');
                    data.should.have.property('profile').have.property('_id').equal(profileA._id);
                    data.should.have.property('profile').have.property('slug').equal(profileA.slug);
                    data.should.have.property('profile').have.property('name').equal(profileA.name);
                    data.should.have.property('profile').have.property('surname').equal(profileA.surname);
                    data.should.have.property('profile').have.property('about').equal('Atualizando meu sobre!');
                    profileA = data.profile;
                    done();
                }
            }
        );
    });
    it('altera o slug', function (done) {
        api.post('profiles',  '/profile/' + profileA.slug + '/update', {
                token : userA.token,
                name : 'Novonome'+random,
                surname : 'Novosobrenome'+random
            }, function(error, data, response) {
                if (error) done(error);
                else {
                    data.should.not.have.property('error');
                    data.should.have.property('profile').have.property('_id').equal(profileA._id);
                    data.should.have.property('profile').have.property('slug')
                        .match(/novonome[0-9,a-f]{2,}\-novosobrenome[0-9,a-f]{2,}\-?[0-9,a-f]*/);
                    data.should.have.property('profile').have.property('name').equal('Novonome'+random);
                    data.should.have.property('profile').have.property('surname').equal('Novosobrenome'+random);
                    data.should.have.property('profile').have.property('about').equal(profileA.about);
                    profileA = data.profile;
                    done();
                }
            }
        );
    });
});

describe('POST /profile/:profile_id/delete', function() {
    it('token inválido', function (done) {
        api.post('profiles', '/profile/'+profileA.slug+'/delete', {
                token : 'asdfvc98y3q24iourbewfsdljk'
            }, function(error, data, response) {
                if (error) done(error);
                else {
                    response.should.have.status(200);
                    data.should.have.property('error').property('name', 'InvalidTokenError');
                    done();
                }
            }
        );
    });
    it('perfil que não existe', function (done) {
        api.post('profiles', '/profile/asdksdkvlnxlkgv/delete', {
                token : userA.token
            }, function(error, data, response) {
                if (error) done(error);
                else {
                    data.should.have.property('error').property('name', 'NotFoundError');
                    done();
                }
            }
        );
    });
    it('perfil de outro usuário', function (done) {
        api.post('profiles', '/profile/'+profileB._id + '/delete', {
                token : userA.token
            }, function(error, data, response) {
                if (error) done(error);
                else {
                    data.should.have.property('error').property('name', 'PermissionDeniedError');
                    done();
                }
            }
        );
    });
    it('remove perfil', function (done) {
        api.post('profiles', '/profile/'+profileA.slug + '/delete', {
                token : userA.token
            }, function(error, data, response) {
                if (error) done(error);
                else {
                    should.not.exist(data);
                    api.get('profiles', '/profile/' + profileA.slug, {}, function(error, data, response) {
                        if (error) done(error);
                        else {
                            data.should.have.property('error').property('name').equal('NotFoundError');
                            done();
                        }
                    });
                }
            }
        );
    });
});
