/** User
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : Módulo que implementa as funcionalidades de user de tasks
 */

module.exports = function (app) {
    var Model = require('./../model/Model.js'),
        auth = require('../Utils.js').auth,
        UserCategory = Model.UserCategory;

    /** POST /user
     *
     * @autor : Rafael Erthal
     * @since : 2012-09
     *
     * @description : Registra um usuário no serviço
     *
     * @allowedApp : Qualquer APP
     * @allowedUser : Logado
     *
     * @request : {token}
     * @response : {categories}
     */
    app.post('/user', function (request,response) {
        var newuser;
        
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');
        
        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                UserCategory.findOne({user : user._id}, function (error, userCategory) {
                    if (error) {
                        newuser = new UserCategory({
                            user : user._id,
                            categories : [
                                {name : 'Geral'},
                                {name : 'Reuniões'},
                                {name : 'Finanças'},
                                {name : 'Vendas'},
                                {name : 'Projetos'}
                            ]
                        });
                        newuser.save(function (error) {
                            if (error) {
                                response.send({error : error});
                            } else {
                                response.send({categories : newuser.categories});
                            }
                        });
                    } else {
                        if (userCategory === null) {
                            newuser = new UserCategory({
                                user : user._id,
                                categories : [
                                    {name : 'Geral'},
                                    {name : 'Reuniões'},
                                    {name : 'Finanças'},
                                    {name : 'Vendas'},
                                    {name : 'Projetos'}
                                ]
                            });
                            newuser.save(function (error) {
                                if (error) {
                                    response.send({error : error});
                                } else {
                                    response.send({categories : newuser.categories});
                                }
                            });
                        } else {
                            response.send({categories : userCategory.categories});
                        }
                    }
                });
            }
        });
    });
}