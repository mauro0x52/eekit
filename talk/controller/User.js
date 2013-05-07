/** User
 * @author : Rafael Erthal
 * @since : 2013-04
 *
 * @description : Módulo que implementa as funcionalidades de usuário do talk
 */

module.exports = function (params) {
    "use strict";

    /**
     * POST /user
     *
     * @author : Rafael Erthal
     * @since  : 2013-04
     *
     * @description : Insere usuário no talk
     *
     * @request : {token, alias}
     * @response : {user, company, alias, session}
     */
    params.app.post('/user', function (request,response) {
        var newuser;

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        params.auth(request.param('token', null), function (error, data) {
            if (error) {
                newuser = new params.model.User({
                    session : request.connection.remoteAddress,
                    alias   : request.param('alias', null)
                });
                newuser.save(function (error) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        response.send({user : newuser});
                    }
                });
            } else {
                params.model.User.findOne({user : data.user._id}, function (error, user) {
                    if (error) {
                        response.send({error : error});
                    } else if (user === null) {
                        newuser = new params.model.User({
                            user    : data.user._id,
                            company : data.company._id,
                            alias   : request.param('alias', null)
                        });
                        newuser.save(function (error) {
                            if (error) {
                                response.send({error : error});
                            } else {
                                response.send({user : newuser});
                            }
                        });
                    } else {
                        response.send({user : user});
                    }
                });
            }
        });
    });
}