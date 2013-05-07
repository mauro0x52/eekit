/** Message
 * @author : Rafael Erthal
 * @since : 2013-04
 *
 * @description : Módulo que implementa as funcionalidades de mensagem do talk
 */

module.exports = function (params) {
    "use strict";

    /**
     * POST /thread/:id/message
     *
     * @author : Rafael Erthal
     * @since  : 2013-04
     *
     * @description : envia mensagem para thread
     *
     * @request : {token, message}
     * @response : {}
     */
    params.app.post('/thread/:id/message', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        params.auth(request.param('token', null), function (error, data) {
            if (error) {
                response.send({error : error});
            } else {
                params.model.User.findOne({user : data.user._id}, function (error, user) {
                    if (error) {
                        response.send({error : { message : 'user not found', name : 'NotFoundError', token : request.params.token, path : 'user'}});
                    } else if (user === null) {
                        response.send({error : { message : 'user not found', name : 'NotFoundError', token : request.params.token, path : 'user'}});
                    } else {
                        params.model.Thread.findOne({_id : request.params.id}, function (error, thread) {
                            var found = false;
                            if (error) {
                                response.send({error : { message : 'thread not found', name : 'NotFoundError', token : request.params._id, path : 'thread'}});
                            } else if (thread === null) {
                                response.send({error : { message : 'thread not found', name : 'NotFoundError', token : request.params._id, path : 'thread'}});
                            } else {
                                for (var i in thread.talkers) {
                                    if (thread.talkers[i].user && thread.talkers[i].user.toString() === user._id.toString()) {
                                        found = true;
                                    }
                                }
                                if (!found) {
                                    thread.talkers.push({user : user._id});
                                }
                                thread.messages.push({
                                    message : request.param('message', null),
                                    date    : new Date(),
                                    sender  : user._id,
                                    readers : []
                                });
                                thread.save(function (error) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        response.send({message : thread.messages.pop()});
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    });

    /**
     * GET /thread/:id/messages
     *
     * @author : Rafael Erthal
     * @since  : 2013-04
     *
     * @description : retorna mensagens da thread
     *
     * @request : {token}
     * @response : {[message]}
     */
    params.app.get('/thread/:id/messages', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        params.auth(request.param('token', null), function (error, data) {
            if (error) {
                response.send({error : error});
            } else {
                params.model.User.findOne({user : data.user._id}, function (error, user) {
                    if (error) {
                        response.send({error : { message : 'user not found', name : 'NotFoundError', token : request.params.token, path : 'user'}});
                    } else if (user === null) {
                        response.send({error : { message : 'user not found', name : 'NotFoundError', token : request.params.token, path : 'user'}});
                    } else {
                        params.model.Thread.findOne({_id : request.params.id}, function (error, thread) {
                            if (error) {
                                response.send({error : { message : 'thread not found', name : 'NotFoundError', token : request.params._id, path : 'thread'}});
                            } else if (thread === null) {
                                response.send({error : { message : 'thread not found', name : 'NotFoundError', token : request.params._id, path : 'thread'}});
                            } else {
                                response.send({messages : thread.messages});
                            }
                        });
                    }
                });
            }
        });
    });
}