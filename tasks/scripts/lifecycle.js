var model = require('../model/Model.js'),
    config = require('../config.js'),
    needle = require('needle'),
    today,
    nextWeek, previousWeek, prePreviousWeek,
    checkToken = require('../utils/auth'),
    weekDays;

today = new Date();
today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
nextWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
previousWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
prePreviousWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14);

weekDays = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

var mailThisWeek = function (auth, tasks) {
    var html = '',
        length, date,
        daysTasks, diff;

    daysTasks = new Array(7);
    for (var i = 0; i < 7; i++) {
        daysTasks[i] = new Array();
    }

    checkToken(auth.token, function (error, auth) {
        if (!error && auth) {
            /* monta o buffer ordenado por dia */
            for (var i in tasks) {
                diff = Math.ceil((tasks[i].dateDeadline.getTime() - today.getTime())/(1000*3600*24));
                daysTasks[diff].push(tasks[i]);
            }

            html += '<p>Olá '+auth.user.name.split(' ')[0]+'!</p>';
            html += '<p>Este é um relatório automático de tarefas do EmpreendeKit. Você o receberá toda segunda-feira para poder organizar melhor sua semana.<p>';
            html += '<br />';

            for (i = 0; i < 7; i++) {
                length = daysTasks[i].length;
                date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
                html += '<p style="font-weight:bold">'+weekDays[i]+' ('+date.getDate()+' de '+months[date.getMonth()]+' de '+date.getFullYear()+')</p>';
                html += '<ul>';
                if (length) {
                    for (var j = 0; j < length; j++) {
                        if (daysTasks[i][j].important) {
                            html += '<li>'+daysTasks[i][j].title+' <span style="font-style:italic;color:#a00;">(importante)</span></li>';
                        } else {
                            html += '<li>'+daysTasks[i][j].title+'</li>';
                        }
                    }
                } else {
                    html += '<li style="color:#888;font-style:italic;">nenhuma tarefa</li>';
                }
                html += '</ul>';
            }

            html += '<br />';
            html += '<p>Quer adicionar mais tarefas e organizar sua semana? <a href="http://www.empreendekit.com.br/?utm_source=eekit&utm_medium=email&utm_content=relatorio-tarefas&utm_campaign=lifecycle#!/tarefas">Clique aqui</a>.';

            /* manda email para o usuário */
            require('needle').post(
                'http://' + config.services.jaiminho.url + ':' + config.services.jaiminho.port + '/mail/self',
                {
                    token : auth.token,
                    service : 'tasks',
                    subject : 'Suas tarefas desta semana',
                    name : 'relatorio de tarefas',
                    html : html
                },
                function (error, response, data) {
                    if (error) {
                        console.log(error);
                    }
                }
            );

        }
    })
}
var mailPreviousWeek = function (auth) {
    var html = '', date;

    checkToken(auth.token, function (error, auth) {
        if (!error && auth) {
            html += '<p>Olá '+auth.user.name.split(' ')[0]+'!</p>';
            html += '<p>Este é um relatório automático de tarefas do EmpreendeKit. Você o receberá toda segunda-feira para poder organizar melhor sua semana.<p>';
            html += '<br />';

            for (var i = 0; i < 7; i++) {
                date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
                html += '<p style="font-weight:bold">'+weekDays[i]+' ('+date.getDate()+' de '+months[date.getMonth()]+' de '+date.getFullYear()+')</p>';
                html += '<ul>';
                html += '<li style="color:#888;font-style:italic;">nenhuma tarefa</li>';
                html += '</ul>';
            }

            html += '<br />';
            html += '<p>Quer adicionar mais tarefas e organizar sua semana? <a href="http://www.empreendekit.com.br/?utm_source=eekit&utm_medium=email&utm_content=relatorio-tarefas&utm_campaign=lifecycle#!/tarefas">Clique aqui</a>.'

            /* manda email para o usuário */
            require('needle').post(
                'http://' + config.services.jaiminho.url + ':' + config.services.jaiminho.port + '/mail/self',
                {
                    token : auth.token,
                    service : 'tasks',
                    subject : 'Suas tarefas desta semana',
                    name : 'relatorio de tarefas',
                    html : html
                },
                function (error, response, data) {
                    console.log(data)
                    if (error) {
                        console.log(error);
                    }
                }
            );

        }
    })
}

model.Auth.find().distinct('user._id', function (error, usersIds){
    for (var i in usersIds) {
        if (usersIds[i]) {
            /* procura o token mais novo */
            model.Auth.find().where('user._id', usersIds[i]).sort({expiration : -1}).exec(function (error, auths) {
                if (!error && auths.length > 0 && auths[0].user && auths[0].user._id) {
                    var auth = auths[0];
        console.log(auth.user._id);
                    /* tarefas para esta semana */
                    model.Task.find({
                        user : auth.user._id,
                        dateDeadline : {$gte : today, $lt : nextWeek}
                    },
                    null,
                    {
                        dateDeadline : 1,
                        priority : 1
                    },
                    function (error, tasks) {
                        if (!error && tasks && tasks.length > 0) {
                            mailThisWeek(auth, tasks);
                        } else {
                            /* cadastrou só semana passada */
                            model.Task.find({
                                user : auth.user._id,
                                done : false,
                                dateDeadline : {$gte : prePreviousWeek, $lt : today}
                            },
                            function (error, tasks) {
                                if (!error && tasks && tasks.length > 0) {
                                    mailPreviousWeek(auth);
                                }
                            });
                        }
                    });
                }
            });
        }
    }
});