/** App
 * @author : Rafael Almeida Erthal Hermano
 * @since : 2012-07
 *
 * @description : Módulo que implementa as funcionalidades de aplicativos
 */

module.exports = function (params) {
    "use strict";

    /** GET /apps
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Listar apps
     *
     * @request : {}
     * @response : {apps[]}
     */
    params.app.get('/apps', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        //busca todos os apps
        params.model.App.find(function (error, apps) {
            if (error) {
                response.send({error : error});
            } else {
                response.send({apps : apps});
            }
        });
    });

    /** GET /app/:slug
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Exibir app
     *
     * @request : {}
     * @response : {app}
     */
    params.app.get('/app/:slug', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        //busca todos os apps
        params.model.App.findByIdentity(request.params.slug, function (error, app) {
            if (error) {
                response.send({error : error});
            } else if (app === null) {
                response.send({error : { message : 'app not found', name : 'NotFoundError', id : request.params.slug, path : 'app'}});
            } else {
                response.send({app : app});
            }
        });
    });


    /** GET /app/:app_slug/source
     *
     * @autor : Mauro Ribeiro
     * @since : 2012-11
     *
     * @description : Pega o código da ferramenta
     *
     * @request : {token}
     * @response : {source, name, slug}
     */
    params.app.get('/app/:app_slug/source', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        function getSource (app, type) {
            params.model.Source.findOne({app : app, type : type}, function (error, source) {
                if (error) {
                    response.send({error : error});
                } else if (source === null) {
                    response.send({error : { message : 'source not found', name : 'NotFoundError', path : 'source'}});
                } else {
                    response.send({source : source, name : app.name, slug : app.slug});
                }
            });
        }

        //busca o app
        params.model.App.findByIdentity(request.params.app_slug, function (error, app) {
            if (error) {
                response.send({error : error});
            } else if (app === null) {
                response.send({error : { message : 'app not found', name : 'NotFoundError', id : request.params.app_slug, path : 'app'}});
            } else {
                params.auth(request.param('token', null), function (error, company) {
                    if (error) {
                        getSource(app, 'free');
                    } else {
                        params.model.Company.findOne({company : company._id, app : app._id, expiration : {"$lt": new Date()}}, function (error, company) {
                            if (error) {
                                getSource(app, 'free');
                            } else if (company === null) {
                                getSource(app, 'free');
                            } else {
                                getSource(app, 'paid');
                            }
                        });
                    }
                });
            }
        });
    });

    /** POST /app/:slug/pay
     *
     * @autor : Rafael Erthal
     * @since : 2013-01
     *
     * @description : Libera app pago
     *
     * @request : {token, expiration}
     * @response : {company}
     */
    params.app.get('/app/:slug/pay', function (request, response) {
        var newcompany;

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        params.auth(request.param('token', null), function (error, company) {
            if (error) {
                response.send({error : error});
            } else {
                params.model.App.findByIdentity(request.params.slug, function (error, app) {
                    if (error) {
                        response.send({error : error});
                    } else if (app === null) {
                        response.send({error : { message : 'app not found', name : 'NotFoundError', id : request.params.slug, path : 'app'}});
                    } else {
                        newcompany = new params.model.Company({
                            company : company._id,
                            app  : app._id,
                            expiration : request.param('expiration', null)
                        });
                        newcompany.save(function (error) {
                            if (error) {
                                response.send(error);
                            } else {
                                response.send(newcompany);
                            }
                        })
                    }
                });
            }
        });
    });
};