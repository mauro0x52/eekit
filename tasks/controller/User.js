/** User
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : Módulo que implementa as funcionalidades de user de tasks
 */

module.exports = function (app) {
    var Model = require('./../model/Model.js'),
        auth = require('../Utils.js').auth,
        User = Model.User;

    /** POST /user
     *
     * @autor : Rafael Erthal
     * @since : 2012-09
     *
     * @description : Registra um usuário no serviço
     *
     * @request : {token}
     * @response : {categories[]}
     */
    app.post('/user', function (request,response) {
        var newuser;

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                User.findOne({user : user._id}, function (error, user) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        if (user === null) {
                            newuser = new User({
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
                            response.send({categories : user.categories});
                        }
                    }
                });
            }
        });
    });
}