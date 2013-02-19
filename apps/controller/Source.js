/** Version
 * @author : Rafael Almeida Erthal Hermano
 * @since : 2012-07
 *
 * @description : Módulo que implementa as funcionalidades de ferramentas
 */

module.exports = function (app) {
    "use strict";

    var Model = require('./../model/Model.js'),
        auth  = require('../Utils.js').auth,
        App  = Model.App,
        Source  = Model.Source;

    /** GET /app/:app_slug/source
     *
     * @autor : Mauro Ribeiro
     * @since : 2012-11
     *
     * @description : Pega o código da ferramenta
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Deslogado
     *
     * @request : {token}
     * @response : {tool}
     */
    app.get('/app/:app_slug/source', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        //busca o app
        App.findByIdentity(request.params.app_slug, function (error, app) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se o app foi encontrado
                if (app === null) {
                    response.send({error : { message : 'app not found', name : 'NotFoundError', id : request.params.app_slug, path : 'app'}});
                } else {
                    Source.findOne({app : app, type : 'free'}, function (error, source) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            //verifica se a ferramente foi encontrada
                            if (source === null) {
                                response.send({error : { message : 'source not found', name : 'NotFoundError', path : 'source'}});
                            } else {
                                response.send({source : source, name : app.name, slug : app.slug});
                            }
                        }
                    });
                }
            }
        });
    });

};