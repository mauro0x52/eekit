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
     * @response : {categories[]}
     */
    params.app.post('/company', function (request,response) {
        var newcompany;

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        params.auth(request.param('token', null), function (error, data) {
            if (error) {
                response.send({error : error});
            } else {
                params.model.Company.findOne({company : data.company._id}, function (error, company) {
                    if (error) {
                        response.send({error : error});
                    } else if (company === null) {
                        newcompany = new params.model.Company({
                            company : data.company._id,
                            categories : [
                                {name : 'Geral', type : 'general', color : 'blue'},
                                {name : 'Reuniões', type : 'meetings', color : 'brown'},
                                {name : 'Finanças', type : 'finances', color : 'green'},
                                {name : 'Vendas', type : 'sales', color : 'olive'},
                                {name : 'Projetos', type : 'projects', color : 'cyan'},
                                {name : 'Pessoal', type : 'personals', color : 'navy'}
                            ]
                        });
                        newcompany.save(function (error) {
                            if (error) {
                                response.send({error : error});
                            } else {
                                response.send({categories : newcompany.categories});
                            }
                        });
                    } else {
                        response.send({categories : company.categories});
                    }
                });
            }
        });
    });
}