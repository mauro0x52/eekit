/** Profile
 * @author : Lucas Kalado
 * @since : 2012-08
 *
 * @description : Módulo que implementa as funcionalidades de profiles de usuários
 */

module.exports = function (app) {
    var Model = require('./../model/Model.js'),
        auth = require('../Utils.js').auth,
        mailAdmin = require('../Utils.js').mailAdmin,
        Profile  = Model.Profile;

    /** GET /profile
     *
     * @autor : Rafael Erthal
     * @since : 2012-09
     *
     * @description : Visualiza um Perfil pelo token
     *
     * @allowedApp : Qualquer APP
     * @allowedUser : Logado
     *
     * @request : {token}
     * @response : {jobs, slugs, name, surname, thumbnail, about, phones, contacts, links}
     */
    app.get('/profile', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        //Verifica se o usuário logado é válido
        auth(request.param('token'), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                Profile.findOne({user : user._id}, function (error, profile) {
                    if (error) {
                        response.send({error : { message : 'profile not found', name : 'NotFoundError', token : request.param('token'), path : 'profile'}});
                    } else {
                        if (profile === null) {
                            response.send({error : { message : 'profile not found', name : 'NotFoundError', token : request.param('token'), path : 'profile'}});
                        } else {
                            response.send({profile : profile});
                        }
                    }
                });
            }
        });
    });

    /** POST /profile
     *
     * @autor : Lucas Kalado
     * @since : 2012-08
     *
     * @description : Cadastra novo profile
     *
     * @allowedApp : Profiles
     * @allowedUser : Logado
     *
     * @request : {name, surname, about, phone, role, sector, size, why, token}
     * @response : {this}
     */
    app.post('/profile', function (request,response) {
        var profile;

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        //Verifica se o usuário logado é válido
        auth(request.param('token'), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                //Cria o Objeto Profile para adicionar no Model
                profile = new Profile({
                    user        : user._id,
                    name        : request.param('name', null),
                    surname     : request.param('surname', null),
                    about       : request.param('about', null),
                    phone       : request.param('phone', null),
                    dateCreated : new Date(),
                    dateUpdated : new Date(),
                    role        : request.param('role', null),
                    sector      : request.param('sector', null),
                    size        : request.param('size', null),
                    why         : request.param('why', null)
                });

                //Salva o objeto no Model de Profile e retorna o objeto para o solicitante
                profile.save(function (error) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        response.send({profile : profile});
                        mailAdmin(request.param('token'), {
                            subject : 'Novo usuário cadastrado',
                            categories : ['novo usuário'],
                            to : 'lucas@empreendemia.com.br',
                            html : '<p>Nome: '+request.param('name', null) + ' ' + request.param('surname', null) + '</p><p>Telefone: ' + request.param('phone', null) + '</p>'
                        })
                    }
                });
            }
        })
    });

    /** POST /profile/:slug/update
     *
     * @autor : Lucas Kalado
     * @since : 2012-08
     *
     * @description : Edita um profile
     *
     * @allowedApp : Profiles
     * @allowedUser : Logado
     *
     * @request : {name, surname, about, phone, role, sector, size, why, token}
     * @response : {this}
     */
    app.post('/profile/:profile_id/update', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        //Verifica se o usuário logado é válido
        auth(request.param('token'), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                //Localiza o Profile
                Profile.findByIdentity(request.params.profile_id, function (error, profile) {
                    if (error) {
                        response.send({error: error});
                    } else {
                        //Verifica se o Profile foi encontrado
                        if (profile === null) {
                            response.send({error : { message : 'profile not found', name : 'NotFoundError', id : request.params.profile_id, path : 'profile'}});
                        } else {
                            profile.name    = request.param('name', profile.name);
                            profile.surname = request.param('surname', profile.surname);
                            profile.about   = request.param('about', profile.about);
                            profile.phone   = request.param('phone', profile.phone);
                            profile.dateUpdated = new Date();
                            profile.save(function (error) {
                                if (error) {
                                    response.send({error : error});
                                } else {
                                    response.send({profile : profile});
                                }
                            });
                        }
                    }
                });
            }
        });
    });

    /** POST /profile/:slug/delete
     *
     * @autor : Lucas Kalado
     * @since : 2012-08
     *
     * @description : Excluir profile
     *
     * @allowedApp : Profiles
     * @allowedUser : Logado
     *
     * @request : {token}
     * @response : {confirmation}
     */
    app.post('/profile/:slug/delete', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        //valida o token do usuário
        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                //busca o profile
                Profile.findByIdentity(request.params.slug, function (error, profile) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        //verifica se o profile foi encontrado
                        if (profile === null) {
                            response.send({error : { message : 'profile not found', name : 'NotFoundError', id : request.params.slug, path : 'profile'}});
                        } else {
                            //remove o profile
                            profile.remove(function (error) {
                                if (error) {
                                    response.send({error : error});
                                } else {
                                    response.send(null);
                                }
                            });
                        }
                    }
                });
            }
        });
    });
};