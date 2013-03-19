/** Event
 * @author : Rafael Erthal
 * @since : 2013-01
 *
 * @description : Módulo que implementa as funcionalidades de evento
 */

module.exports = function (app) {
    var Model = require('./../model/Model.js'),
        auth = require('../Utils.js').auth,
        config = require('../config.js'),
        Event = Model.Event;

    /** POST /bind
     *
     * @autor : Rafael Erthal
     * @since : 2013-01
     *
     * @description : Cadastrar evento
     *
     * @allowedApp : Qualquer APP
     * @allowedUser : Logado
     *
     * @request : {label, callback, method, token}
     * @response : {event}
     */
    app.post('/bind', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        var newevent = new Event({
                label       : request.param('label', null),
                callback    : request.param('callback', null),
                method      : request.param('method', null)
            });

        require('restler').get('http://'+config.services.auth.url+':'+config.services.auth.port+'/validate', {
            data: {
                token  : request.param('token', null),
                secret : request.param('secret', null)
            }
        }).on('success', function(data) {
            if (data.user) {
                newevent.user = data.user._id
                newevent.save(function (error) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        response.send({event : newevent});
                    }
                });
            } else {
                response.send({error : data.error});
            }
        }).on('error', function(error) {
            response.send({error : error});
        });
    });

    /** POST /trigger
     *
     * @autor : Rafael Erthal
     * @since : 2013-01
     *
     * @description : Dispara evento
     *
     * @allowedApp : Qualquer APP
     * @allowedUser : Logado
     *
     * @request : {label, token, data}
     * @response : {event}
     */
    app.post('/trigger', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        require('restler').get('http://'+config.services.auth.url+':'+config.services.auth.port+'/validate', {
            data: {
                token  : request.param('token', null),
                secret : request.param('secret', null)
            }
        }).on('success', function(data) {
            if (data.user) {
                var user = data.user;
                require('restler').get('http://'+config.services.auth.url+':'+config.services.auth.port+'/services').on('success', function (data) {
                    if (data.services) {
                        var services = data.services;
                        require('restler').get('http://'+config.services.auth.url+':'+config.services.auth.port+'/users', {
                            data : {secret : config.security.secret}
                        }).on('success', function (data) {
                            if (data.users) {
                                for (var i in data.users) {
                                    if (data.users[i]._id === user._id) {
                                        user = data.users[i];
                                    }
                                }
                                Event.find({label : request.param('label', null), user : user._id}, function (error, events) {
                                    var i;

                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        for (i in events) {
                                            var host = events[i].callback.match(/(http\:\/\/)?([a-zA-Z0-9\.\-]+)(\:([0-9]+))?/)[2],
                                                port = events[i].callback.match(/(http\:\/\/)?([a-zA-Z0-9\.\-]+)(\:([0-9]+))?/)[4],
                                                data = request.param('data', {}),
                                                token;

                                            for (var l in services) {
                                                if (services[l].host.toString() === host.toString() && services[l].port.toString() === port.toString()) {
                                                    for (var j in user.auths) {
                                                        if (user.auths[j].service === l) {
                                                            for (var k in user.auths[j].tokens) {
                                                                if ((new Date() - new Date(user.auths[j].tokens[k].dateUpdated))/(1000*60*60*24) < 30) {
                                                                    token = user.auths[j].tokens[k].token;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }

                                            data.token = token;

                                            require('restler').request(events[i].callback, {
                                                method : events[i].method,
                                                data   : data
                                            });
                                        }
                                        response.send(null);
                                    }
                                });
                            }
                        });
                    }
                });
            } else {
                response.send({error : data.error});
            }
        }).on('error', function(error) {
            response.send({error : error});
        });
    });

}
