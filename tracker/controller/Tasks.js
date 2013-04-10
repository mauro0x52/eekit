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
                    var users = cohort[i].filter([],1,utm),
		                taskAdder = cohort[i].filter(['adicionar tarefa'],1,utm),
			            taskMarker1 = cohort[i].filter(['marcar tarefa como feita'],1,utm),
			            taskMarker3 = cohort[i].filter(['marcar tarefa como feita'],3,utm),
                        taskMarker5 = cohort[i].filter(['marcar tarefa como feita'],5,utm) 

                    response.write('<tr>');
                    response.write('<td>' + cohort[i].date.getDate() + '/' + (cohort[i].date.getMonth() + 1) + '/' + cohort[i].date.getFullYear() + '</td>');
                    response.write('<td onclick="console.log(\'' + ids(users) + '\')">' + users.length + '</td>');
                    response.write('<td>' + (taskAdder.length / users.length * 100).toFixed(2).toString().replace('NaN', '') + '%</td>');
                    response.write('<td onclick="console.log(\'' + ids(taskAdder) + '\')">' + (taskAdder.length) + '</td>');                    
                    response.write('<td>' + (taskMarker1.length / taskAdder.length * 100).toFixed(2).toString().replace('NaN', '') + '%</td>');
                    response.write('<td onclick="console.log(\'' + ids(taskMarker1) + '\')">' + (taskMarker1.length) + '</td>');                   
                    response.write('<td>' + (taskMarker3.length / taskMarker1.length * 100).toFixed(2).toString().replace('NaN', '') + '%</td>');
                    response.write('<td onclick="console.log(\'' + ids(taskMarker3) + '\')">' + (taskMarker3.length) + '</td>');                   
                    response.write('<td>' + (taskMarker5.length / taskMarker3.length * 100).toFixed(2).toString().replace('NaN', '') + '%</td>');
                    response.write('<td onclick="console.log(\'' + ids(taskMarker5) + '\')">' + (taskMarker5.length) + '</td>');
                    response.write('<td>' + (taskMarker3.length / users.length * 100).toFixed(2).toString().replace('NaN', '') + '%</td>');
                    response.write('<td>' + (taskMarker5.length / users.length * 100).toFixed(2).toString().replace('NaN', '') + '%</td>');
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
                        response.write('<td>' + cohort[i].filter(['marcar tarefa como feita'], 5, utm, date).length + '</td>')
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
                var users = 0;
                for (var i in cohort) {
                    var engaged = 0;
                    for (var j = 0; j <= i; j += 1) {
                        engaged += cohort[j].filter(['marcar tarefa como feita'], 5, utm, cohort[i].date).length;
                    }
                    users += cohort[i].filter([],1,utm).length;
                    response.write('<tr>');
                    response.write('<td>' + cohort[i].date.getDate() + '/' + (cohort[i].date.getMonth() + 1) + '/' + cohort[i].date.getFullYear() + '</td>');
                    response.write('<td>' + users + '</td>');
                    response.write('<td>' + engaged + '</td>');
                    response.write('<td>' + (engaged / users * 100).toFixed(2) + '%</td>');
                    response.write('</tr>');
                }
                response.write('</table><br />');
                response.end();
            }
        });
    });
}
