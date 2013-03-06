/** User
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : Módulo que implementa as funcionalidades de user de finances
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
     * @response : {categories[], accounts[]}
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
                                    {name : 'Produto 1', type : 'credit'},
                                    {name : 'Produto 2', type : 'credit'},
                                    {name : 'Receitas Gerais', type : 'credit', editable : false},
                                    {name : 'Receita não operacional', type : 'credit'},
                                    {name : 'Vendas', type : 'credit'},
                                    {name : 'Aluguel', type : 'debt'},
                                    {name : 'Comissão', type : 'debt'},
                                    {name : 'Despesas gerais', type : 'debt', editable : false},
                                    {name : 'Divulgação', type : 'debt'},
                                    {name : 'Impostos', type : 'debt'},
                                    {name : 'Material de Escritório', type : 'debt'},
                                    {name : 'Salários', type : 'debt'},
                                    {name : 'Telefone e internet', type : 'debt'}
                                ],
                                accounts : [
                                    {name : 'Banco', initialBalance : 0},
                                    {name : 'Caixa', initialBalance : 0}
                                ]
                            });
                            newuser.save(function (error) {
                                if (error) {
                                    response.send({error : error});
                                } else {
                                    response.send({categories : newuser.categories, accounts : newuser.accounts});
                                }
                            });
                        } else {
                            response.send({categories : user.categories, accounts : user.accounts});
                        }
                    }
                });
            }
        });
    });
}