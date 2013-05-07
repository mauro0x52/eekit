/** Thread
 * @author : Rafael Erthal
 * @since : 2013-04
 *
 * @description : Módulo que implementa as funcionalidades de thread do talk
 */

module.exports = function (params) {
    "use strict";

    /**
     * POST /thread
     *
     * @author : Rafael Erthal
     * @since  : 2013-04
     *
     * @description : cria nova thread
     *
     * @request : {token, embeddeds}
     * @response : {thread}
     */
    params.app.post('/thread', function (request,response) {
        var newthread;

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
                        newthread = new params.model.Thread({
                            talkers   : [{user : user._id, typing : false}],
                            messages  : [],
                            embeddeds : request.param('embeddeds', null)
                        });
                        newthread.save(function (error) {
                            if (error) {
                                response.send({error : error});
                            } else {
                                response.send({thread : newthread});
                            }
                        });
                    }
                });
            }
        });
    });

    /**
     * GET /threads
     *
     * @author : Rafael Erthal
     * @since  : 2013-04
     *
     * @description : retorna threads
     *
     * @request : {token}
     * @response : {[thread]}
     */
    params.app.get('/threads', function (request,response) {
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
                        params.model.Thread.find(function (error, threads) {
                            if (error) {
                                response.send({error : error});
                            } else {
                                response.send({threads : threads});
                            }
                        });
                    }
                });
            }
        });
    });

    /**
     * GET /thread/:id
     *
     * @author : Rafael Erthal
     * @since  : 2013-04
     *
     * @description : retorna thread
     *
     * @request : {token}
     * @response : {thread}
     */
    params.app.get('/thread/:id', function (request,response) {
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
                                response.send({thread : thread});
                            }
                        });
                    }
                });
            }
        });
    });

    /**
     * POST /thread/:id/talker
     *
     * @author : Rafael Erthal
     * @since  : 2013-04
     *
     * @description : adiciona usuário em thread
     *
     * @request : {token}
     * @response : {}
     */
    params.app.post('/thread/:id/talker', function (request,response) {
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
                                thread.talkers.push({user : user._id});
                                thread.save(function (error) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        response.send({thread : thread});
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