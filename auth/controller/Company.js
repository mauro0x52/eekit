/**
 * Company
 * Controller das companies (conjunto de pessoas)
 *
 * @author Mauro Ribeiro
 * @since  2013-03
 */

module.exports = function (app) {
    "use strict";

    var Model = require('./../model/Model.js'),
        User  = Model.User,
        Company  = Model.Company,
        config = require('../config.js');

    /**
     * Cadastra nova company (conjunto de pessoas)
     *
     * @author Mauro Ribeiro
     * @since  2013-03
     *
     * @request     {name, admin : {username, password, secret, info}}
     * @response    {company, user, token}
     */
    app.post('/company', function (request, response) {
        var userData, user, company,
            service = null;

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        for (var i in config.services) {
            if (config.services[i].secret === request.param('secret', '')) {
                service = config.services[i]
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
            company = new Company({
                name : request.param('name', null)
            });
            // cria o usuário
            userData = request.param('admin', {});
            user = new User({
                name     : userData.name,
                username : userData.username,
                password : userData.password,
                company  : company._id,
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
                                }
                            });
                        }
                    });
                }
            })
        }
    });
};