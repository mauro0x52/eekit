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

        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                Event.find({label : request.param('label', null), user : user._id}, function (error, events) {
                    var i;

                    if (error) {
                        response.send({error : error});
                    } else {
                        for (i in events) {
                            require('restler').request(events[i].callback, {
                                method : events[i].method,
                                data   : {
                                    token  : ''/* PENSAR NESSA MERDA */,
                                    data : request.param('data')
                                }
                            });
                        }
                        response.send(null);
                    }
                });
            }
        });
    });

}
