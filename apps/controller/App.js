/** App
 * @author : Rafael Almeida Erthal Hermano
 * @since : 2012-07
 *
 * @description : Módulo que implementa as funcionalidades de aplicativos
 */

module.exports = function (app) {
    "use strict";

    var Model = require('./../model/Model.js'),
        auth = require('../Utils.js').auth,
        App = Model.App,
        Source = Model.Source,
        Payer = Model.Payer;

    /** GET /apps
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Listar apps
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Deslogado
     *
     * @request : {}
     * @response : {[name,slug,type]}
     */
    app.get('/apps', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        //busca todos os apps
        App.find(function (error, apps) {
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
     * @allowedApp : Qualquer App
     * @allowedUser : Deslogado
     *
     * @request : {}
     * @response : {[name,slug,type]}
     */
    app.get('/app/:slug', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        //busca todos os apps
        App.findByIdentity(request.params.slug, function (error, app) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se o app foi encontrado
                if (app === null) {
                    response.send({error : { message : 'app not found', name : 'NotFoundError', id : request.params.slug, path : 'app'}});
                } else {
                    response.send({app : app});
                }
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
     * @allowedApp : Qualquer App
     * @allowedUser : Deslogado
     *
     * @request : {token}
     * @response : {tool}
     */
    app.get('/app/:app_slug/source', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        function getSource (app, type) {
            Source.findOne({app : app, type : type}, function (error, source) {
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

        //busca o app
        App.findByIdentity(request.params.app_slug, function (error, app) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se o app foi encontrado
                if (app === null) {
                    response.send({error : { message : 'app not found', name : 'NotFoundError', id : request.params.app_slug, path : 'app'}});
                } else {
                    auth(request.param('token', null), function (error, user) {
                        if (error) {
                            getSource(app, 'free');
                        } else {
                            Payer.findOne({user : user._id, app : app._id, expiration : {"$lt": new Date()}}, function (error, payer) {
                                if (error) {
                                    getSource(app, 'free');
                                } else {
                                    if (payer === null) {
                                        getSource(app, 'free');
                                    } else {
                                        getSource(app, 'paid');
                                    }
                                }
                            });
                        }
                    });
                }
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
     * @allowedApp : Qualquer App
     * @allowedUser : Deslogado
     *
     * @request : {token, expiration}
     * @response : {payer}
     */
    app.get('/app/:slug/pay', function (request, response) {
        var payer;

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                App.findByIdentity(request.params.slug, function (error, app) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        //verifica se o app foi encontrado
                        if (app === null) {
                            response.send({error : { message : 'app not found', name : 'NotFoundError', id : request.params.slug, path : 'app'}});
                        } else {
                            payer = new Payer({
                                user : user._id,
                                app  : app._id,
                                expiration : request.param('expiration', null)
                            });
                            payer.save(function (error) {
                                if (error) {
                                    response.send(error);
                                } else {
                                    response.send(payer);
                                }
                            })
                        }
                    }
                });
            }
        });
    });
};