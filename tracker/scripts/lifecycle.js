var Statistic = require('../model/Model').Statistic,
    config = require('../config.js'),
    needle = require('needle'),
    today, oneDayAgo, twoDaysAgo;

today = new Date();
today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
oneDayAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
twoDaysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2);

console.log('Iniciando cron de LifeCycle');

/**
 * Pega as informações do usuário
 *
 * @author Mauro Ribeiro
 * @since  2013-06
 */
var findUser = function (user_id, cb) {
    var auth, token, found = false;
    /* procura o usuário do cara */
    needle.get('http://'+config.services.auth.url+':'+config.services.auth.port+'/user/' + user_id + '?secret=' + require('querystring').escape(config.security.secret),function (error, response, data) {
        if (error) {
            console.log(error);
        } else if (data && data.user && data.user.tokens && data.user.tokens.length > 0) {
            /* procura um token válido */
            for (var i in data.user.tokens) {
                if (new Date(data.user.tokens[i].dateExpiration) > new Date()) {
                    token = data.user.tokens[i];
                    found = true;
                    break;
                }
            }
            if (found) {
                cb({
                    _id : data.user._id,
                    name : data.user.name,
                    token : token.token
                });
            } else {
                console.log('usuário '+user_id+' sem token válido');
            }
        } else {
            console.log('usuário '+user_id+' sem token');
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
            service : 'tracker',
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
var mail = function (templateName, user) {
    if (templateName && templates[templateName]) {
        findUser(user, function (user) {
            var template = templates[templateName](user);
            sendMail({
                token : user.token,
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
     * lc ativacao 1t
     *
     * @author Mauro Ribeiro
     * @since  2013-06
     */
    lc_ativacao_1t : function (user) {
        var subject, name, html = '';

        subject = '2 dicas fáceis para organizar as suas tarefas na empresa';
        name = 'lc ativacao 1t';

        html += '<p>Olá '+user.name.split(' ')[0]+', tudo bem?</p>';
        html += '<p>Bem vindo ao EmpreendeKit!<br />Para te ajudar a continuar organizando as suas tarefas, separei 2 dicas:</p>';
        html += '<ol>';
        html += '<li>adicione uma tarefa que você tem que fazer hoje</li>';
        html += '<li>assim que terminar a tarefa, marque a tarefa como feita</li>';
        html += '</ol>';
        html += '<p>Recomendo que faça isso para suas 3 principais tarefas. Você já vai ver a diferença!</p>';
        html += '<p>Para acessar o EmpreendeKit e já aplicar as dicas, <a href=" http://www.empreendekit.com.br/tarefas?utm_source=eekit&utm_medium=email&utm_content=ativacao-1t&utm_campaign=lifecycle">clique aqui.</p>';
        html += '<p>Abraços,<br />Lucas</p>';

        return {
            subject : subject,
            html : html,
            name : name
        }
    },

    /**
     * lc engajamento 1t
     *
     * @author Mauro Ribeiro
     * @since  2013-06
     */
    lc_engajamento_1t : function (user) {
        var subject, name, html = '';

        subject = 'Agora falta pouco para se tornar um mestre da produtividade!';
        name = 'lc engajamento 1t';

        html += '<p>Olá '+user.name.split(' ')[0]+', tudo bem?</p>';
        html += '<p>Meus parabéns! Você já começou com o pé direito o uso do Empreendekit.</p>';
        html += '<p>O próximo passo é se tornar um mestre da produtividade!<br />Para isso, adicione mais tarefas e não se esqueça de marcá-las como feitas.<br />Medir seus avanços na semana é fundamental para aumentar sua produtividade.</p>';
        html += '<p>Para acessar o EmpreendeKit e já aplicar as dicas, <a href=" http://www.empreendekit.com.br/tarefas?utm_source=eekit&utm_medium=email&utm_content=engajamento-1t&utm_campaign=lifecycle">clique aqui.</p>';
        html += '<p>Se tiver alguma dúvida, é só me mandar um email =)</p>';
        html += '<p>Abraços,<br />Lucas</p>';

        return {
            subject : subject,
            html : html,
            name : name
        }
    },

    /**
     * lc ativacao 1c
     *
     * @author Mauro Ribeiro
     * @since  2013-06
     */
    lc_ativacao_1c : function (user) {
        var subject, name, html = '';

        subject = '2 dicas fáceis para cuidar dos prazos de seus clientes';
        name = 'lc ativacao 1c';

        html += '<p>Olá '+user.name.split(' ')[0]+', tudo bem?</p>';
        html += '<p>Bem vindo ao Empreendekit!<br />Para te ajudar a continuar organizando os seus contatos, separei 2 dicas:</p>';
        html += '<ol>';
        html += '<li>adicione um contato</li>';
        html += '<li>adicione uma tarefa no contato</li>';
        html += '</ol>';
        html += '<p>Recomendo que faça isso para seus 3 principais contatos. Você já vai ver a diferença!</p>';
        html += '<p>Para acessar o EmpreendeKit e já aplicar as dicas, é só <a href="http://www.empreendekit.com.br/contatos?utm_source=eekit&utm_medium=email&utm_content=ativacao-1c&utm_campaign=lifecycle">clicar aqui</a>.</p>';
        html += '<p>Abraços,<br />Lucas</p>';

        return {
            subject : subject,
            html : html,
            name : name
        }
    },

    /**
     * lc ativacao 1f
     *
     * @author Mauro Ribeiro
     * @since  2013-06
     */
    lc_ativacao_1f : function (user) {
        var subject, name, html = '';

        subject = 'O ultimo passo para sair da planilha';
        name = 'lc ativacao 1f';

        html += '<p>Olá '+user.name.split(' ')[0]+', tudo bem?</p>';
        html += '<p>Bem vindo ao Empreendekit!<br />Para te ajudar a sair da planilha do excel, separei 2 dicas:</p>';
        html += '<ol>';
        html += '<li>adicione as movimentações dessa próxima semana</li>';
        html += '<li>crie lembretes para as principais</li>';
        html += '</ol>';
        html += '<p>Assim você não se preocupa em esquecer de fazer pagamentos  ou cobranças e pode se dedicar mais a seus clientes.</p>';
        html += '<p>Para acessar o EmpreendeKit e já aplicar as dicas, é só <a href="http://www.empreendekit.com.br/financas?utm_source=eekit&utm_medium=email&utm_content=ativacao-1f&utm_campaign=lifecycle">clicar aqui</a>.</p>';
        html += '<p>Abraços,<br />Lucas</p>';

        return {
            subject : subject,
            html : html,
            name : name
        }
    },

    /**
     * lc geral 1
     *
     * @author Mauro Ribeiro
     * @since  2013-06
     */
    lc_geral_1 : function (user) {
        var subject, name, html = '';

        subject = 'Seu período de testes do EmpreendeKit acaba em 5 dias';
        name = 'lc geral 1';

        html += '<p>Olá '+user.name.split(' ')[0]+', tudo bem?</p>';
        html += '<p>Estou mandando este e-mail porque o seu período de testes do EmpreendeKit está terminando.</p>';
        html += '<p>Existe alguma forma em que eu possa te ajudar, ou sanar alguma dúvida?</p>';
        html += '<p>Abraços,<br />Lucas</p>';

        return {
            subject : subject,
            html : html,
            name : name
        }
    },

    /**
     * lc geral 2
     *
     * @author Mauro Ribeiro
     * @since  2013-06
     */
    lc_geral_2 : function (user) {
        var subject, name, html = '';

        subject = 'Fim do seu teste no EmpreendeKit';
        name = 'lc geral 2';

        html += '<p>Olá '+user.name.split(' ')[0]+', tudo bem?</p>';
        html += '<p>O seu período de testes acabou, mas não precisa ser assim!<br />Você pode ativar o EmpreendeKit fazendo o pagamento de R$59,90 mensais (que você só paga no mês que usar).</p>';
        html += '<p>Para isso, é só clicar no botão abaixo.</p>';
        html += '<br /><br /><!-- INICIO FORMULARIO BOTAO PAGSEGURO --><form target="pagseguro" action="https://pagseguro.uol.com.br/v2/pre-approvals/request.html" method="post"><!-- NÃO EDITE OS COMANDOS DAS LINHAS ABAIXO --><input type="hidden" name="code" value="4D1DC72FC7C7FF9FF4CD2F9A1B9DDB2B" /><input type="image" src="https://p.simg.uol.com.br/out/pagseguro/i/botoes/assinaturas/209x48-assinar-assina.gif" name="submit" alt="Pague com PagSeguro - é rápido, grátis e seguro!" /></form><!-- FINAL FORMULARIO BOTAO PAGSEGURO --><br /><br />';
        html += 'Se ainda tiver alguma dúvida e quiser falar conosco, é só me responder ou entrar em contato através de um dos canais abaixo, que ficaremos felizões de te atender. Eventualmente podemos até estender seu teste.<br />Você pode entrar em contato comigo por esse email, ou pelo telefone: (11) 3230-9233.';
        html += 'Se você quiser, também temos outros planos para períodos maiores com um desconto bacana.<br />Para acessar nossa página de planos, é só <a href=" http://www.empreendekit.com.br/ee/precos-e-planos?utm_source=eekit&utm_medium=email&utm_content=geral-2&utm_campaign=lifecycle">clicar aqui</a>.'
        html += '<p>Abraços,<br />Lucas</p>';

        return {
            subject : subject,
            html : html,
            name : name
        }
    }
}


/* -------------------------------------------------------------------------- */
/*                                                                            */
/* TAREFAS                                                                    */
/*                                                                            */
/* -------------------------------------------------------------------------- */
/* Usuários novos que cadastraram ontem no tarefas */
Statistic.find({
    'apps.tarefas.status' : 'new',
    'apps.ee.events.marcar: tarefas.totalCount' : {$gte : 1},
    'apps.tarefas.statusDate' : {
        $gte : oneDayAgo,
        $lt : today
    }
}, function (error, statistics) {
    if (error) {
        console.log(error)
    } else {
        for (var i in statistics) {
            mail('lc_ativacao_1t', statistics[i].user)
        }
    }
});

/* Usuário ativos um dia depois de terem ativado */
Statistic.find({
    'apps.tarefas.status' : 'active',
    'apps.contatos.status' : {$ne : 'active'},
    'apps.financas.status' : {$ne : 'active'},
    'apps.tarefas.statusDate' : {
        $gte : oneDayAgo,
        $lt : today
    }
}, function (error, statistics) {
    if (error) {
        console.log(error)
    } else {
        for (var i in statistics) {
            mail('lc_engajamento_1t', statistics[i].user)
        }
    }
});

/* -------------------------------------------------------------------------- */
/*                                                                            */
/* CONTATOS                                                                   */
/*                                                                            */
/* -------------------------------------------------------------------------- */
/* Galera que se cadastrou ontem no contatos e não ativou                     */
/* -------------------------------------------------------------------------- */
Statistic.find({
    'apps.contatos.status' : 'new',
    'apps.ee.events.marcar: contatos.totalCount' : {$gte : 1},
    'apps.contatos.statusDate' : {
        $gte : oneDayAgo,
        $lt : today
    }
}, function (error, statistics) {
    if (error) {
        console.log(error)
    } else {
        for (var i in statistics) {
            mail('lc_ativacao_1c', statistics[i].user)
        }
    }
});

/* -------------------------------------------------------------------------- */
/*                                                                            */
/* FINANÇAS                                                                   */
/*                                                                            */
/* -------------------------------------------------------------------------- */
/* Galera que se cadastrou 24h no finanças e não ativou                       */
/* -------------------------------------------------------------------------- */
Statistic.find({
    'apps.financas.status' : 'new',
    'apps.ee.events.marcar: finanças.totalCount' : {$gte : 1},
    'apps.financas.statusDate' : {
        $gte : oneDayAgo,
        $lt : today
    }
}, function (error, statistics) {
    if (error) {
        console.log(error)
    } else {
        for (var i in statistics) {
            mail('lc_ativacao_1f', statistics[i].user)
        }
    }
});

/* -------------------------------------------------------------------------- */
/* Email de pagamento 10 dias após o cadastro                                 */
/* -------------------------------------------------------------------------- */
Statistic.find({
    'signupDate' : {
        $gte : new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10),
        $lt : new Date(today.getFullYear(), today.getMonth(), today.getDate() - 9)
    }
}, function (error, statistics) {
    if (error) {
        console.log(error)
    } else {
        for (var i in statistics) {
            mail('lc_geral_1', statistics[i].user)
        }
    }
});

/* -------------------------------------------------------------------------- */
/* Email de pagamento 15 dias após o cadastro                                 */
/* -------------------------------------------------------------------------- */
Statistic.find({
    'signupDate' : {
        $gte : new Date(today.getFullYear(), today.getMonth(), today.getDate() - 15),
        $lt : new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14)
    }
}, function (error, statistics) {
    if (error) {
        console.log(error)
    } else {
        for (var i in statistics) {
            mail('lc_geral_2', statistics[i].user)
        }
    }
});
