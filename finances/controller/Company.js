/** Company
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : Módulo que implementa as funcionalidades de company de finances
 */

module.exports = function (params) {
    "use strict";

    /** POST /company
     *
     * @autor : Rafael Erthal
     * @since : 2012-09
     *
     * @description : Registra um usuário no serviço
     *
     * @request : {token}
     * @response : {categories[], accounts[]}
     */
    params.app.post('/company', function (request,response) {
        var newcompany;
        
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');
        
        params.auth(request.param('token', null), function (error, data) {
            if (error) {
                response.send({error : error});
            } else {
                params.model.Company.findOne({company : data.company._id}, function (error, oldcompany) {
                    if (error) {
                        response.send({error : error});
                    } else if (oldcompany === null) {
                        newcompany = new params.model.Company({
                            company : data.company._id,
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
                        newcompany.save(function (error) {
                            if (error) {
                                response.send({error : error});
                            } else {
                                response.send({categories : newcompany.categories, accounts : newcompany.accounts});
                            }
                        });
                    } else {
                        response.send({categories : oldcompany.categories, accounts : oldcompany.accounts});
                    }
                });
            }
        });
    });
}