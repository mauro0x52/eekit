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
        config = require('./../config.js'),
        auth = require('../Utils.js').auth,
        tasks = require('../Utils.js').tasks,
        removeTask = require('../Utils.js').removeTask,
        Contact = Model.Contact,
        User = Model.User;

    /** POST /contact
     *
     * @autor : Rafael Erthal
     * @since : 2012-09
     *
     * @description : Cadastra uma contact
     *
     * @allowedApp : Qualquer APP
     * @allowedUser : Logado
     *
     * @request : {category,title,description,important,dateDeadline,token}
     * @response : {contact}
     */
    app.post('/contact', function (request,response) {
        var contact;

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                User.findOne({user : user._id}, function (error, User) {
                    if (error) {
                        response.send({error : { message : 'user not found', name : 'NotFoundError', token : request.params.token, path : 'user'}});
                    } else {
                        if (User === null) {
                            response.send({error : { message : 'user not found', name : 'NotFoundError', token : request.params.token, path : 'user'}});
                        } else {
                            User.findCategory(request.param('category', null), function (error, category) {
                                if (error) {
                                    response.send({error : { message : 'category not found', name : 'NotFoundError', id : request.param('category'), path : 'category'}});
                                } else {
                                    if (category === null) {
                                        response.send({error : { message : 'category not found', name : 'NotFoundError', id : request.param('category'), path : 'category'}});
                                    } else {
                                        contact = new Contact({
                                            user        : user._id,
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
                                }
                            });
                        }
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
     * @description : Lista clientes
     *
     * @allowedApp : Qualquer APP
     * @allowedUser : Logado
     *
     * @request : {token, filterByCategory, filterByDone}
     * @response : {contact}
     */
    app.get('/contacts', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                User.findOne({user : user._id}, function (error, User) {
                    var query = {};
                    if (error) {
                        response.send({error : { message : 'user not found', name : 'NotFoundError', token : request.params.token, path : 'user'}});
                    } else {
                        if (User === null) {
                            response.send({error : { message : 'user not found', name : 'NotFoundError', token : request.params.token, path : 'user'}});
                        } else {
                            query.user = User.user;
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
     * @description : Exibe cliente
     *
     * @allowedApp : Qualquer APP
     * @allowedUser : Logado
     *
     * @request : {token}
     * @response : {contact}
     */
    app.get('/contact/:id', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                User.findOne({user : user._id}, function (error, User) {
                    if (error) {
                        response.send({error : { message : 'user not found', name : 'NotFoundError', token : request.params.token, path : 'user'}});
                    } else {
                        if (User === null) {
                            response.send({error : { message : 'user not found', name : 'NotFoundError', token : request.params.token, path : 'user'}});
                        } else {
                            Contact.findById(request.params.id, function (error, contact) {
                                if (error) {
                                    response.send({error : { message : 'contact not found', name : 'NotFoundError', id : request.params.id, path : 'contact'}});
                                } else {
                                    if (contact === null) {
                                        response.send({error : { message : 'contact not found', name : 'NotFoundError', id : request.params.id, path : 'contact'}});
                                    } else {
                                        response.send({contact : contact});
                                    }
                                }
                            });
                        }
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
     * @description : Edita cliente
     *
     * @allowedApp : Qualquer APP
     * @allowedUser : Logado
     *
     * @request : {token}
     * @response : {contact}
     */
    app.post('/contact/:id/update', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                User.findOne({user : user._id}, function (error, User) {
                    if (error) {
                        response.send({error : { message : 'user not found', name : 'NotFoundError', token : request.params.token, path : 'user'}});
                    } else {
                        if (User === null) {
                            response.send({error : { message : 'user not found', name : 'NotFoundError', token : request.params.token, path : 'user'}});
                        } else {
                            Contact.findById(request.params.id, function (error, contact) {
                                if (error) {
                                    response.send({error : { message : 'contact not found', name : 'NotFoundError', id : request.params.id, path : 'contact'}});
                                } else {
                                    if (contact === null) {
                                        response.send({error : { message : 'contact not found', name : 'NotFoundError', id : request.params.id, path : 'contact'}});
                                    } else {
                                        User.findCategory(request.param('category', null), function (error, category) {
                                            if (error) {
                                                response.send({error : { message : 'category not found', name : 'NotFoundError', token : request.params.id, path : 'category'}});
                                            } else {
                                                if (category === null) {
                                                    response.send({error : { message : 'category not found', name : 'NotFoundError', token : request.params.id, path : 'category'}});
                                                } else {
                                                    contact.category = category;
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

    /** POST /contact/:id/delete
     *
     * @autor : Rafael Erthal
     * @since : 2012-10
     *
     * @description : Exclui cliente
     *
     * @allowedApp : Qualquer APP
     * @allowedUser : Logado
     *
     * @request : {token}
     * @response : {contact}
     */
    app.post('/contact/:id/delete', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                User.findOne({user : user._id}, function (error, User) {
                    if (error) {
                        response.send({error : { message : 'user not found', name : 'NotFoundError', token : request.params.token, path : 'user'}});
                    } else {
                        if (User === null) {
                            response.send({error : { message : 'user not found', name : 'NotFoundError', token : request.params.token, path : 'user'}});
                        } else {
                            Contact.findById(request.params.id, function (error, contact) {
                                var id;
                                if (error) {
                                    response.send({error : { message : 'contact not found', name : 'NotFoundError', id : request.params.id, path : 'contact'}});
                                } else {
                                    if (contact === null) {
                                        response.send({error : { message : 'contact not found', name : 'NotFoundError', id : request.params.id, path : 'contact'}});
                                    } else {
                                        id = contact._id
                                        contact.remove(function (error) {
                                            if (error) {
                                                response.send({error : error});
                                            } else {
                                                var requester = require('request');
                                                requester({
                                                    url : 'http://' + config.services.tasks.url + ':' + config.services.tasks.port + '/tasks?token=' + request.param('token', null) + '&filterByEmbeddeds[0]=/contatos/contato-relacionado/' + id,
                                                    method : 'GET',
                                                }, function (error, result, data) {
                                                    data = JSON.parse(data);
                                                    if (data.tasks) {
                                                        for (var i in data.tasks) {
                                                            requester({
                                                                url : 'http://' + config.services.tasks.url + ':' + config.services.tasks.port + '/task/' + data.tasks[i]._id + '/delete?token=' + request.param('token', null),
                                                                method : 'POST'
                                                            })
                                                        }
                                                    }
                                                });
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