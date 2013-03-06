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
     * @response : {categories[], fields[]}
     */
    app.post('/user', function (request,response) {
        var newuser;

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                User.findOne({user : user._id}, function (error, olduser) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        if (olduser === null) {
                            newuser = new User({
                                user : user._id,
                                categories : [
                                    {name : 'Cliente', type : 'clients', color : 'red'},
                                    {name : 'Negociação', type : 'clients', color : 'red'},
                                    {name : 'Potencial', type : 'clients', color : 'red'},
                                    {name : 'Ex-cliente', type : 'clients', color : 'red'},
                                    {name : 'Não-cliente', type : 'clients', color : 'red'},
                                    {name : 'Fornecedor', type : 'suppliers', color : 'green'},
                                    {name : 'Ex-fornecedor', type : 'suppliers', color : 'green'},
                                    {name : 'Parceiro', type : 'partners', color : 'gold'},
                                    {name : 'Revendedor', type : 'partners', color : 'gold'},
                                    {name : 'Amigos', type : 'personals', color : 'blue'},
                                    {name : 'Família', type : 'personals', color : 'blue'},
                                    {name : 'Trabalho', type : 'personals', color : 'blue'}
                                ]
                            });
                            newuser.save(function (error) {
                                if (error) {
                                    response.send({error : error});
                                } else {
                                    response.send({categories : newuser.categories, fields : newuser.fields});
                                }
                            });
                        } else {
                            response.send({categories : olduser.categories, fields : olduser.fields});
                        }
                    }
                });
            }
        });
    });
}