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
 * Pega as informações do usuário
 *
 * @author Mauro Ribeiro
 * @since  2013-06
 */
var findUser = function (user_id, cb) {
    var auth;
    /* procura o auth do cara */
    model.Auth.find().where('user._id', user_id).sort({expiration : -1}).exec(function (error, auths) {
        if (error) {
            console.log(error);
        } else if (auths && auths.length > 0) {
            auth = auths[0];
            /* verifica o token no serviço auth */
            checkToken(auth.token, function (error, auth) {
                if (error) {
                    console.log(error);
                } else if (auth) {
                    cb(auth);
                }
            });
        }
    });
}

/**
 * Envia email
 *
 * @author Mauro Ribeiro
 * @since  2013-06
 */
var sendMail = function (data) {
    require('needle').post(
        'http://' + config.services.jaiminho.url + ':' + config.services.jaiminho.port + '/mail/self',
        {
            token : data.token,
            service : 'tasks',
            subject : data.subject,
            name : data.name,
            html : data.html,
            from : 'lucas@empreendemia.com.br'
        },
        function (error, response, data) {
            if (error) {
                console.log(error);
            }
        }
    );
}

/**
 * Monta e envia o email
 *
 * @author Mauro Ribeiro
 * @since  2013-06
 */
var mail = function (templateName, user_id) {
    if (templateName && templates[templateName]) {
        findUser(user_id, function (auth) {
            var template = templates[templateName](auth);
            sendMail({
                token : auth.token,
                html : template.html,
                subject : template.subject,
                name : template.name
            })
        });
    }
}

/**
 * Templates dos emails
 *
 * @author Mauro Ribeiro
 * @since  2013-06
 */
var templates = {

    /**
     * lc engajamento 1t
     * email enviado 1 dia depois da ativação
     *
     * @author Mauro Ribeiro
     * @since  2013-06
     */
    active1day : function (auth) {
        var subject, name, html = '';

        subject = 'Agora falta pouco para se tornar um mestre de produtividade!';
        name = 'lc engajamento 1t';

        html += '<p>Olá '+auth.user.name.split(' ')[0]+', tudo bem?</p>';
        html += '<p>Meus parabéns! Você já começou com o pé direito o uso do Empreendekit.</p>';
        html += '<p>O próximo passo é se tornar um mestre da produtividade!<br />Para isso, adicione mais tarefas e não se esqueça de marcá-las como feitas.<br />Medir seus avanços na semana é fundamental para aumentar sua produtividade.</p>';
        html += '<p>Para acessar o EmpreendeKit, <a href="http://www.empreendekit.com.br/tarefas?utm_source=eekit&utm_medium=email&utm_content=engajamento-4t&utm_campaign=lifecycle">clique aqui.</p>';
        html += '<p>Se tiver alguma dúvida, é só me mandar um email =)</p>';
        html += '<p>Abraços,<br />Lucas</p>';

        return {
            subject : subject,
            html : html,
            name : name
        }
    },

    /**
     * lc engajamento 4t
     * email enviado 4 dias depois da ativação
     *
     * @author Mauro Ribeiro
     * @since  2013-06
     */
    active4days : function (auth) {
        var subject, name, html = '';

        subject = 'Recursos legais do EmpreendeKit que você pode não ter visto ainda';
        name = 'lc engajamento 4t';

        html += '<p>Olá '+auth.user.name.split(' ')[0]+', tudo bem?</p>';
        html += '<p>Você chegou a ver nossos lembretes por email no EmpreendeKit?</p>';
        html += '<p>Enviaremos o lembrete diretamente para seu email para você não se preocupar mais em esquecer de fazer alguma tarefa.</p>';
        html += '<p>É só adicionar uma tarefa com data e clicar em "mais informações".<br/>Depois disso é só clicar no período que você deseja ser lembrado.</p>';
        html += '<p>Para acessar o EmpreendeKit e configurar seus lembretes, é só <a href="http://www.empreendekit.com.br/tarefas?utm_source=eekit&utm_medium=email&utm_content=engajamento-4t&utm_campaign=lifecycle">clicar aqui</a>.</p>';
        html += '<p>Abraços,<br />Lucas</p>';

        return {
            subject : subject,
            html : html,
            name : name
        }
    }
}




model.Statistic.find(function (error, statistics){
    if (error) {
        console.log(error)
    } else {
        var statistic, dateDiff, template;
        for (var i in statistics) {
            template = null;
            statistic = statistics[i];
            dateDiff = Math.ceil((today.getTime() - statistic.date.getTime())/(1000*3600*24));

            if (statistic.label === 'retained') {

            }
            else if (statistic.label === 'engaged') {
            }
            else if (statistic.label === 'active') {
                if (dateDiff === 1) {
                    template = 'active1day';
                } else if (dateDiff === 4) {
                    template = 'active4days';
                }
            }
            else {

            }

            if (template) {
                mail(template, statistic.user);
            }
        }
    }
});