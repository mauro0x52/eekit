/** Company
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : Módulo que implementa as funcionalidades de company de tasks
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
     * @response : {categories[], fields[]}
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
                        newcompany.save(function (error) {
                            if (error) {
                                response.send({error : error});
                            } else {
                                response.send({categories : newcompany.categories, fields : newcompany.fields});
                            }
                        });
                    } else {
                        response.send({categories : oldcompany.categories, fields : oldcompany.fields});
                    }
                });
            }
        });
    });
}