/** WWW
 * @author : Rafael Erthal
 * @since : 2013-03
 *
 * @description : Módulo que implementa o painel do tracker referente ao serviço www
 */

module.exports = function (app) {
    var Model = require('./../model/Model.js'),
        auth = require('../Utils.js').auth,
        Event = Model.Event;

    /** GET /events/contacts
     *
     * @autor : Rafael Erthal
     * @since : 2013-03
     *
     * @description : exibe painel do www
     *
     * @allowedApp : Qualquer APP
     * @allowedUser : Logado
     *
     * @request : {}
     * @response : {events}
     */
    app.get('/events/www', function (request,response) {
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


        Event.cohort('ee', 7, function (error, cohort) {
            if (error) {
                response.send({error : error});
            } else {
                response.write('<table border="1">');
                response.write('<tr>');
                response.write('<td></td>');
                response.write('<td>Novas visitas</td>');
                response.write('<td colspan="10">Cadastro</td>');
                response.write('<td colspan="2">Onboarding</td>');
                response.write('</tr>');
                response.write('<tr>');
                response.write('<td>Semana</td>');
                response.write('<td>Novas visitas</td>');
                response.write('<td>Inicio</td>');
                response.write('<td>Nome</td>');
                response.write('<td>Sobrenome</td>');
                response.write('<td>Telefone</td>');
                response.write('<td>Email</td>');
                response.write('<td>Confirmar Email</td>');
                response.write('<td>Senha</td>');
                response.write('<td>Confirmar Senha</td>');
                response.write('<td>Expectativa</td>');
                response.write('<td>Finalizar Cadastro</td>');
                response.write('</tr>');
                for (var i in cohort) {
                    var users = cohort[i].filter([],1,utm),
                        view_home = cohort[i].filter(['visualizar home'],1,utm),
                        insert_beggin = cohort[i].filter(['cadastrar: inicio'],1,utm),
                        insert_name = cohort[i].filter(['cadastrar: nome'],1,utm),
                        insert_surname = cohort[i].filter(['cadastrar: sobrenome'],1,utm),
                        insert_phone = cohort[i].filter(['cadastrar: telefone'],1,utm),
                        insert_email = cohort[i].filter(['cadastrar: email'],1,utm),
                        insert_emailconfirmation = cohort[i].filter(['cadastrar: email-2'],1,utm),
                        insert_password = cohort[i].filter(['cadastrar: senha'],1,utm),
                        insert_passwordconfirmation = cohort[i].filter(['cadastrar: senha-2'],1,utm),
                        insert_expectation = cohort[i].filter(['cadastrar: expectativa'],1,utm),
                        insert_end = cohort[i].filter(['cadastrar'],1,utm),
                        insert_end = cohort[i].filter(['cadastrar'],1,utm),
                        choose = cohort[i].filter(['marcar: contatos', 'marcar: finanças', 'marcar: tarefas'],1,utm),
                        confirm = cohort[i].filter(['ir para app: contatos', 'ir para app: finanças', 'ir para app: tarefas'],1,utm);

                    response.write('<tr>');
                    response.write('<td>' + cohort[i].date.getDate() + '/' + (cohort[i].date.getMonth() + 1) + '/' + cohort[i].date.getFullYear() + '</td>');
                    response.write('<td onclick="console.log(\'' + ids(view_home) + '\')">' + view_home.length + '</td>');
                    response.write('<td onclick="console.log(\'' + ids(insert_beggin) + '\')">' + insert_beggin.length + '</td>');
                    response.write('<td onclick="console.log(\'' + ids(insert_name) + '\')">' + insert_name.length + '</td>');
                    response.write('<td onclick="console.log(\'' + ids(insert_surname) + '\')">' + insert_surname.length + '</td>');
                    response.write('<td onclick="console.log(\'' + ids(insert_phone) + '\')">' + insert_phone.length + '</td>');
                    response.write('<td onclick="console.log(\'' + ids(insert_email) + '\')">' + insert_email.length + '</td>');
                    response.write('<td onclick="console.log(\'' + ids(insert_emailconfirmation) + '\')">' + insert_emailconfirmation.length + '</td>');
                    response.write('<td onclick="console.log(\'' + ids(insert_password) + '\')">' + insert_password.length + '</td>');
                    response.write('<td onclick="console.log(\'' + ids(insert_passwordconfirmation) + '\')">' + insert_passwordconfirmation.length + '</td>');
                    response.write('<td onclick="console.log(\'' + ids(insert_expectation) + '\')">' + insert_expectation.length + '</td>');
                    response.write('<td onclick="console.log(\'' + ids(insert_end) + '\')">' + insert_end.length + '</td>');
                    response.write('<td onclick="console.log(\'' + ids(choose) + '\')">' + choose.length + '</td>');
                    response.write('<td onclick="console.log(\'' + ids(confirm) + '\')">' + confirm.length + '</td>');
                    response.write('</tr>');
                }
                response.write('</table><br />');

                response.end();
            }
        });
    });
}
