var model = require('./model/Model.js'),
	config = require('./config.js'),
	Sendgrid = require('sendgrid'),
	sendgrid = new Sendgrid.SendGrid(config.sendgrid.username, config.sendgrid.password),
        Email = require('sendgrid').Email;

var message = function (task) {
    var mongodb = require("mongodb"),
        mongoserver = new mongodb.Server(config.mongodb.url, config.mongodb.port, {}),
        connector = new mongodb.Db('auth', mongoserver);

    connector.open(function (error, db) {
        db.collection('users', function (error, collection) {
            collection.find({_id : task.user}).toArray(function (error, users) {
				var html = '', email;

				html += '<b>' + task.title + '</b>';
				html += '<p> ' + task.description + '</p>';
				html += '<p> <hr /></p>';
				html += '<p> Você está recebendo esse e-mail porque cadastrou um lembrete através do aplicativo <b>Tarefas</b> no Empreendekit. </p>';
				html += '<p> Para marcar essa tarefa como feita, adicionar novas tarefas e organizar seu dia-a-dia, clique <a href="http://' + config.services.www.url + ':' + config.services.www.port + '/#!/tarefas">aqui</a>. </p>';
				html += '<p>Abraços,<br/>Equipe Empreendekit</p>';

                                email = new Email({
					to: users[0].username,
					subject: 'Lembrete: ' + task.title + ' - ' + task.dateDeadline.getDate() + '/' + (task.dateDeadline.getMonth() + 1) + '/' + task.dateDeadline.getFullYear(),
					from: 'EmpreendeKit<atendimento@empreendekit.com.br>',
					html: html
                                });
                                email.setCategory('eekit tarefas: lembrete');
                                sendgrid.send(email);

            });
        });
    });
}

model.Task.find(function (error, tasks) {
	var i,
		now = new Date().getTime(),
		diff;

	for (i in tasks) {
		if ((tasks[i].reminder || tasks[i].reminder === 0) && tasks[i].dateDeadline) {
			diff = (tasks[i].dateDeadline.getTime() - now)/(24*3600*1000);
			/* Verifica se esta no dia de mandar a mensagem */
			if (diff > tasks[i].reminder - 1 && diff < tasks[i].reminder) {
				message(tasks[i]);
			}
		}
	}
});
