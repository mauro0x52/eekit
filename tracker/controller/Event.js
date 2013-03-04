/** Event
 * @author : Rafael Erthal
 * @since : 2012-10
 *
 * @description : Módulo que implementa as funcionalidades de evento
 */

module.exports = function (app) {
    var Model = require('./../model/Model.js'),
        auth = require('../Utils.js').auth,
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
                var mongodb = require("mongodb"),
                    config = require("../config.js"),
                    mongoserver = new mongodb.Server(config.mongodb.url, config.mongodb.port, {}),
                    connector = new mongodb.Db('profiles', mongoserver);

                connector.open(function (error, db) {
                    db.collection('profiles', function (error, collection) {
                        collection.find().toArray(function (error, users) {

                            function format (date) {
                                if (date) {
                                    return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
                                }
                            }

                            var j,
                                user,
                                appDays = {};

                            for (j in users) {
                                if (request.params.id === users[j].user.toString()) {
                                    user = users[j];
                                }
                            }

                            for (i in events) {
                                if (!appDays[events[i].app]) {
                                    appDays[events[i].app] = {};
                                }
                                if (!appDays[events[i].app][format(events[i].date)]) {
                                    appDays[events[i].app][format(events[i].date)] = true;
                                }
                            }
                            
                            response.write(user.name + ' ' + user.surname + '</br>');
                            response.write(user.role + '</br>');
                            response.write(user.sector + '</br>');
                            response.write(user.size + '</br>');
                            response.write(user.why + '</br>');

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
        response.contentType('txt');
        response.header('Access-Control-Allow-Origin', '*');
       
        Event.find(function (error, events) {
            var mongodb = require("mongodb"),
                config = require("../config.js"),
                mongoserver = new mongodb.Server(config.mongodb.url, config.mongodb.port, {}),
                connector = new mongodb.Db('profiles', mongoserver);

            events.sort(function(a,b) {
                if (a.date > b.date) return  1;
                if (a.date < b.date) return -1;
                return 0;
            });

            connector.open(function (error, db) {
                db.collection('profiles', function (error, collection) {
                    collection.find({}).toArray(function (error, users) {
                        var i;

                        function user (event) {
                            var j;
                            if (event.user) {
                                for (j in users) {
                                    if (event.user.toString() === users[j].user.toString()) {
                                        return users[j];
                                    }
                                }
                            }
                        }

                        for (i in events) {
                            if (user(events[i])) {
                                response.write('"' + events[i].label + '","' + events[i].app + '","' + events[i].source + '","' + events[i].user + '","' + events[i].date.getDate() + '/' + (events[i].date.getMonth() + 1) + '/' + events[i].date.getFullYear() + '","' + user(events[i]).role + '","' + user(events[i]).sector + '"\n');
                            } else {
                                response.write('"' + events[i].label + '","' + events[i].app + '","' + events[i].source + '","' + 'ip:' + events[i].ip + '","' + events[i].date.getDate() + '/' + (events[i].date.getMonth() + 1) + '/' + events[i].date.getFullYear() + '","deslogado","deslogado"\n');
                            }
                        }
                        response.end();
                    });
                });
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
