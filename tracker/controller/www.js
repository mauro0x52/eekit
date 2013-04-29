/** WWW
 * @author : Rafael Erthal
 * @since : 2013-03
 *
 * @description : Módulo que implementa o painel do tracker referente ao serviço www
 */

module.exports = function (params) {
    "use strict";

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
    params.app.get('/events/www', function (request,response) {
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


        params.model.Event.cohort('ee', 7, function (error, cohort) {
            if (error) {
                response.send({error : error});
            } else {
                var result = [];

                for (var i in cohort) {
                    var activated = [];

                    for (var j in cohort[i].users) {
                        if (
                            (
                                cohort[i].users[j].utm.source === utm.source ||
                                !utm.source
                            ) && (
                                cohort[i].users[j].utm.medium === utm.medium ||
                                !utm.medium
                            ) && (
                                cohort[i].users[j].utm.content === utm.content ||
                                !utm.content
                            ) && (
                                cohort[i].users[j].utm.campaign === utm.campaign ||
                                !utm.campaign
                            ) && (
                                cohort[i].users[j].ocurrences('tarefas', ['marcar tarefa como feita']) >= 1 ||
                                cohort[i].users[j].ocurrences('finanças', ['adicionar transação']) >= 2 ||
                                cohort[i].users[j].ocurrences('contatos', ['adicionar tarefa', 'adicionar transação']) >= 1
                            )
                        ) {
                            activated.push(cohort[i].users[j])
                        }
                    }
                    result.push({
                        date : cohort[i].date,
                        acquisition : [{
                            name  : 'Novas visitas',
                            users : cohort[i].filter([],1,utm)
                        }],
                        activation : [{
                            name  : 'Inicio',
                            users : cohort[i].filter(['visualizar: cadastro '],1, utm)
                        },{
                            name  : 'Nome',
                            users : cohort[i].filter(['cadastrar: nome'],1, utm)
                        },{
                            name  : 'Empresa',
                            users : cohort[i].filter(['cadastrar: empresa'],1, utm)
                        },{
                            name  : 'Telefone',
                            users : cohort[i].filter(['cadastrar: telefone'],1, utm)
                        },{
                            name  : 'Email',
                            users : cohort[i].filter(['cadastrar: email'],1, utm)
                        },{
                            name  : 'Senha',
                            users : cohort[i].filter(['cadastrar: senha'],1, utm)
                        },,{
                            name  : 'Finalizou',
                            users : cohort[i].filter(['cadastrar'],1, utm)
                        },{
                            name  : 'Marcar',
                            users : cohort[i].filter(['marcar: contatos', 'marcar: finanças', 'marcar: tarefas'],1,utm)
                        },{
                            name  : 'Confirmar',
                            users : cohort[i].filter(['ir para app: contatos', 'ir para app: finanças', 'ir para app: tarefas'],1,utm)
                        },{
                            name  : 'Ativado em App',
                            users : activated
                        }],
                        engagement : [{
                            name  : '',
                            users : []
                        }],
                        monitoring : []
                    });
                }

                response.render('../view/cohort', {cohort : result});
            }
        });
    });
}
