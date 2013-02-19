/** Field
 * @author : Rafael Erthal
 * @since : 2013-01
 *
 * @description : Módulo que implementa as funcionalidades de campos configuraveis
 */

module.exports = function (app) {
    var Model = require('./../model/Model.js'),
        auth = require('../Utils.js').auth,
        Field = Model.Field,
        User = Model.User;

    /** POST /field
     *
     * @autor : Rafael Erthal
     * @since : 2013-01
     *
     * @description : Cadastra um campo configurável
     *
     * @allowedApp : Qualquer APP
     * @allowedUser : Logado
     *
     * @request : {name}
     * @response : {field}
     */
    app.post('/field', function (request,response) {

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                User.findOne({user : user._id}, function (error, user) {
                    if (error) {
                        response.send({error : { message : 'user not found', name : 'NotFoundError', token : request.params.token, path : 'user'}});
                    } else {
                        if (user === null) {
                            response.send({error : { message : 'user not found', name : 'NotFoundError', token : request.params.token, path : 'user'}});
                        } else {
                            user.fields.push({
                                name     : request.param('name', null),
                                position : request.param('position', null)
                            });
                            user.save(function (error) {
                                if (error) {
                                    response.send({error : error});
                                } else {
                                    response.send({field : user.fields.pop()});
                                }
                            });
                        }
                    }
                });
            }
        });
    });

    /** GET /fields
     *
     * @autor : Rafael Erthal
     * @since : 2013-01
     *
     * @description : Lista campos configuráveis
     *
     * @allowedApp : Qualquer APP
     * @allowedUser : Logado
     *
     * @request : {token}
     * @response : {fields : [name]}
     */
    app.get('/fields', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                User.findOne({user : user._id}, function (error, user) {
                    var query = {};
                    if (error) {
                        response.send({error : { message : 'user not found', name : 'NotFoundError', token : request.params.token, path : 'user'}});
                    } else {
                        if (user === null) {
                            response.send({error : { message : 'user not found', name : 'NotFoundError', token : request.params.token, path : 'user'}});
                        } else {
                            response.send({fields : user.fields});
                        }
                    }
                });
            }
        });
    });

    /** GET /field/:id
     *
     * @autor : Rafael Erthal
     * @since : 2013-01
     *
     * @description : Exibe campo configurável
     *
     * @allowedApp : Qualquer APP
     * @allowedUser : Logado
     *
     * @request : {token}
     * @response : {name}
     */
    app.get('/field/:id', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                User.findOne({user : user._id}, function (error, user) {
                    if (error) {
                        response.send({error : { message : 'user not found', name : 'NotFoundError', token : request.params.token, path : 'user'}});
                    } else {
                        if (user === null) {
                            response.send({error : { message : 'user not found', name : 'NotFoundError', token : request.params.token, path : 'user'}});
                        } else {
                            user.findField(request.params.id, function (error, field) {
                                if (error) {
                                    response.send({error : error});
                                } else {
                                    if (field === null) {
                                        response.send({error : { message : 'field not found', name : 'NotFoundError', token : request.params.id, path : 'field'}});
                                    } else {
                                        response.send({field : field});
                                    }
                                }
                            });
                        }
                    }
                });
            }
        });
    });

    /** POST /field/:id/update
     *
     * @autor : Rafael Erthal
     * @since : 2013-01
     *
     * @description : Edita campo configurável
     *
     * @allowedApp : Qualquer APP
     * @allowedUser : Logado
     *
     * @request : {token, name}
     * @response : {name}
     */
    app.post('/field/:id/update', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                User.findOne({user : user._id}, function (error, user) {
                    if (error) {
                        response.send({error : { message : 'user not found', name : 'NotFoundError', token : request.params.token, path : 'user'}});
                    } else {
                        if (user === null) {
                            response.send({error : { message : 'user not found', name : 'NotFoundError', token : request.params.token, path : 'user'}});
                        } else {
                            user.findField(request.params.id, function (error, field) {
                                if (error) {
                                    response.send({error : error});
                                } else {
                                    if (field === null) {
                                        response.send({error : { message : 'field not found', name : 'NotFoundError', token : request.params.id, path : 'field'}});
                                    } else {
                                        field.name = request.param('name', field.name);
                                        field.position = request.param('position', field.position);
                                        user.save(function (error) {
                                            if (error) {
                                                response.send({error: error});
                                            } else {
                                                response.send({field : field});
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        });
    });

    /** POST /field/:id/delete
     *
     * @autor : Rafael Erthal
     * @since : 2013-01
     *
     * @description : Exclui campo configurável
     *
     * @allowedApp : Qualquer APP
     * @allowedUser : Logado
     *
     * @request : {token}
     * @response : {}
     */
    app.post('/field/:id/delete', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                User.findOne({user : user._id}, function (error, user) {
                    if (error) {
                        response.send({error : { message : 'user not found', name : 'NotFoundError', token : request.params.token, path : 'user'}});
                    } else {
                        if (user === null) {
                            response.send({error : { message : 'user not found', name : 'NotFoundError', token : request.params.token, path : 'user'}});
                        } else {
                            user.findField(request.params.id, function (error, field) {
                                if (error) {
                                    response.send({error : error});
                                } else {
                                    if (field === null) {
                                        response.send({error : { message : 'field not found', name : 'NotFoundError', token : request.params.id, path : 'field'}});
                                    } else {
                                        field.remove();
                                        user.save(function (error) {
                                            if (error) {
                                                response.send({error: error});
                                            } else {
                                                response.send(null);
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        });
    });

}