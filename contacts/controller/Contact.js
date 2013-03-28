/**
 * Contact
 *
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : Módulo que implementa as funcionalidades contacts
 */

module.exports = function (app) {
    var Model = require('./../model/Model.js'),
        auth = require('../Utils.js').auth,
        trigger = require('../Utils.js').trigger,
        Contact = Model.Contact,
        Company = Model.Company;

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
    app.post('/contact', function (request,response) {
        var contact;

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        auth(request.param('token', null), function (error, company) {
            if (error) {
                response.send({error : error});
            } else {
                Company.findOne({company : company._id}, function (error, company) {
                    if (error) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else if (company === null) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else {
                        contact = new Contact({
                            company     : company._id,
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
    app.get('/contacts', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        auth(request.param('token', null), function (error, company) {
            if (error) {
                response.send({error : error});
            } else {
                Company.findOne({company : company._id}, function (error, company) {
                    var query = {};
                    if (error) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else if (company === null) {
                            response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else {
                        query.company = company.company;
                        if (request.param('filterByCategory')) {
                            if (typeof request.param('filterByCategory') === 'string') {
                                query.category = request.param('filterByCategory');
                            } else {
                                query.category = {$in : request.param('filterByCategory')};
                            }
                        }
                        Contact.find(query, function (error, contacts) {
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
    app.get('/contact/:id', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        auth(request.param('token', null), function (error, company) {
            if (error) {
                response.send({error : error});
            } else {
                Company.findOne({company : company._id}, function (error, company) {
                    if (error) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else if (company === null) {
                            response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else {
                        Contact.findById(request.params.id, function (error, contact) {
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
    app.post('/contact/:id/update', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        auth(request.param('token', null), function (error, company) {
            if (error) {
                response.send({error : error});
            } else {
                Company.findOne({company : company._id}, function (error, company) {
                    if (error) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else if (company === null) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else {
                        Contact.findById(request.params.id, function (error, contact) {
                            if (error) {
                                response.send({error : { message : 'contact not found', name : 'NotFoundError', id : request.params.id, path : 'contact'}});
                            } else if (contact === null) {
                                response.send({error : { message : 'contact not found', name : 'NotFoundError', id : request.params.id, path : 'contact'}});
                            } else {
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
                                        trigger(request.param('token', null), 'update embed /contatos/contato-relacionado/' + contact._id ,{subtitle : contact.name, source : 'contacts'});
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
    app.post('/contact/:id/delete', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        auth(request.param('token', null), function (error, company) {
            if (error) {
                response.send({error : error});
            } else {
                Company.findOne({company : company._id}, function (error, company) {
                    if (error) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else if (company === null) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else {
                        Contact.findById(request.params.id, function (error, contact) {
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
                                        trigger(request.param('token', null), 'delete embed /contatos/contato-relacionado/' + contact_id ,{source : 'contacts'});
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