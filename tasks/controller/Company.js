/** Company
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : Módulo que implementa as funcionalidades de company de tasks
 */

module.exports = function (app) {
    var Model = require('./../model/Model.js'),
        auth = require('../Utils.js').auth,
        Company = Model.Company;

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
    app.post('/company', function (request,response) {
        var newcompany,
            id;

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        auth(request.param('token', null), function (error, company) {
            if (error) {
                response.send({error : error});
            } else {
                id = company._id;
                Company.findOne({company : company._id}, function (error, company) {
                    if (error) {
                        response.send({error : error});
                    } else if (company === null) {
                        newcompany = new Company({
                            company : id,
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