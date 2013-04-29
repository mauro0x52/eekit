/** 
 * Field
 *
 * @author : Rafael Erthal
 * @since : 2013-01
 *
 * @description : Módulo que implementa as funcionalidades de campos configuraveis
 */

module.exports = function (params) {
    "use strict";

    /** POST /field
     *
     * @autor : Rafael Erthal
     * @since : 2013-01
     *
     * @description : Cadastra um campo configurável
     *
     * @request : {token, name, position}
     * @response : {field}
     */
    params.app.post('/field', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        params.auth(request.param('token', null), function (error, data) {
            if (error) {
                response.send({error : error});
            } else {
                params.model.Company.findOne({company : data.company._id}, function (error, company) {
                    if (error) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else if (company === null) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else {
                        company.fields.push({
                            name     : request.param('name', null),
                            position : request.param('position', null)
                        });
                        company.save(function (error) {
                            var field = company.fields.pop();
                            if (error) {
                                response.send({error : error});
                            } else {
                                params.kamisama.trigger(request.param('token'), 'create field', field);
                                response.send({field : field});
                            }
                        });
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
     * @request : {token}
     * @response : {fields[]}
     */
    params.app.get('/fields', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        params.auth(request.param('token', null), function (error, data) {
            if (error) {
                response.send({error : error});
            } else {
                params.model.Company.findOne({company : data.company._id}, function (error, company) {
                    if (error) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else if (company === null) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else {
                        response.send({fields : company.fields});
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
     * @request : {token}
     * @response : {field}
     */
    params.app.get('/field/:id', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        params.auth(request.param('token', null), function (error, data) {
            if (error) {
                response.send({error : error});
            } else {
                params.model.Company.findOne({company : data.company._id}, function (error, company) {
                    if (error) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else if (company === null) {
                            response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else {
                        company.findField(request.params.id, function (error, field) {
                            if (error) {
                                response.send({error : error});
                            } else if (field === null) {
                                response.send({error : { message : 'field not found', name : 'NotFoundError', token : request.params.id, path : 'field'}});
                            } else {
                                response.send({field : field});
                            }
                        });
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
     * @request : {token, name, position}
     * @response : {field}
     */
    params.app.post('/field/:id/update', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        params.auth(request.param('token', null), function (error, data) {
            if (error) {
                response.send({error : error});
            } else {
                params.model.Company.findOne({company : data.company._id}, function (error, company) {
                    if (error) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else if (company === null) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else {
                        company.findField(request.params.id, function (error, field) {
                            if (error) {
                                response.send({error : error});
                            } else if (field === null) {
                                    response.send({error : { message : 'field not found', name : 'NotFoundError', token : request.params.id, path : 'field'}});
                            } else {
                                field.name = request.param('name', field.name);
                                field.position = request.param('position', field.position);
                                company.save(function (error) {
                                    if (error) {
                                        response.send({error: error});
                                    } else {
                                        params.kamisama.trigger(request.param('token'), 'update field ' + field._id, field);
                                        response.send({field : field});
                                    }
                                });
                            }
                        });
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
     * @request : {token}
     * @response : {}
     */
    params.app.post('/field/:id/delete', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        params.auth(request.param('token', null), function (error, data) {
            if (error) {
                response.send({error : error});
            } else {
                params.model.Company.findOne({company : data.company._id}, function (error, company) {
                    if (error) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else if (company === null) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else {
                        company.findField(request.params.id, function (error, field) {
                            if (error) {
                                response.send({error : error});
                            } else if (field === null) {
                                response.send({error : { message : 'field not found', name : 'NotFoundError', token : request.params.id, path : 'field'}});
                            } else {
                                field.remove();
                                company.save(function (error) {
                                    if (error) {
                                        response.send({error: error});
                                    } else {
                                        params.kamisama.trigger(request.param('token'), 'remove field ' + field._id, field);
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
}