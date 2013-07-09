/**
 * Contact
 *
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : Módulo que implementa as funcionalidades contacts
 */

module.exports = function (params) {
    "use strict";

    /** POST /contact
     *
     * @autor : Rafael Erthal
     * @since : 2012-09
     *
     * @description : Cadastra uma contato
     *
     * @request : {token,category,name,email,phone,priority,notes,fieldValues[]}
     * @response : {contact}
     */
    params.app.post('/contact', function (request,response) {
        var contact;

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
                        contact = new params.model.Contact({
                            company     : company._id,
                            author      : data.user._id,
                            user        : request.param('user', null),
                            category    : request.param('category', null),
                            name        : request.param('name', null),
                            email       : request.param('email', null),
                            phone       : request.param('phone', null),
                            priority    : request.param('priority', null),
                            notes       : request.param('notes', null),
                            dateCreated : new Date(),
                            fieldValues : request.param('fieldValues', null),
                        });
                        contact.save(function (error) {
                            if (error) {
                                response.send({error : error});
                            } else {
                                response.send({contact : contact});
                            }
                        });
                    }
                });
            }
        });
    });

    /** GET /contacts
     *
     * @autor : Rafael Erthal
     * @since : 2012-09
     *
     * @description : listar contatos
     *
     * @request : {token, filterByCategory}
     * @response : {contacts[]}
     */
    params.app.get('/contacts', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        params.auth(request.param('token', null), function (error, data) {
            if (error) {
                response.send({error : error});
            } else {
                params.model.Company.findOne({company : data.company._id}, function (error, company) {
                    var query = {};
                    if (error) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else if (company === null) {
                            response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else {
                        query.company = company._id;
                        if (request.param('filterByCategory')) {
                            if (typeof request.param('filterByCategory') === 'string') {
                                query.category = request.param('filterByCategory');
                            } else {
                                query.category = {$in : request.param('filterByCategory')};
                            }
                        }
                        params.model.Contact.find(query, function (error, contacts) {
                            if (error) {
                                response.send({error : error});
                            } else {
                                response.send({contacts : contacts});
                            }
                        });
                    }
                });
            }
        });
    });

    /** GET /contact/:id
     *
     * @autor : Rafael Erthal
     * @since : 2012-09
     *
     * @description : Exibe contato
     *
     * @request : {token}
     * @response : {contact}
     */
    params.app.get('/contact/:id', function (request,response) {
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
                        params.model.Contact.findById(request.params.id, function (error, contact) {
                            if (error) {
                                response.send({error : { message : 'contact not found', name : 'NotFoundError', id : request.params.id, path : 'contact'}});
                            } else if (contact === null) {
                                response.send({error : { message : 'contact not found', name : 'NotFoundError', id : request.params.id, path : 'contact'}});
                            } else {
                                response.send({contact : contact});
                            }
                        });
                    }
                });
            }
        });
    });

    /** POST /contact/:id/update
     *
     * @autor : Rafael Erthal
     * @since : 2012-09
     *
     * @description : Edita contato
     *
     * @request : {token,category,name,email,phone,priority,notes,fieldValues[]}
     * @response : {contact}
     */
    params.app.post('/contact/:id/update', function (request,response) {
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
                        params.model.Contact.findById(request.params.id, function (error, contact) {
                            if (error) {
                                response.send({error : { message : 'contact not found', name : 'NotFoundError', id : request.params.id, path : 'contact'}});
                            } else if (contact === null) {
                                response.send({error : { message : 'contact not found', name : 'NotFoundError', id : request.params.id, path : 'contact'}});
                            } else {
                                contact.user = request.param('user', contact.user);
                                contact.category = request.param('category', null);
                                contact.name = request.param('name', contact.name);
                                contact.email = request.param('email', contact.email);
                                contact.phone = request.param('phone', contact.phone);
                                contact.notes = request.param('notes', contact.notes);
                                contact.priority = request.param('priority', contact.priority);
                                contact.fieldValues = request.param('fieldValues', contact.fieldValues)
                                contact.save(function (error) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        response.send({contact : contact});
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    });

    /** POST /contact/:id/delete
     *
     * @autor : Rafael Erthal
     * @since : 2012-10
     *
     * @description : Exclui contato
     *
     * @request : {token}
     * @response : {}
     */
    params.app.post('/contact/:id/delete', function (request,response) {
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
                        params.model.Contact.findById(request.params.id, function (error, contact) {
                            if (error) {
                                response.send({error : { message : 'contact not found', name : 'NotFoundError', id : request.params.id, path : 'contact'}});
                            } else if (contact === null) {
                                response.send({error : { message : 'contact not found', name : 'NotFoundError', id : request.params.id, path : 'contact'}});
                            } else {
                                var contact_id = contact._id;
                                contact.remove(function (error) {
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
}