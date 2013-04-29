/** Contacts
 * @author : Rafael Erthal
 * @since : 2013-01
 *
 * @description : Módulo que implementa o painel do tracker referente ao serviço contacts
 */

module.exports = function (params) {
    "use strict";

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
    params.app.get('/events/contacts', function (request,response) {
        if (request.param('secret', null) != 'tr4ck3r') {
            response.end();
            return;
        }

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

        params.model.Event.cohort('contatos', 7, function (error, cohort) {
            if (error) {
                response.send({error : error});
            } else {
                var result = [];

                for (var i in cohort) {

                    var date = new Date(cohort[i].date);
                    var monitoring = [];
                    while (date <= new Date) {
                        monitoring.push(cohort[i].filter(['visualizar: contatos'],1, utm, date))
                        date.setDate(date.getDate() + 7);
                    }

                    var engagement_1 = cohort[i].filter(['adicionar contato'], 3, utm),
                        engagement_2 = cohort[i].filter(['adicionar tarefa'], 1, utm),
                        engagement_3 = cohort[i].filter(['adicionar transação'], 1, utm),
                        engagement_4 = cohort[i].filter(['editar contato'], 1, utm),
                        engagement_result = [];

                    for (var j in engagement_1) {
                        engagement_result.push(engagement_1[j]);
                    }

                    for (var j in engagement_2) {
                        engagement_result.push(engagement_2[j]);
                    }

                    for (var j in engagement_3) {
                        engagement_result.push(engagement_3[j]);
                    }

                    for (var j in engagement_4) {
                        engagement_result.push(engagement_4[j]);
                    }

                    result.push({
                        date : cohort[i].date,
                        acquisition : [{
                            name  : 'Novos usuarios do app',
                            users : cohort[i].filter([],1,utm)
                        }],
                        activation : [{
                            name  : 'Começaram a adicionar contato',
                            users : cohort[i].filter(['clicar: adicionar contato'],1, utm)
                        },{
                            name  : 'Adicionaram 1 contato',
                            users : cohort[i].filter(['adicionar contato'],1, utm)
                        }],
                        engagement : [{
                            name  : 'Adicionaram 3 contatos ou adicionaram 1 tarefa ou adicionaram 1 transação ou editaram 1 contato',
                            users : engagement_result
                        }],
                        monitoring : monitoring
                    });
                }

                response.render('../view/cohort', {cohort : result});
            }
        });
    });
}
