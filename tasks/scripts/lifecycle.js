var model = require('../model/Model.js'),
    config = require('../config.js'),
    needle = require('needle'),
    today, oneDay, twoDays, threeDays,
    checkToken = require('../utils/auth');

today = new Date();
today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
oneDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
twoDays = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2);
threeDays = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3);

/**
 * lc engajamento 1t
 * email enviado 1 dia depois da ativação
 *
 * @author Mauro Ribeiro
 * @since  2013-06
 */
var oneDayActivation = function (user_id) {
    var html = '';

    /* procura o auth do cara */
    model.Auth.find().where('user._id', user_id).sort({expiration : -1}).exec(function (error, auths) {
        if (!error && auths && auths.length > 0) {
            /* verifica o token no serviço auth */
            checkToken(auth.token, function (error, auth) {
                if (!error && auth) {
                    html += '<p>Olá '+auth.user.name.split(' ')[0]+'!</p>';
                    html += '<p>Meus parabéns! Você já começou com o pé direito o uso do Empreendekit.</p>';
                    html += '<p>O próximo passo é se tornar um mestre da produtividade!<br />Para isso, adicione mais tarefas e não se esqueça de marcá-las como feitas.<br />Medir seus avanços na semana é fundamental para aumentar sua produtividade.</p>';
                    html += '<p>Para acessar o EmpreendeKit, clique aqui.</p>';
                    html += '<p>Se tiver alguma dúvida, é só me mandar um email =)</p>';
                    html += '<p>Abraços, Lucas</p>';

                    /* manda email para o usuário */
                    require('needle').post(
                        'http://' + config.services.jaiminho.url + ':' + config.services.jaiminho.port + '/mail/self',
                        {
                            token : auth.token,
                            service : 'tasks',
                            subject : 'Agora falta pouco para se tornar um mestre da produtividade!',
                            name : 'lc engajamento 1t',
                            html : html,
                            from : 'lucas@empreendemia.com.br'
                        },
                        function (error, response, data) {
                            if (error) {
                                console.log(error);
                            }
                        }
                    );

                }
            });
        }
    });
}



model.Statistic.find(function (error, statistics){
    var statistic, dateDiff;
    for (var i in statistics) {
        statistic = statistics[i];
        dateDiff = Math.ceil((today.getTime() - statistic.date.getTime())/(1000*3600*24));
        if (statistic.label === 'retained') {
            
        }
        else if (statistic.label === 'engaged') {
            if (dateDiff === 1) {
                oneDayActivation(statistic.user);
            }
        }
        else if (statistic.label === 'active') {

        }
        else {

        }
    }
});