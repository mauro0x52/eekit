/** Event
 * @author : Rafael Erthal
 * @since : 2012-10
 *
 * @description : Módulo que implementa as funcionalidades de evento
 */

module.exports = function (params) {
    "use strict";

    /** GET /user/:id/events
     *
     * @autor : Rafael Erthal
     * @since : 2012-10
     *
     * @description : Lista eventos de um usuário
     *
     * @allowedApp : Qualquer APP
     * @allowedUser : Logado
     *
     * @request : {}
     * @response : {events}
     */
    params.app.get('/user/:id/events', function (request,response) {
        if (request.param('secret', null) != 'tr4ck3r') {
            response.end();
            return;
        }

        response.contentType('text/html');

        var now = new Date(),
            sunday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay(), 0),
            saturday = new Date(sunday);

        saturday.setDate(saturday.getDate() + 7);

        require('needle').get(
            'http://'+params.config.services.auth.url+':'+params.config.services.auth.port+'/services',
            function (error, resp, data) {
                if (error) {
                    response.send({error : error});
                } else {
                    require('needle').get(
                        'http://'+params.config.services.auth.url+':'+params.config.services.auth.port+'/user/'+request.params.id + '?' + require('querystring').stringify({secret : params.config.security.secret}),
                        function (error, resp, data) {
                            if (error) {
                                response.send({error : error});
                            } else {
                                params.model.Event.user(request.params.id, function (error, user) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {

                                        var format = function (date) {
                                            return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
                                        }

                                        var i,
                                            uses = {};


                                        user = user || {};

                                        if (data.user) {
                                            user.name = data.user.name;
                                            user.email = data.user.username;
                                            if (data.user.informations) {
                                                user.phone = data.user.informations.phone;
                                            }
                                        } else {
                                            user.name = 'deslogado';
                                            user.email = 'deslogado';
                                            user.phone = 'deslogado';
                                        }
                                        user.apps = {
                                            'contatos' : {days : 0, status : '&nbsp;'},
                                            'tarefas'  : {days : 0, status : '&nbsp;'},
                                            'finanças' : {days : 0, status : '&nbsp;'},
                                            'ee'       : {days : 0, status : '&nbsp;'}
                                        };

                                        for (i in user.events) {
                                            if (!uses[user.events[i].app]) {
                                                uses[user.events[i].app] = {};
                                            }
                                            if (!uses[user.events[i].app][format(user.events[i].date)]) {
                                                uses[user.events[i].app][format(user.events[i].date)] = true;
                                            }
                                        }
                                        for (i in uses) {
                                            var days = 0;
                                            for (var prop in uses[i]) {
                                                if (user.apps[i]) {
                                                    user.apps[i].days++;
                                                }
                                            }
                                        }

                                        if (user.ocurrences('tarefas', ['adicionar tarefa']) >= 1) {
                                            user.apps.tarefas.status = 'Ativado';
                                            if (user.ocurrences('tarefas', ['adicionar tarefa'], sunday, saturday) >= 3) {
                                                user.apps.tarefas.status = 'Engajado';
                                            }
                                        } else {
                                            user.apps.tarefas.status = 'Nao Ativado';
                                        }

                                        if (user.ocurrences('finanças', ['adicionar transação']) >= 1) {
                                            user.apps['finanças'].status = 'Ativado';
                                            if (user.ocurrences('finanças', ['adicionar transação'], sunday, saturday) >= 5) {
                                                user.apps['finanças'].status = 'Engajado';
                                            }
                                        } else {
                                            user.apps['finanças'].status = 'Nao Ativado';
                                        }

                                        if (user.ocurrences('contatos', ['adicionar contato']) >= 1) {
                                            user.apps.contatos.status = 'Ativado';
                                            if (
                                                user.ocurrences('contatos', ['adicionar contato'], sunday, saturday) >= 3 ||
                                                user.ocurrences('contatos', ['adicionar tarefa'], sunday, saturday) >= 1 ||
                                                user.ocurrences('contatos', ['adicionar transação'], sunday, saturday) >= 1 ||
                                                user.ocurrences('contatos', ['editar contato'], sunday, saturday) >= 1
                                            ) {
                                                user.apps.contatos.status = 'Engajado';
                                            }
                                        } else {
                                            user.apps.contatos.status = 'Nao Ativado';
                                        }

                                        response.render('../view/user', {user : user});
                                    }
                                });
                            }
                        }
                    );
                }
            }
        );
    });

    /** GET /user/:id/events
     *
     * @autor : Rafael Erthal
     * @since : 2012-10
     *
     * @description : Lista eventos de um usuário
     *
     * @allowedApp : Qualquer APP
     * @allowedUser : Logado
     *
     * @request : {}
     * @response : {events}
     */
    params.app.get('/user/associate', function (request,response) {
        if (request.param('secret', null) != 'tr4ck3r') {
            response.end();
            return;
        }

        params.model.Event.findOne({ip : request.param('ip')}, function (error, event) {
            if (error) {
                response.send({error : error});
            } else if (event === null) {
                response.send({error : 'error'});
            } else {
                event.user = request.param('user');
                event.save(function (error) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        response.send({status : 'ok'});
                    }
                });
            }
        });
    });

    /** GET /users
     *
     * @autor : Rafael Erthal
     * @since : 2012-10
     *
     * @description : Lista usuários
     *
     * @allowedApp : Qualquer APP
     * @allowedUser : Logado
     *
     * @request : {}
     * @response : {events}
     */
    params.app.get('/users', function (request,response) {
        if (request.param('secret', null) != 'tr4ck3r') {
            response.end();
            return;
        }

        require('needle').get(
            'http://'+params.config.services.auth.url+':'+params.config.services.auth.port+'/users?' + require('querystring').stringify({secret : params.config.security.secret}),
            function (error, resp, data) {
                if (error) {
                    response.send({error : error});
                } else {
                    var date;
                    for (var i in data.users) {
                        date = new Date(data.users[i].dateCreated);
                        response.write(data.users[i]._id + ', ' + data.users[i].username + ', ' + date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + '\n');
                    }
                    response.end();
                }
            }
        );
    });

    /** GET /events
     *
     * @autor : Rafael Erthal
     * @since : 2012-10
     *
     * @description : Lista eventos
     *
     * @allowedApp : Qualquer APP
     * @allowedUser : Logado
     *
     * @request : {}
     * @response : {events}
     */
    params.app.get('/events', function (request,response) {
        if (request.param('secret', null) != 'tr4ck3r') {
            response.end();
            return;
        }

        var query = {};

        response.contentType('txt');
        response.header('Access-Control-Allow-Origin', '*');

        response.write("version:4\n");

        if (request.param('from', null) || request.param('to', null)) {
            query.date = {};
            if (request.param('from', null)) {
                query.date.$gt = new Date(request.param('from', null));
            }
            if (request.param('to', null)) {
                query.date.$lt = new Date(request.param('to', null));
            }
        }

        params.model.Event.find(query, function (error, events) {

            events.sort(function(a,b) {
                if (a.date > b.date) return  1;
                if (a.date < b.date) return -1;
                return 0;
            });


            for (i in events) {
                if (events[i].user) {
                   response.write('"' + events[i].label + '","' + events[i].app + '","' + events[i].source + '","' + events[i].user + '","' + events[i].date.getDate() + '/' + (events[i].date.getMonth() + 1) + '/' + events[i].date.getFullYear() + '","' + events[i].date.getHours() + ':' + events[i].date.getMinutes() + '","' + events[i].utm.source + '","' + events[i].utm.content + '","' + events[i].utm.campaign + '","' + events[i].utm.medium + '"\n');
                } else {
                    response.write('"' + events[i].label + '","' + events[i].app + '","' + events[i].source + '","' + 'ip:' + events[i].ip + '","' + events[i].date.getDate() + '/' + (events[i].date.getMonth() + 1) + '/' + events[i].date.getFullYear() + '","' + events[i].date.getHours() + ':' + events[i].date.getMinutes() + '","' + events[i].utm.source + '","' + events[i].utm.content + '","' + events[i].utm.campaign + '","' + events[i].utm.medium + '"\n');
                }
            }
            response.end();
        });
    });

    /** POST /event
     *
     * @autor : Rafael Erthal
     * @since : 2012-10
     *
     * @description : Cadastrar evento
     *
     * @allowedApp : Qualquer APP
     * @allowedUser : Logado
     *
     * @request : {}
     * @response : {event}
     */
    params.app.post('/event', function (request,response) {
        var newevent = new params.model.Event({
                ip : request.connection.remoteAddress,
                date : new Date(),
                app : request.param('app', null),
                source : request.param('source', null),
                label : request.param('label', null),
            }),
            utm = {};

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        if (request.param('utm_source', null)) {
            utm.source = request.param('utm_source', null);
        }

        if (request.param('utm_medium', null)) {
            utm.medium = request.param('utm_medium', null);
        }

        if (request.param('utm_content', null)) {
            utm.content = request.param('utm_content', null);
        }

        if (request.param('utm_campaign', null)) {
            utm.campaign = request.param('utm_campaign', null);
        }

        if (utm) {
            newevent.utm = utm;
        }

        params.auth(request.param('token', null), function (error, data) {
            if (!error) {
                newevent.user = data.user._id
            }
            newevent.save(function (error) {
                if (error) {
                    response.send({error : error});
                } else {
                    response.send({event : newevent});
                }
            });
        });
    });

}
