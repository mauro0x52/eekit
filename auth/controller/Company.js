/**
 * Company
 * Controller das companies (conjunto de pessoas)
 *
 * @author Mauro Ribeiro
 * @since  2013-03
 */

module.exports = function (params) {
    "use strict";

    /**
     * Cadastra nova company (conjunto de pessoas)
     *
     * @author Mauro Ribeiro
     * @since  2013-03
     *
     * @request     {name, admin : {username, password, secret, info}}
     * @response    {company, user, token}
     */
    params.app.post('/company', function (request, response) {
        var userData, user, company,
            service = null;

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        for (var i in params.config.services) {
            if (params.config.services[i].secret === request.param('secret', '')) {
                service = params.config.services[i]
                service.slug = i;
            }
        }

        if (service === null) {
            response.send({error : { message : 'service unauthorized', name : 'InvalidServiceError', path : 'service'}});
        } else  if (service.slug !== 'www') {
            // valida se o serviço que esta cadastrando o usuário é o WWW
            response.send({error : { message : 'service unauthorized', name : 'InvalidServiceError', path : 'service'}});
        } else {
            // cria a empresa
            company = new params.model.Company({
                name : request.param('name', null)
            });
            // cria o usuário
            userData = request.param('admin', {});
            user = new params.model.User({
                name     : userData.name,
                username : userData.username,
                password : userData.password,
                company  : company._id,
                informations : userData.informations,
                dateCreated : new Date()
            });
            company.users = [user._id];
            // salva a empresa
            company.save(function (error) {
                if (error) {
                    response.send({error : error});
                } else {
                    //salva novo usuário
                    user.save(function (error) {
                        if (error) {
                            if (error.code == 11000) {
                                // usuário já existe
                                response.send({error : {message : 'username already registered', name : 'ValidationError', errors : {username : {message : 'username already registered', name : 'ValidatorError', path : 'username', type : 'unique' }}}});
                            } else {
                                response.send({error : error});
                            }
                            company.remove();
                        } else {
                            //loga o usuário no sistema
                            user.login('www', function (error, token) {
                                if (error) {
                                    response.send({error : error});
                                } else {
                                    response.send({
                                        company : {_id : company._id, name : company.name},
                                        user : {_id : user._id, name : user.name, username : user.username},
                                        token : token
                                    });
                                    /* manda email para o usuário */
                                    require('needle').post(
                                        'http://' + params.config.services.jaiminho.url + ':' + params.config.services.jaiminho.port + '/mail/self',
                                        {
                                            token : token,
                                            service : 'auth',
                                            subject : 'Presente de boas vindas do Empreendekit',
                                            name : 'novo usuario',
                                            from : 'lucas@empreendemia.com.br',
                                            html : '<p>Olá '+userData.name + ', tudo bom?</p><p>Você se cadastrou no EmpreendeKit e acabou de dar o primeiro passo para tornar sua empresa mais produtiva.</p><p>Para te ajudar nessa jornada, estou te enviando um ebook que acabamos de lançar: "Produtividade sem Enrolação".</p><p>Para baixar gratuitamente o ebook, clique <a href="http://pages.rdstation.com.br/livro-produtividade?utm_source=Etapa2&utm_medium=Email-semana2&utm_content=Contatos-poscadastro&utm_campaign=LC02">aqui</a>.</p><p>Qualquer dúvida sobre o EmpreendeKit, pode mandar um email direto para mim.</p><p>Abraços,<br />Lucas</p><br /><br />'
                                        },
                                        function (error, response, data) {
                                            if (error) {
                                                console.log(error);
                                            }
                                        }
                                    );
                                    /* manda email para o admin */
                                    require('needle').post(
                                        'http://' + params.config.services.jaiminho.url + ':' + params.config.services.jaiminho.port + '/mail/admin',
                                        {
                                            token : token,
                                            service : 'auth',
                                            subject : 'Novo usuario cadastrado',
                                            name : 'novo usuário',
                                            to : 'lucas@empreendemia.com.br',
                                            html : '<p>Nome: '+ userData.name + '</p><p>Telefone: ' + (userData.informations && userData.informations.phone ? userData.informations.phone : '') + '</p>'
                                        },
                                        function (error, response, data) {
                                            if (error) {
                                                console.log(error);
                                            }
                                        }
                                    );
                                }
                            });
                        }
                    });
                }
            })
        }
    });
};