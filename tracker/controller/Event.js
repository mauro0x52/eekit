/** Event
 * @author : Rafael Erthal
 * @since : 2012-10
 *
 * @description : Módulo que implementa as funcionalidades de evento
 */

module.exports = function (app) {
    var Model = require('./../model/Model.js'),
        auth = require('../Utils.js').auth,
        config = require('../config'),
        Event = Model.Event;

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
    app.get('/user/:id/events', function (request,response) {
        response.contentType('text/html');
        Event.find({user : request.params.id}, function (error, events) {
            if (error) {
                response.send({error : error});
            } else {
                require('restler').get('http://'+config.services.auth.url+':'+config.services.auth.port+'/services').on('success', function (data) {
                    var profiles = data.services.profiles;
                    require('restler').get('http://'+config.services.auth.url+':'+config.services.auth.port+'/users', {
                        data: {
                            secret : config.security.secret
                        }
                    }).on('success', function (data) {

                        function format (date) {
                            if (date) {
                                return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
                            }
                        }

                        var j,
                            user,
                            utm = {}
                            appDays = {};

                        for (i in data.users) {
                            if (data.users[i]._id.toString() === request.params.id.toString()) {
                                user = data.users[i];
                            }
                        }

                        for (i in events) {
                            if (!appDays[events[i].app]) {
                                appDays[events[i].app] = {};
                            }
                            if (!appDays[events[i].app][format(events[i].date)]) {
                                appDays[events[i].app][format(events[i].date)] = true;
                            }
                            if (events[i].utm && (events[i].utm.source || events[i].utm.medium || events[i].utm.content || events[i].utm.campaign)) {
                                utm = events[i].utm;
                            }
                        }

                        for (i in user.auths) {
                            if (user.auths[i].service === 'profiles') {
                                for (j in user.auths[i].tokens) {
                                    if ((new Date() - new Date(user.auths[i].tokens[j].dateUpdated))/(1000*60*60*24) < 30) {
                                        token = user.auths[i].tokens[j].token
                                    }
                                }
                            }
                        }
                        
                        require('restler').get('http://'+profiles.host+':'+profiles.port+'/profile', {
                            data: {
                                token : token
                            }
                        }).on('success', function (data) {
                            response.write(user.username + '</br></br>');
                            
                            response.write('nome : ' + data.profile.name + '</br>');
                            response.write('telefone : ' + data.profile.phone + '</br>');
                            response.write('expectativa : ' + data.profile.why + '</br></br>');

                            response.write('utm_source : ' + utm.source + '</br>');
                            response.write('utm_medium : ' + utm.medium + '</br>');
                            response.write('utm_content : ' + utm.content + '</br>');
                            response.write('utm_campaign : ' + utm.campaign + '</br></br>');

                            response.write('<table border="1">');
                            response.write('<tr>');
                            response.write('<td>App</td>');
                            response.write('<td>Dias com acesso</td>');
                            response.write('</tr>');
                            for (i in appDays) {
                                var total = 0;
                                for (var prop in appDays[i]) if (appDays[i].hasOwnProperty(prop)) total++;
                                response.write('<tr>');
                                response.write('<td>' + i + '</td>');
                                response.write('<td>' + total + '</td>');
                                response.write('</tr>');
                            }
                            response.write('</table><br />');
                            
                            response.write('<table border="1">');
                            response.write('<tr>');
                            response.write('<td>Data</td>');
                            response.write('<td>App</td>');
                            response.write('<td>Evento</td>');
                            response.write('</tr>');
                            for (i in events) {
                                response.write('<tr>');
                                response.write('<td>' + events[i].date.getDate() + '/' + (events[i].date.getMonth() + 1) + '/' + events[i].date.getFullYear() + '</td>');
                                response.write('<td>' + events[i].app + '</td>');
                                response.write('<td>' + events[i].label + '</td>');
                                response.write('</tr>');
                            }
                            response.write('</table>');
                            response.end();
                        });
                    });

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
    app.get('/users', function (request,response) {
        var query = {};

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');


        require('restler').get('http://'+config.services.auth.url+':'+config.services.auth.port+'/users', {
            data: {
                secret : config.security.secret
            }
        }).on('success', function (data) {
            
            response.send({users : data.users});

        }).on('error', function(error) {
            response.write(error.toString());
            response.end();
        });
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
    app.get('/events', function (request,response) {
        var query = {};

        response.contentType('txt');
        response.header('Access-Control-Allow-Origin', '*');
       
        response.write("version:1<br />");

        if (request.param('from', null) || request.param('to', null)) {
            query.date = {};
            if (request.param('from', null)) {
                query.date.$gt = new Date(request.param('from', null));
            }
            if (request.param('to', null)) {
                query.date.$lt = new Date(request.param('to', null));
            }
        }

        Event.find(query, function (error, events) {

            events.sort(function(a,b) {
                if (a.date > b.date) return  1;
                if (a.date < b.date) return -1;
                return 0;
            });

            require('restler').get('http://'+config.services.auth.url+':'+config.services.auth.port+'/users', {
                data: {
                    secret : config.security.secret
                }
            }).on('success', function (data) {
                function user (id) {
                    if (id) {
                        for (var i in data.users) {
                            if (data.users[i]._id.toString() === id.toString()) {
                                return data.users[i];
                            }
                        }
                    }
                }

                for (i in events) {
                    if (user(events[i].user)) {
                        response.write('"' + events[i].label + '","' + events[i].app + '","' + events[i].source + '","' + events[i].user + '","' + events[i].date.getDate() + '/' + (events[i].date.getMonth() + 1) + '/' + events[i].date.getFullYear() + '","' + events[i].date.getHours() + ':' + events[i].date.getMinutes() + '","' + events[i].utm.source + '","' + events[i].utm.content + '","' + events[i].utm.campaign + '","' + events[i].utm.medium + '"\n');
                    } else {
                        response.write('"' + events[i].label + '","' + events[i].app + '","' + events[i].source + '","' + 'ip:' + events[i].ip + '","' + events[i].date.getDate() + '/' + (events[i].date.getMonth() + 1) + '/' + events[i].date.getFullYear() + '","' + events[i].date.getHours() + ':' + events[i].date.getMinutes() + '","' + events[i].utm.source + '","' + events[i].utm.content + '","' + events[i].utm.campaign + '","' + events[i].utm.medium + '"\n');
                    }
                }
                response.end();

            }).on('error', function(error) {
                response.write(error.toString());
                response.end();
            });
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
    app.post('/event', function (request,response) {
        var newevent = new Event({
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

        auth(request.param('token', null), function (error, user) {
            if (!error) {
                newevent.user = user._id
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
