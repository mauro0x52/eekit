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
        response.header('Access-Control-Allow-Origin', '*');

        Event.cohort('tarefas', 7, function (error, cohort) {
            if (error) {
                response.send({error : error});
            } else {
                response.write('<table border="1">');
                response.write('<tr>');
                response.write('<td colspan="1"></td>');
                response.write('<td colspan="2">Aquisicao</td>');
                response.write('<td colspan="6">Ativacao</td>');
                response.write('<td colspan="1">Engajamento</td>');
                response.write('</tr>');
                response.write('<tr>');
                response.write('<td>Semana</td>');
                response.write('<td colspan="2">Novos usuarios do app</td>');
                response.write('<td colspan="2">Adicionaram 1 tarefa</td>');
                response.write('<td colspan="2">Marcaram 1 tarefa como feita</td>');
                response.write('<td colspan="2">Marcaram 3 tarefas como feitas</td>');
                response.write('<td>Marcaram 5 tarefas como feitas</td>');
                response.write('<td>Ativacao Total</td>');
                response.write('<td>Engajamento Total</td>');
                response.write('</tr>');
                for (var i in cohort) {
                    var users = cohort[i].users.length,
		                taskAdder = cohort[i].filter(['adicionar tarefa'],1),
			            taskMarker1 = cohort[i].filter(['marcar tarefa como feita'],1),
			            taskMarker3 = cohort[i].filter(['marcar tarefa como feita'],3),
                        taskMarker5 = cohort[i].filter(['marcar tarefa como feita'],5) 

                    response.write('<tr>');
                    response.write('<td>' + cohort[i].date.getDate() + '/' + (cohort[i].date.getMonth() + 1) + '/' + cohort[i].date.getFullYear() + '</td>');
                    response.write('<td>' + users + '</td>');
                    response.write('<td>' + (taskAdder / users * 100).toFixed(2).toString().replace('NaN', '') + '%</td>');
                    response.write('<td>' + (taskAdder) + '</td>');                    
                    response.write('<td>' + (taskMarker1 / taskAdder * 100).toFixed(2).toString().replace('NaN', '') + '%</td>');
                    response.write('<td>' + (taskMarker1) + '</td>');                   
                    response.write('<td>' + (taskMarker3 / taskMarker1 * 100).toFixed(2).toString().replace('NaN', '') + '%</td>');
                    response.write('<td>' + (taskMarker3) + '</td>');                   
                    response.write('<td>' + (taskMarker5 / taskMarker3 * 100).toFixed(2).toString().replace('NaN', '') + '%</td>');
                    response.write('<td>' + (taskMarker5) + '</td>');
                    response.write('<td>' + (taskMarker3 / users * 100).toFixed(2).toString().replace('NaN', '') + '%</td>');
                    response.write('<td>' + (taskMarker5 / users * 100).toFixed(2).toString().replace('NaN', '') + '%</td>');
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
                        response.write('<td>' + cohort[i].filter(['marcar como feita'], 5, date) + '</td>')
                        date.setDate(date.getDate() + 7);
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
                        engaged += cohort[j].filter(['marcar como feita'], 5, cohort[i].date);
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
