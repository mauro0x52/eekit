/** Task
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : Módulo que implementa as funcionalidades tasks
 */

module.exports = function (app) {
    var Model = require('./../model/Model.js'),
        auth = require('../Utils.js').auth,
        bind = require('../Utils.js').bind,
        config = require('../config.js'),
        Task = Model.Task,
        Company = Model.Company;

    /** POST /task
     *
     * @autor : Rafael Erthal
     * @since : 2012-09
     *
     * @description : Cadastra uma task
     *
     * @request : {category,title,subtitle,description,important,recurrence,priority,embeddes,reminder,dateDeadline,token}
     * @response : {task}
     */
    app.post('/task', function (request,response) {
        var task;

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
                        task = new Task({
                            company     : company._id,
                            author      : data.user._id,
                            user        : request.param('user', null),
                            category    : request.param('category', null),
                            title       : request.param('title', null),
                            subtitle    : request.param('subtitle', null),
                            description : request.param('description', null),
                            important   : request.param('important', null) === 'true' || request.param('important', null) === true,
                            done        : false,
                            recurrence  : request.param('recurrence', null),
                            priority    : request.param('priority', null),
                            embeddeds   : request.param('embeddeds', null),
                            reminder    : request.param('reminder', null),
                            dateCreated : new Date(),
                            dateUpdated : new Date(),
                            dateDeadline: request.param('dateDeadline', null)
                        });
                        task.save(function (error) {
                            if (error) {
                                response.send({error : error});
                            } else {
                                if (task.embeddeds) {
                                    for (var i = 0; i < task.embeddeds.length; i++) {
                                        bind(request.param('token', null), 'update embed ' + task.embeddeds[i], 'POST', 'http://' + config.host.url + ':' + config.host.port + '/task/' + task._id + '/update');
                                        bind(request.param('token', null), 'delete embed ' + task.embeddeds[i], 'POST', 'http://' + config.host.url + ':' + config.host.port + '/task/' + task._id + '/delete');
                                    }
                                }
                                response.send({task : task});
                            }
                        });
                    }
                });
            }
        });
    });

    /** GET /tasks
     *
     * @autor : Rafael Erthal
     * @since : 2012-09
     *
     * @description : Lista tarefas de um usuário
     *
     * @request : {token, filterByCategory, filterByDone, filterByEmbeddeds}
     * @response : {tasks[]}
     */
    app.get('/tasks', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        auth(request.param('token', null), function (error, data) {
            if (error) {
                response.send({error : error});
            } else {
                Company.findOne({company : data.company._id}, function (error, company) {
                    var query = {};
                    if (error) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else if (company === null) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else {
                        query.company = company._id;
                        if (request.param('filterByCategory')) {
                            query.embeddeds = {$in : request.param('filterByCategory')};
                        }
                        if (request.param('filterByEmbeddeds')) {
                            query.embeddeds = {$in : request.param('filterByEmbeddeds')};
                        }
                        if (
                            request.param('filterByDone') === true ||
                            request.param('filterByDone') === 'true'
                        ) {
                            query.done = true;
                        } else if (
                            request.param('filterByDone') === false ||
                            request.param('filterByDone') === 'false'
                        ) {
                            query.done = false;
                        }
                        Task.find(query, function (error, tasks) {
                            if (error) {
                                response.send({error : error});
                            } else {
                                response.send({tasks : tasks});
                            }
                        });
                    }
                });
            }
        });
    });

    /** GET /task/:id
     *
     * @autor : Rafael Erthal
     * @since : 2012-09
     *
     * @description : Exibe tarefa de um usuário
     *
     * @request : {token}
     * @response : {task}
     */
    app.get('/task/:id', function (request,response) {
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
                        Task.findById(request.params.id, function (error, task) {
                            if (error) {
                                response.send({error : { message : 'task not found', name : 'NotFoundError', id : request.params.id, path : 'task'}});
                            } else if (task === null) {
                                response.send({error : { message : 'task not found', name : 'NotFoundError', id : request.params.id, path : 'task'}});
                            } else {
                                response.send({task : task});
                            }
                        });
                    }
                });
            }
        });
    });

    /** POST /task/:id/delete
     *
     * @autor : Rafael Erthal
     * @since : 2012-09
     *
     * @description : Exclui tarefa de um usuário
     *
     * @request : {token}
     * @response : {}
     */
    app.post('/task/:id/delete', function (request,response) {
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
                        Task.findById(request.params.id, function (error, task) {
                            if (error) {
                                response.send({error : { message : 'task not found', name : 'NotFoundError', id : request.params.id, path : 'task'}});
                            } else if (task === null) {
                                response.send({error : { message : 'task not found', name : 'NotFoundError', id : request.params.id, path : 'task'}});
                            } else {
                                task.remove(function (error) {
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

    /** POST /task/:id/done
     *
     * @autor : Rafael Erthal
     * @since : 2012-09
     *
     * @description : Marca tarefa de um usuário como realizada
     *
     * @request : {token}
     * @response : {}
     */
    app.post('/task/:id/done', function (request,response) {
        var newDate;

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
                        Task.findById(request.params.id, function (error, task) {
                            if (error) {
                                response.send({error : { message : 'task not found', name : 'NotFoundError', id : request.params.id, path : 'task'}});
                            } else if (task === null) {
                                response.send({error : { message : 'task not found', name : 'NotFoundError', id : request.params.id, path : 'task'}});
                            } else {
                                task.done = true;
                                task.dateUpdated = new Date();
                                task.save(function (error) {
                                    var newTask;
                                    if (error) {
                                        response.send({error : error});
                                    } else if (task.recurrence === 0) {
                                        response.send({task : task});
                                    } else {
                                        task.dateDeadline = new Date();
                                        if (task.recurrence === 30) {
                                            newDate = new Date(task.dateDeadline.getFullYear(), task.dateDeadline.getMonth() + 1, task.dateDeadline.getDate());
                                        } else if (task.recurrence === 5) {
                                            newDate = new Date(task.dateDeadline.getFullYear(), task.dateDeadline.getMonth(), task.dateDeadline.getDate() + 1);
                                            if (newDate.getDay() === 6) {
                                                newDate = new Date(task.dateDeadline.getFullYear(), task.dateDeadline.getMonth(), task.dateDeadline.getDate() + 3);
                                            } else if (newDate.getDay() === 0) {
                                                newDate = new Date(task.dateDeadline.getFullYear(), task.dateDeadline.getMonth(), task.dateDeadline.getDate() + 2);
                                            }
                                        } else {
                                            newDate = new Date(task.dateDeadline.getFullYear(), task.dateDeadline.getMonth(), task.dateDeadline.getDate() + task.recurrence);
                                        }
                                        newTask = new Model.Task({
                                            company     : task.company,
                                            user        : task.user,
                                            category    : task.category,
                                            title       : task.title,
                                            subtitle    : task.subtitle,
                                            description : task.description,
                                            important   : task.important,
                                            done        : false,
                                            recurrence  : task.recurrence,
                                            embeddeds   : task.embeddeds,
                                            reminder    : task.reminder,
                                            dateCreated : new Date(),
                                            dateUpdated : new Date(),
                                            dateDeadline: newDate
                                        });
                                        newTask.save(function (error) {
                                            if (error) {
                                                response.send({error : error});
                                            } else {
                                                if (newTask.embeddeds) {
                                                    for (var i = 0; i < newTask.embeddeds.length; i++) {
                                                        bind(request.param('token', null), 'update embed ' + newTask.embeddeds[i], 'POST', 'http://' + config.host.url + ':' + config.host.port + '/task/' + newTask._id + '/update');
                                                        bind(request.param('token', null), 'delete embed ' + newTask.embeddeds[i], 'POST', 'http://' + config.host.url + ':' + config.host.port + '/task/' + newTask._id + '/delete');
                                                    }
                                                }
                                                response.send({task : newTask});
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    });

    /** POST /task/:id/update
     *
     * @autor : Rafael Erthal
     * @since : 2012-09
     *
     * @description : Edita tarefa
     *
     * @request : {category, title, subtitle, description, important, recurrence, dateDealine, priority, embeddeds, reminder, token}
     * @response : {task}
     */
    app.post('/task/:id/update', function (request,response) {
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
                        Task.findById(request.params.id, function (error, task) {
                            if (error) {
                                response.send({error : { message : 'task not found', name : 'NotFoundError', id : request.params.id, path : 'task'}});
                            } else if (task === null) {
                                response.send({error : { message : 'task not found', name : 'NotFoundError', id : request.params.id, path : 'task'}});
                            } else {
                                task.user         = request.param('user', task.user);
                                task.category     = request.param('category', task.category);
                                task.title        = request.param('title', task.title);
                                task.subtitle     = request.param('subtitle', task.subtitle);
                                task.description  = request.param('description', task.description);
                                task.important    = request.param('important', task.important) === 'true' || request.param('important', task.important) === true;
                                task.recurrence   = request.param('recurrence', task.recurrence);
                                task.dateDeadline = request.param('dateDeadline', task.dateDeadline);
                                task.dateUpdated  = request.param('dateUpdated', task.dateUpdated);
                                task.priority     = request.param('priority', task.priority);
                                task.embeddeds    = request.param('embeddeds', task.embeddeds);
                                task.reminder     = request.param('reminder', task.reminder);
                                task.save(function (error) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        response.send({task : task});
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
