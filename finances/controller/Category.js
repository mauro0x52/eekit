/** Category
 * @author : Rafael Erthal
 * @since : 2012-10
 *
 * @description : Módulo que implementa as funcionalidades category
 */

module.exports = function (app) {
    var Model = require('./../model/Model.js'),
        auth = require('../Utils.js').auth,
        Company = Model.Company;

    /** POST /category
     *
     * @autor : Rafael Erthal
     * @since : 2012-10
     *
     * @description : Cadastra uma categoria
     *
     * @request : {name, type, token}
     * @response : {category}
     */
    app.post('/category', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        auth(request.param('token', null), function (error, data) {
            if (error) {
                response.send({error : error});
            } else {
                Company.findOne({company : data.company._id}, function (error, company) {
                    if (error) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else if (company === null) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else {
                        company.categories.push({
                            name : request.param('name', null),
                            type : request.param('type', null)
                        });
                        company.save(function (error) {
                            if (error) {
                                response.send({error : error});
                            } else {
                                response.send({category : company.categories.pop()});
                            }
                        });
                    }
                });
            }
        });
    });

    /** GET /categories
     *
     * @autor : Rafael Erthal
     * @since : 2012-10
     *
     * @description : Lista categorias
     *
     * @request : {token}
     * @response : {categories[]}
     */
    app.get('/categories', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        auth(request.param('token', null), function (error, data) {
            if (error) {
                response.send({error : error});
            } else {
                Company.findOne({company : data.company._id}, function (error, company) {
                    if (error) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else if (company === null) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else {
                        response.send({categories : company.categories});
                    }
                });
            }
        });
    });

    /** GET /category/:id
     *
     * @autor : Rafael Erthal
     * @since : 2012-10
     *
     * @description : Exibe uma categoria
     *
     * @request : {token}
     * @response : {category}
     */
    app.get('/category/:id', function (request,response) {
        var category;

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        auth(request.param('token', null), function (error, data) {
            if (error) {
                response.send({error : error});
            } else {
                Company.findOne({company : data.company._id}, function (error, company) {
                    if (error) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else if (company === null) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else {
                        company.findCategory(request.params.id, function (error, category) {
                            if (error) {
                                response.send({error : { message : 'category not found', name : 'NotFoundError', token : request.params.id, path : 'category'}});
                            } else if (category === null) {
                                response.send({error : { message : 'category not found', name : 'NotFoundError', token : request.params.id, path : 'category'}});
                            } else {
                                response.send({category : category});
                            }
                        });
                    }
                });
            }
        });
    });

    /** POST /category/:id/delete
     *
     * @autor : Rafael Erthal
     * @since : 2012-10
     *
     * @description : Excluir uma categoria
     *
     * @request : {token}
     * @response : {}
     */
    app.post('/category/:id/delete', function (request,response) {
        var category;

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        auth(request.param('token', null), function (error, data) {
            if (error) {
                response.send({error : error});
            } else {
                Company.findOne({company : data.company._id}, function (error, company) {
                    if (error) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else if (company === null) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else {
                        company.findCategory(request.params.id, function (error, category) {
                            if (error) {
                                response.send({error : { message : 'category not found', name : 'NotFoundError', token : request.params.id, path : 'category'}});
                            } else if (category === null) {
                                response.send({error : { message : 'category not found', name : 'NotFoundError', token : request.params.id, path : 'category'}});
                            } else {
                                category.remove();
                                company.save(function (error) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        response.send(null);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    });

    /** POST /category/:id/update
     *
     * @autor : Rafael Erthal
     * @since : 2012-10
     *
     * @description : Editar uma categoria
     *
     * @request : {name, type, token}
     * @response : {category}
     */
    app.post('/category/:id/update', function (request,response) {
        var category;

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        auth(request.param('token', null), function (error, data) {
            if (error) {
                response.send({error : error});
            } else {
                Company.findOne({company : data.company._id}, function (error, company) {
                    if (error) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else if (company === null) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else {
                        company.findCategory(request.params.id, function (error, category) {
                            if (error) {
                                response.send({error : { message : 'category not found', name : 'NotFoundError', token : request.params.id, path : 'category'}});
                            } else if (category === null) {
                                response.send({error : { message : 'category not found', name : 'NotFoundError', token : request.params.id, path : 'category'}});
                            } else {
                                category.name = request.param('name', category.name);
                                category.type = request.param('type', category.type);
                                company.save(function (error) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        response.send({category : category});
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    });

}