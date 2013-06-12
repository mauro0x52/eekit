/** Task
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : Módulo que implementa as funcionalidades tasks
 */

module.exports = function (params) {
    "use strict";

    params.kamisama.bind('update embed', function (data) {
        params.model.Task.find({'embeddeds' : [data.embed]}, function (error, tasks) {
            for (var i in tasks) {
                tasks[i].subtitle = data.subtitle;
                tasks[i].save();
            }
        });
    });
    params.kamisama.bind('delete embed', function (data) {
        params.model.Task.find({'embeddeds' : [data.embed]}, function (error, tasks) {
            for (var i in tasks) {
                tasks[i].remove();
            }
        });
    });

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
    params.app.post('/task', function (request,response) {
        var task;

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        params.model.Auth.findByToken(request.param('token', null), function (error, auth) {
            if (error) {
                response.send({error : error});
            } else {
                params.model.Company.findOne({company : auth.company._id}, function (error, company) {
                    if (error) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else if (company === null) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else {
                        task = new params.model.Task({
                            company     : company._id,
                            author      : auth.user._id,
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
                                params.kamisama.trigger(request.param('token'), 'create task', task);
                                response.send({task : task});
                                params.model.Statistic.inc('tasks', task.author);
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
    params.app.get('/tasks', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        params.model.Auth.findByToken(request.param('token', null), function (error, auth) {
            if (error) {
                response.send({error : error});
            } else {
                params.model.Company.findOne({company : auth.company._id}, function (error, company) {
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
                            query.embeddeds = {$in : [request.param('filterByEmbeddeds')]};
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
                        params.model.Task.find(query, function (error, tasks) {
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
    params.app.get('/task/:id', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        params.model.Auth.findByToken(request.param('token', null), function (error, auth) {
            if (error) {
                response.send({error : error});
            } else {
                params.model.Company.findOne({company : auth.company._id}, function (error, company) {
                    if (error) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else if (company === null) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else {
                        params.model.Task.findById(request.params.id, function (error, task) {
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
    params.app.post('/task/:id/delete', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        params.model.Auth.findByToken(request.param('token', null), function (error, auth) {
            if (error) {
                response.send({error : error});
            } else {
                params.model.Company.findOne({company : auth.company._id}, function (error, company) {
                    if (error) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else if (company === null) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else {
                        params.model.Task.findById(request.params.id, function (error, task) {
                            if (error) {
                                response.send({error : { message : 'task not found', name : 'NotFoundError', id : request.params.id, path : 'task'}});
                            } else if (task === null) {
                                response.send({error : { message : 'task not found', name : 'NotFoundError', id : request.params.id, path : 'task'}});
                            } else {
                                task.remove(function (error) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        params.kamisama.trigger(request.param('token'), 'remove task ' + task._id, task);
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
    params.app.post('/task/:id/done', function (request,response) {
        var newDate;

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        params.model.Auth.findByToken(request.param('token', null), function (error, auth) {
            if (error) {
                response.send({error : error});
            } else {
                params.model.Company.findOne({company : auth.company._id}, function (error, company) {
                    if (error) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else if (company === null) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else {
                        params.model.Task.findById(request.params.id, function (error, task) {
                            if (error) {
                                response.send({error : { message : 'task not found', name : 'NotFoundError', id : request.params.id, path : 'task'}});
                            } else if (task === null) {
                                response.send({error : { message : 'task not found', name : 'NotFoundError', id : request.params.id, path : 'task'}});
                            } else {
                                task.done = true;
                                task.dateUpdated = new Date();
                                task.save(function (error) {
                                    var newTask;
                                    params.kamisama.trigger(request.param('token'), 'remove task ' + task._id, task);
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
                                        newTask = new params.model.Task({
                                            company     : task.company,
                                            user        : task.user,
                                            author      : task.author,
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
                                                params.kamisama.trigger(request.param('token'), 'create task', newTask);
                                                response.send({task : newTask});
                                            }
                                        });
                                    }
                                });
                                params.model.Statistic.inc('done', task.author);
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
     * @request : {category, title, subtitle, description, important, recurrence, dateDealine, embeddeds, reminder, token}
     * @response : {task}
     */
    params.app.post('/task/:id/update', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        params.model.Auth.findByToken(request.param('token', null), function (error, auth) {
            if (error) {
                response.send({error : error});
            } else {
                params.model.Company.findOne({company : auth.company._id}, function (error, company) {
                    if (error) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else if (company === null) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else {
                        params.model.Task.findById(request.params.id, function (error, task) {
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
                                task.embeddeds    = request.param('embeddeds', task.embeddeds);
                                task.reminder     = request.param('reminder', task.reminder);
                                task.save(function (error) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        response.send({task : task});
                                        params.kamisama.trigger(request.param('token'), 'update task ' + task._id, task);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    });

    /** POST /task/:id/sort
     *
     * @autor : Rafael Erthal
     * @since : 2013-04
     *
     * @description : Modifica a ordem de uma tarefa
     *
     * @request : {priority, token}
     * @response : {task}
     */
    params.app.post('/task/:id/sort', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        params.model.Auth.findByToken(request.param('token', null), function (error, auth) {
            if (error) {
                response.send({error : error});
            } else {
                params.model.Company.findOne({company : auth.company._id}, function (error, company) {
                    if (error) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else if (company === null) {
                        response.send({error : { message : 'company not found', name : 'NotFoundError', token : request.params.token, path : 'company'}});
                    } else {
                        params.model.Task.findById(request.params.id, function (error, task) {
                            if (error) {
                                response.send({error : { message : 'task not found', name : 'NotFoundError', id : request.params.id, path : 'task'}});
                            } else if (task === null) {
                                response.send({error : { message : 'task not found', name : 'NotFoundError', id : request.params.id, path : 'task'}});
                            } else {
                                task.priority     = request.param('priority', task.priority);
                                task.save(function (error) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        params.kamisama.trigger(request.param('token'), 'drop task '  + task._id, task);
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
