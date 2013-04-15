/** Tasks
 * @author : Rafael Erthal
 * @since : 2012-10
 *
 * @description : Módulo que implementa o painel do tracker referente ao serviço tasks
 */

module.exports = function (app) {
    var Model = require('./../model/Model.js'),
        auth = require('../Utils.js').auth,
        Event = Model.Event;

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
    app.get('/events/tasks', function (request,response) {
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

        Event.cohort('tarefas', 7, function (error, cohort) {
            if (error) {
                response.send({error : error});
            } else {
                var result = [];

                for (var i in cohort) {

                    var date = new Date(cohort[i].date);
                    var monitoring = [];
                    while (date <= new Date) {
                        monitoring.push(cohort[i].filter(['marcar tarefa como feita'], 3, utm, date))
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
                        },{
                            name  : 'Marcaram 1 tarefa como feita',
                            users : cohort[i].filter(['marcar tarefa como feita'],1, utm)
                        }],
                        engagement : [{
                            name  : 'Marcaram 3 tarefas como feitas',
                            users : cohort[i].filter(['marcar tarefa como feita'],3, utm)
                        }],
                        monitoring : monitoring
                    });
                }

                response.render('../view/cohort', {cohort : result});
            }
        });
    });
}
