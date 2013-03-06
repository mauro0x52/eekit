/**
 * Category
 *
 * @author : Mauro Ribeiro
 * @since  : 2013-02
 *
 * @description : Módulo que implementa as funcionalidades de categoria
 */

module.exports = function (app) {
    var Model = require('./../model/Model.js'),
        auth = require('../Utils.js').auth,
        trigger = require('../Utils.js').trigger,
        Category = Model.Category,
        Contact = Model.Contact,
        User = Model.User;

    /**
     * POST /category
     *
     * @author : Mauro Ribeiro
     * @since  : 2013-02
     *
     * @description : Cadastra nova categoria
     *
     * @request : {token, name, type, color}
     * @response : {category}
     */
    app.post('/category', function (request,response) {
        var category;

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
                        if (User === null) {
                            response.send({error : { message : 'user not found', name : 'NotFoundError', token : request.params.token, path : 'user'}});
                        } else {
                            user.categories.push({
                                name  : request.param('name', null),
                                type  : request.param('type', null),
                                color : request.param('color', null)
                            });
                            user.save(function (error) {
                                var category = user.categories.pop();
                                if (error) {
                                    response.send({error : error});
                                } else {
                                    trigger(request.param('token', null), 'create category', category);
                                    response.send({category : category});
                                }
                            });
                        }
                    }
                });
            }
        });
    });

    /** GET /categories
     *
     * @author : Rafael Erthal
     * @since  : 2012-09
     *
     * @description : Lista categorias
     *
     * @request : {token}
     * @response : {categories[]}
     */
    app.get('/categories', function (request,response) {
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
                        if (User === null) {
                            response.send({error : { message : 'user not found', name : 'NotFoundError', token : request.params.token, path : 'user'}});
                        } else {
                            response.send({categories : user.categories});
                        }
                    }
                });
            }
        });
    });

    /** GET /category/:id
     *
     * @author : Rafael Erthal
     * @since  : 2012-09
     *
     * @description : Exibe fase de negociação de um usuário
     *
     * @request : {token}
     * @response : {category}
     */
    app.get('/category/:id', function (request,response) {
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
                            user.findCategory(request.params.id, function (error, category) {
                                if (error) {
                                    response.send({error : { message : 'category not found', name : 'NotFoundError', token : request.params.id, path : 'category'}});
                                } else {
                                    if (category === null) {
                                        response.send({error : { message : 'category not found', name : 'NotFoundError', token : request.params.id, path : 'category'}});
                                    } else {
                                        response.send({category : category});
                                    }
                                }
                            });
                        }
                    }
                });
            }
        });
    });

    /**
     * POST /category/:id/update
     *
     * @author : Mauro Ribeiro
     * @since  : 2013-02
     *
     * @description : Atualiza a categoria
     *
     * @request : {token, name, type, color}
     * @response : {category}
     */
    app.post('/category/:id/update', function (request,response) {
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
                        if (User === null) {
                            response.send({error : { message : 'user not found', name : 'NotFoundError', token : request.params.token, path : 'user'}});
                        } else {
                            user.findCategory(request.params.id, function (error, category) {
                                if (error) {
                                    response.send({error : { message : 'category not found', name : 'NotFoundError', id : request.params.id, path : 'category'}});
                                } else {
                                    if (category === null) {
                                        response.send({error : { message : 'category not found', name : 'NotFoundError', token : request.params.id, path : 'category'}});
                                    } else {
                                        category.name = request.param('name', category.name);
                                        category.type = request.param('type', category.type);
                                        category.color = request.param('color', category.color);
                                        user.save(function (error) {
                                            if (error) {
                                                response.send({error : error});
                                            } else {
                                                trigger(request.param('token', null), 'update category ' + category._id, category);
                                                response.send({category : category});
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

    /**
     * POST /category/:id/delete
     *
     * @author : Mauro Ribeiro
     * @since  : 2013-02
     *
     * @description : Remove a categoria
     *
     * @request : {token}
     * @response : {}
     */
    app.post('/category/:id/delete', function (request,response) {
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
                        if (User === null) {
                            response.send({error : { message : 'user not found', name : 'NotFoundError', token : request.params.token, path : 'user'}});
                        } else {
                            user.findCategory(request.params.id, function (error, category) {
                                if (error) {
                                    response.send({error : { message : 'category not found', name : 'NotFoundError', id : request.params.id, path : 'category'}});
                                } else {
                                    if (category === null) {
                                        response.send({error : { message : 'category not found', name : 'NotFoundError', token : request.params.id, path : 'category'}});
                                    } else {
                                        var category_id = category._id;

                                        category.remove();
                                        user.save(function (error) {
                                            if (error) {
                                                response.send({error : error});
                                            } else {
                                                trigger(request.param('token', null), 'remove category ' + category_id);
                                                response.send(null);
                                            }
                                        });

                                        /* arranca fora as categorias dos contatos daquela categoria */
                                        Contact.find({category : category_id}, function (error, contacts) {
                                            if (!error) {
                                                for (var i in contacts) {
                                                    contacts[i].category = null;
                                                    contacts[i].save();
                                                }
                                            } else {
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