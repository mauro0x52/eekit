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
    app.get('/events/finances', function (request,response) {
        var utm = {};

        function ids (obj) {
            res = ''
            for (var i in obj) {
                if (obj[i].events[0])
                res += obj[i].events[0].user + ', ';
            }
            return res;
        }

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

        Event.cohort('finanças', 14, function (error, cohort) {
            if (error) {
                response.send({error : error});
            } else {
                var result = [];

                for (var i in cohort) {
                    var date = new Date(cohort[i].date);
                    var monitoring = [];
                    while (date <= new Date) {
                        monitoring.push(cohort[i].filter(['editar transação', 'adicionar transação'],3, utm, date))
                        date.setDate(date.getDate() + 14);
                    }
                    result.push({
                        date : cohort[i].date,
                        acquisition : [{
                            name  : 'Novos usuarios do app',
                            users : cohort[i].filter([],1,utm)
                        }],
                        activation : [{
                            name  : 'Adicionaram 2 transações',
                            users : cohort[i].filter(['adicionar transação'],2, utm)
                        }],
                        engagement : [{
                            name  : 'Adicionaram ou editaram 3 transações',
                            users : cohort[i].filter(['editar transação', 'adicionar transação'],3, utm)
                        }],
                        monitoring : monitoring
                    });
                }

                response.render('../view/cohort', {cohort : result});
            }
        });
    });
}
