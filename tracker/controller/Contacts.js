/** Contacts
 * @author : Rafael Erthal
 * @since : 2013-01
 *
 * @description : Módulo que implementa o painel do tracker referente ao serviço contacts
 */

module.exports = function (app) {
    var Model = require('./../model/Model.js'),
        auth = require('../Utils.js').auth,
        Event = Model.Event;

    /** GET /events/contacts
     *
     * @autor : Rafael Erthal
     * @since : 2013-01
     *
     * @description : exibe painel do contacts
     *
     * @allowedApp : Qualquer APP
     * @allowedUser : Logado
     *
     * @request : {}
     * @response : {events}
     */
    app.get('/events/contacts', function (request,response) {
        var utm = {};

        if (request.param('utm_source', null)) {
            utm.source = request.param('utm_source', null);
        }

        if (request.param('utm_medium', null)) {
            utm.medium = request.param('utm_medium', null);
        }

        if (request.param('utm_content', null)) {
            utm.content = request.param('utm_content', null);
        }

        if (request.param('utm_campaign', null)) {
            utm.campaign = request.param('utm_campaign', null);
        }

        response.header('Access-Control-Allow-Origin', '*');

        Event.cohort('contatos', 7, function (error, cohort) {
            if (error) {
                response.send({error : error});
            } else {
                var result = [],
                    utms = [];

                for (var i in cohort) {
                    
                    for (var j in cohort[i].utms) {
                        utms.push(cohort[i].utms[j]);
                    }

                    var date = new Date(cohort[i].date);
                    var monitoring = [];
                    while (date <= new Date) {
                        monitoring.push(cohort[i].filter(['marcar tarefa como feita', 'adicionar transação'],2, utm, date))
                        date.setDate(date.getDate() + 7);
                    }
                    result.push({
                        date : cohort[i].date,
                        acquisition : [{
                            name  : 'Novos usuarios do app',
                            users : cohort[i].filter([],1,utm)
                        }],
                        activation : [{
                            name  : 'Adicionaram 1 tarefa ou transação',
                            users : cohort[i].filter(['adicionar tarefa', 'adicionar transação'],1, utm)
                        }],
                        engagement : [{
                            name  : 'Marcaram 2 tarefas como feitas ou adicionaram 2 transações',
                            users : cohort[i].filter(['marcar tarefa como feita', 'adicionar transação'],2, utm)
                        }],
                        monitoring : monitoring
                    });
                }

                response.render('../view/cohort', {cohort : result, utms : utms, anchor : 'contacts'});
            }
        });
    });
}
