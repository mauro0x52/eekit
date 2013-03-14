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
                response.write('<table border="1">');
                response.write('<tr>');
                response.write('<td colspan="1"></td>');
                response.write('<td colspan="2">Aquisicao</td>');
                response.write('<td colspan="2">Ativacao</td>');
                response.write('<td colspan="1">Engajamento</td>');
                response.write('</tr>');
                response.write('<tr>');
                response.write('<td>Semana</td>');
                response.write('<td colspan="2">Novos usuarios do app</td>');
                response.write('<td colspan="2">Adicionaram 2 transações</td>');
                response.write('<td colspan="1">Adicionaram ou editaram 3 transações</td>');
                response.write('<td>Ativacao Total</td>');
                response.write('<td>Engajamento Total</td>');
                response.write('</tr>');
                for (var i in cohort) {
                    var users = cohort[i].filter([],1,utm),
		                activated = cohort[i].filter(['adicionar transação'],1, utm),
			            engaged = cohort[i].filter(['editar transação', 'adicionar transação'],3, utm);

                    response.write('<tr>');
                    response.write('<td>' + cohort[i].date.getDate() + '/' + (cohort[i].date.getMonth() + 1) + '/' + cohort[i].date.getFullYear() + '</td>');
                    response.write('<td>' + users + '</td>');
                    response.write('<td>' + (activated / users * 100).toFixed(2).toString().replace('NaN', '') + '%</td>');
                    response.write('<td>' + (activated) + '</td>');                    
                    response.write('<td>' + (engaged / activated * 100).toFixed(2).toString().replace('NaN', '') + '%</td>');
                    response.write('<td>' + (engaged) + '</td>');    
                    response.write('<td>' + (activated / users * 100).toFixed(2).toString().replace('NaN', '') + '%</td>');
                    response.write('<td>' + (engaged / users * 100).toFixed(2).toString().replace('NaN', '') + '%</td>');
                    response.write('</tr>');
                }
                response.write('</table><br />');

                response.write('<table border="1">');
                response.write('<tr>');
                response.write('<td colspan="' + (cohort.length + 1) + '">Retencao</td>');
                response.write('</tr>');
                response.write('<tr>');
                response.write('<td>Semana</td>');
        		for (var i = 0; i < cohort.length; i += 1) {
        		    response.write('<td>' + i + '</td>');
        		}
                response.write('</tr>');
                for (var i in cohort) {
                    var date = new Date(cohort[i].date);
                    response.write('<tr>');
                    response.write('<td>' + cohort[i].date.getDate() + '/' + (cohort[i].date.getMonth() + 1) + '/' + cohort[i].date.getFullYear() + '</td>');
                    while (date < new Date) {
                        response.write('<td>' + cohort[i].filter(['editar transação', 'adicionar transação'],3, utm, date) + '</td>')
                        date.setDate(date.getDate() + 14);
                    }
                    response.write('</tr>');
                }
                response.write('</table><br />');

                response.write('<table border="1">');
                response.write('<tr>');
                response.write('<td colspan="4">Resultado acumulado</td>');
                response.write('</tr>');
                response.write('<tr>');
                response.write('<td>Semana</td>');
                response.write('<td>Usuario cadastrados</td>');
                response.write('<td>Usuarios que continuam engajados</td>');
                response.write('<td>% de engajados</td>');
                response.write('</tr>');
                var count = 0;
                for (var i in cohort) {
                    var engaged = 0;
                    count += cohort[i].users.length;
                    for (var j = 0; j <= i; j += 1) {
                        engaged += cohort[j].filter(['editar transação', 'adicionar transação'],3, utm, cohort[i].date);
                    }
                    response.write('<tr>');
                    response.write('<td>' + cohort[i].date.getDate() + '/' + (cohort[i].date.getMonth() + 1) + '/' + cohort[i].date.getFullYear() + '</td>');
                    response.write('<td>' + count + '</td>');
                    response.write('<td>' + engaged + '</td>');
                    response.write('<td>' + (engaged / count * 100).toFixed(2) + '%</td>');
                    response.write('</tr>');
                }
                response.write('</table><br />');
                response.end();
            }
        });
    });
}
