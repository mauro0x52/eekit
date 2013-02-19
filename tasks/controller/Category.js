/** Category
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : Módulo que implementa as funcionalidades de categoria de tasks
 */

module.exports = function (app) {
    var Model = require('./../model/Model.js'),
        auth = require('../Utils.js').auth,
        UserCategory = Model.UserCategory;

    /** GET /categories
     *
     * @autor : Rafael Erthal
     * @since : 2012-09
     *
     * @description : Lista categorias de um usuário
     *
     * @allowedApp : Qualquer APP
     * @allowedUser : Logado
     *
     * @request : {token}
     * @response : {categories}
     */
    app.get('/categories', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');
        
        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                UserCategory.findOne({user : user._id}, function (error, userCategory) {
                    if (error) {
                        response.send({error : { message : 'user not found', name : 'NotFoundError', token : request.params.token, path : 'user'}});
                    } else {
                        if (userCategory === null) {
                            response.send({error : { message : 'user not found', name : 'NotFoundError', token : request.params.token, path : 'user'}});
                        } else {
                            response.send({categories : userCategory.categories});
                        }
                    }
                });
            }
        });
    });

    /** GET /category/:id
     *
     * @autor : Rafael Erthal
     * @since : 2012-09
     *
     * @description : Exibe categoria de um usuário
     *
     * @allowedApp : Qualquer APP
     * @allowedUser : Logado
     *
     * @request : {token}
     * @response : {category}
     */
    app.get('/category/:id', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');
        
        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                UserCategory.findOne({user : user._id}, function (error, userCategory) {
                    if (error) {
                        response.send({error : { message : 'user not found', name : 'NotFoundError', token : request.params.token, path : 'user'}});
                    } else {
                        if (userCategory === null) {
                            response.send({error : { message : 'user not found', name : 'NotFoundError', token : request.params.token, path : 'user'}});
                        } else {
                            userCategory.findCategory(request.params.id, function (error, category) {
                                if (error) {
                                    response.send({error : { message : 'category not found', name : 'NotFoundError', token : request.params.id, path : 'category'}});
                                } else {
                                    if (category === null) {
                                        response.send({error : { message : 'category not found', name : 'NotFoundError', token : request.params.id, path : 'category'}});
                                    } else {
                                        response.send({category : category});
                                    }
                                }
                            });
                        }
                    }
                });
            }
        });
    });
}