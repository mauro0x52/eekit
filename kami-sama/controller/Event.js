/** Event
 * @author : Rafael Erthal
 * @since : 2013-01
 *
 * @description : Módulo que implementa as funcionalidades de evento
 */

module.exports = function (app) {
    var Model = require('./../model/Model.js'),
        auth = require('../Utils.js').auth,
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

        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                newevent.user = user._id
                newevent.save(function (error) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        response.send({event : newevent});
                    }
                });
            }
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

        var data = request.param('data');

        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                Event.find({label : request.param('label', null), user : user._id, triggered : false}, function (error, events) {
                    var i,
                        request = require('request'),
                        query = '?' + require('querystring').stringify(data);

                    if (error) {
                        response.send({error : error});
                    } else {
                        for (i in events) {
                            request({
                                url    : events[i].callback + query,
                                method : events[i].method
                            });
                        }
                        response.send(null);
                    }
                });
            }
        });
    });

}
