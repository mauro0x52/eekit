/** Event
 * @author : Rafael Erthal
 * @since : 2013-01
 *
 * @description : Módulo que implementa as funcionalidades de evento
 */

module.exports = function (app) {
    var Model = require('./../model/Model.js'),
        tokens = require('../Utils.js').tokens,
        services = require('../Utils.js').services,
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

        require('restler').get('http://'+config.services.auth.url+':'+config.services.auth.port+'/validate', {
            data: {
                token  : request.param('token', null),
                secret : request.param('secret', null)
            }
        }).on('success', function(data) {
            if (data && data.user) {
                var newevent = new Event({
                    label     : request.param('label', null),
                    callback  : request.param('callback', null),
                    method    : request.param('method', null),
                    company   : data.company._id
                });
                newevent.save(function (error) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        response.send(null);
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

        tokens(request.param('token', null), function (error, data) {
            if (error) {
                response.send({error : error});
            } else if (data.tokens === null) {
                response.send({error : { message : 'service unauthorized', name : 'InvalidServiceError', path : 'service'}});
            } else {
                Event.find({label : request.param('label', null), company : data.company._id}, function (error, events) {
                    var i;
                    if (error) {
                        response.send({error : error});
                    } else {
                        services(function (error, services) {
                            if (error) {
                                response.send({error : error});
                            } else {
                                for (i in events) {
                                    var host = events[i].callback.match(/(http\:\/\/)?([a-zA-Z0-9\.\-]+)(\:([0-9]+))?/)[2],
                                        port = events[i].callback.match(/(http\:\/\/)?([a-zA-Z0-9\.\-]+)(\:([0-9]+))?/)[4],
                                        responseData = request.param('data', {});
                                    for (var service in services) {
                                        if (
                                            services[service].host.toString() === host.toString() &&
                                            services[service].port.toString() === port.toString()
                                        ) {
                                            for (var token in data.tokens) {
                                                if (
                                                    data.tokens[token].service === service &&
                                                    new Date(data.tokens[token].dateExpiration) > new Date()
                                                ) {
                                                    responseData.token = data.tokens[token].token;
                                                    require('restler').request(events[i].callback, {
                                                        method : events[i].method,
                                                        data   : responseData
                                                    });
                                                }
                                            }
                                        }
                                    }
                                }
                                response.send(null);
                            }
                        });
                    }
                });
            }
        })
    });

}
