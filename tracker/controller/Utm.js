/** Utm
 * @author : Rafael Erthal
 * @since : 2013-04
 *
 * @description : Módulo que implementa o painel do tracker referente ao gerenciamento de UTMs
 */

module.exports = function (app) {
    var Model = require('./../model/Model.js'),
        auth = require('../Utils.js').auth,
        Event = Model.Event;

    /** GET /events/utm
     *
     * @autor : Rafael Erthal
     * @since : 2013-04
     *
     * @description : exibe listagem de utms semanalmente
     *
     * @request : {}
     * @response : {events}
     */
    app.get('/events/utm', function (request,response) {
        if (request.param('secret', null) != 'tr4ck3r') {
            response.end();
            return;
        }
        
        response.header('Access-Control-Allow-Origin', '*');

        Event.cohort('ee', 7, function (error, cohort) {
            if (error) {
                response.send({error : error});
            } else {
                var result = []
                for (var i in cohort) {
                    var utms = [],
                        users = cohort[i].filter(['cadastrar'], 1);

                    for (var j in users) {
                        if (users[j].utm) {
                            utms.push(users[j].utm);
                        }
                    }
                    result.push({
                        date : cohort[i].date,
                        utms : utms
                    });
                }
                
                response.render('../view/utm', {cohort : result});
            }
        });
    });
}
