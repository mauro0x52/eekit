var model = require('../model/Model.js'),
    config = require('../config.js'),
    needle = require('needle'),
    today = new Date();

today = new Date(today.getFullYear(), today.getMonth(), today.getDate());

var message = function (auth, task) {
    var html = '';

    html += '<h1>' + task.title + '</h1>';
    html += '<p> ' + task.description + '</p>';
    html += '<p> <hr /></p>';
    html += '<p> Você está recebendo esse e-mail porque cadastrou um lembrete através do aplicativo <b>Tarefas</b> no Empreendekit. </p>';
    html += '<p> Para marcar essa tarefa como feita, adicionar novas tarefas e organizar seu dia-a-dia, clique <a href="http://' + config.services.www.url + ':' + config.services.www.port + '/#!/tarefas">aqui</a>. </p>';
    html += '<p>Abraços,<br/>Equipe Empreendekit</p>';

    /* manda email para o usuário */
    require('needle').post(
        'http://' + config.services.jaiminho.url + ':' + config.services.jaiminho.port + '/mail/self',
        {
            token : auth.token,
            service : 'tasks',
            subject : 'Lembrete: ' + task.title + ' - ' + task.dateDeadline.getDate() + '/' + (task.dateDeadline.getMonth() + 1) + '/' + task.dateDeadline.getFullYear(),
            name : 'lembrete',
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

model.Task.find({reminder : {$gt : 0}, dateDeadline : {$gte : today}}, function (error, tasks) {
    var i,
        now = today.getTime(),
        diff;

    for (i in tasks) {
        diff = (tasks[i].dateDeadline.getTime() - now)/(24*3600*1000);
        /* Verifica se esta no dia de mandar a mensagem */
        model.Auth.findOne({'user._id' : tasks[i].user}, function (error, auth) {
            if (!error && auth) {
                message(auth, tasks[i]);
            }
        })
    }
});
