/** Tasks
 * @author : Rafael Erthal
 * @since : 2012-10
 *
 * @description : Módulo que implementa o painel do tracker referente ao serviço tasks
 */

module.exports = function (params) {
    "use strict";

    /** GET /events/tasks
     *
     * @autor : Rafael Erthal
     * @since : 2012-12
     *
     * @description : exibe painel do tasks
     *
     * @allowedApp : Qualquer APP
     * @allowedUser : Logado
     *
     * @request : {}
     * @response : {events}
     */
    params.app.get('/events/tasks', function (request,response) {
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

        params.model.Event.cohort('tarefas', 7, function (error, cohort) {
            if (error) {
                response.send({error : error});
            } else {
                var result = [];

                for (var i in cohort) {

                    var date = new Date(cohort[i].date);
                    var monitoring = [];
                    while (date <= new Date) {
                        monitoring.push(cohort[i].filter(['adicionar tarefa'], 3, utm, date))
                        date.setDate(date.getDate() + 7);
                    }
                    result.push({
                        date : cohort[i].date,
                        acquisition : [{
                            name  : 'Novos usuarios do app',
                            users : cohort[i].filter([],1,utm)
                        }],
                        activation : [{
                            name  : 'Começaram a adicionar tarefa',
                            users : cohort[i].filter(['clicar: adicionar tarefa'],1, utm)
                        },{
                            name  : 'Adicionaram 1 tarefa',
                            users : cohort[i].filter(['adicionar tarefa'],1, utm)
                        }],
                        engagement : [{
                            name  : 'Adicionaram 3 tarefas',
                            users : cohort[i].filter(['adicionar tarefa'],3, utm)
                        }],
                        monitoring : monitoring
                    });
                }

                response.render('../view/cohort', {cohort : result});
            }
        });
    });
}
