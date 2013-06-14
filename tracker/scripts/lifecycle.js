var Event = require('../model/Model').Event,
    config = require('../config.js'),
    needle = require('needle');

console.log('Iniciando cron de LifeCycle');

/**
 * Pega as informações do usuário
 *
 * @author Mauro Ribeiro
 * @since  2013-06
 */
var findUser = function (user, cb) {
    var auth, token, found = false;
    /* procura o usuário do cara */
    needle.get('http://'+config.services.auth.url+':'+config.services.auth.port+'/user/' + user.id + '?secret=' + require('querystring').escape(config.security.secret),function (error, response, data) {
        if (error) {
            console.log(error);
        } else if (data && data.user && data.user.tokens && data.user.tokens.length > 0) {
            /* procura um token válido */
            for (var i in data.user.tokens) {
                if (data.user.tokens[i].dateExpiration > new Date()) {
                    token = data.user.tokens[i];
                    found = true;
                    break;
                }
            }
            if (found) {
                cb({
                    _id : user._id,
                    name : user.name,
                    token : token
                });
            } else {
                console.log('usuário sem token');
            }
        } else {
            console.log('usuário sem token');
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
 * Verifica quais usuários passam pelos critérios
 *
 * @author Mauro Ribeiro
 * @since  2013-06
 */
var filterUsersByEvents = function (days, required, forbidden, cb) {
    Event.signupUsersIds(days, function(error, users_ids) {
        if (error) {
            cb(error)
        } else {
            Event.groupByUserFilter({
                label : {$in : required.labels.concat(forbidden.labels)},
                app : {$in : [required.app, forbidden.app]},
                user : {$in : users_ids}
            }, function (error, users) {
                    if (error) {
                            cb(error, null);
                    } else {
                            result = [];
                            for (var i in users) {
                                    if (
                                            users[i].ocurrences(required.app, required.labels) >= required.minimum &&
                                            users[i].ocurrences(forbidden.app, forbidden.labels) < forbidden.minimum
                                    ) {
                                            result.push(users[i]);
                                    }
                            }
                            cb(null, result);
                    }
            });
        }
    });

};


/**
 * Templates dos emails
 *
 * @author Mauro Ribeiro
 * @since  2013-06
 */
var templates = {

    /**
     * lc ativacao 1t
     * email enviado 1 dia depois do cadastro para usuário não ativo do tarefas
     *
     * @author Mauro Ribeiro
     * @since  2013-06
     */
    tasksNew1day : function (user) {
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
     * lc ativacao 1c
     * email enviado 1 dia depois do cadastro para usuário não ativo do contatos
     *
     * @author Mauro Ribeiro
     * @since  2013-06
     */
    contactsNew1day : function (user) {
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
     * email enviado 1 dia depois do cadastro para usuário não ativo do finanças
     *
     * @author Mauro Ribeiro
     * @since  2013-06
     */
    financesNew1day : function (user) {
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
     * Test drive acabando, enviado 10 dias depois do cadastro
     *
     * @author Mauro Ribeiro
     * @since  2013-06
     */
    payment10days : function (user) {
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
     * Test drive acabou, enviado 15 dias após o cadastro
     *
     * @author Mauro Ribeiro
     * @since  2013-06
     */
    payment15days : function (user) {
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
/* Galera que se cadastrou 24h no contatos e não ativou                       */
/* -------------------------------------------------------------------------- */
Event.lifeCycle(
    1,
    {
        labels : ['marcar: contatos'],
        minimum : 1,
        app : 'ee'
    },{
        labels : ['adicionar contato'],
        minimum : 1,
        app : 'contatos'
    },
    function (error, users) {
        console.log(users.length + ' emails de 24h de contatos');
        if (error) {
            console.log(error);
        } else {
            for (var i in users) {
                send(users[i], {
                    subject : 'Dicas para organizar o prazo dos seus clientes',
                    html    : 'Legal que está usando o Empreendekit. <br />' +
                              'Agora para te ajudar a continuar organizando o prazo dos seus clientes, separei 2 dicas: <br /><br />' +
                              '1) Adicione um contato<br />' +
                              '2) Adicione uma tarefa no contato<br /><br />' +
                              'Para melhorar o desempenho da sua empresa, recomendo que faça isso para seus 3 principais clientes. Você já vai ver a diferença.<br /><br />' +
                              'Pra acessar o Empreendekit, <a href="http://www.empreendekit.com.br/?utm_source=sendgrid&utm_medium=email&utm_content=email24h-contatos&utm_campaign=lifecycle#!/contatos">clique aqui</a>.<br /><br />' +
                              'Abraços<br />',
                    name : 'lifecycle ativação do contatos 1'
                });
            }
        }
    }
);

/* -------------------------------------------------------------------------- */
/* Galera que se cadastrou 24h no tarefas e não ativou                        */
/* -------------------------------------------------------------------------- */
Event.lifeCycle(
    1,
    {
        labels : ['marcar: tarefas'],
        minimum : 1,
        app : 'ee'
    },{
        labels : ['adicionar tarefa'],
        minimum : 1,
        app : 'tarefas'
    },
    function (error, users) {
        console.log(users.length + ' emails de 24h de tarefas');
        if (error) {
            console.log(error);
        } else {
            for (var i in users) {
                send(users[i], {
                    subject : '2 dicas fáceis para organizar as suas tarefas na empresa',
                    html    : '<p>Olá, tudo bem?</p>' +
                              'Agora para te ajudar organizar melhor suas tarefas, separei 2 dicas:<br /><br />' +
                              '1) Adicione suas principais tarefas dessa próxima semana<br />' +
                              '2) Crie lembretes para as principais<br /><br />' +
                              'Assim você não se preocupa em esquecer de fazer tarefas, pagamentos ou cobranças e pode se dedicar mais a seus clientes.<br /><br />' +
                              'Pra acessar o Empreendekit, <a href="http://www.empreendekit.com.br/?utm_source=sendgrid&utm_medium=email&utm_content=email24h-tarefas&utm_campaign=lifecycle#!/tarefas">clique aqui</a>.<br /><br />' +
                              'Abraços<br />',
                    name : 'lifecycle ativação do tarefas 1'
                });
            }
        }
    }
);

/* -------------------------------------------------------------------------- */
/* Galera que se cadastrou 24h no finanças e não ativou                       */
/* -------------------------------------------------------------------------- */
Event.lifeCycle(
    1,
    {
        labels : ['marcar: finanças'],
        minimum : 1,
        app : 'ee'
    },{
        labels : ['adicionar transação'],
        minimum : 1,
        app : 'finanças'
    },
    function (error, users) {
        console.log(users.length + ' emails de 24h de financas');
        if (error) {
                console.log(error);
        } else {
            for (var i in users) {
                    send(users[i], {
                        subject : 'O último passo para sair da planilha',
                        html    : 'Legal que está usando o Empreendekit. <br />' +
                                  'Agora para te ajudar a sair da planilha de excel, separei 2 dicas:<br /><br />' +
                                  '1) Adicione as movimentações dessa próxima semana<br />' +
                                  '2) Crie lembretes para as principais<br /><br />' +
                                  'Assim você não se preocupa em esquecer de fazer pagamentos ou cobranças e pode se dedicar mais a seus clientes.<br /><br />' +
                                  'Pra acessar o Empreendekit, <a href="http://www.empreendekit.com.br/?utm_source=sendgrid&utm_medium=email&utm_content=email24h-financas&utm_campaign=lifecycle#!/financas">clique aqui</a>.<br /><br />' +
                                  'Abraços<br />',
                        name : 'lifecycle ativação do finanças 1'
                    });
            }
        }
    }
);

/* -------------------------------------------------------------------------- */
/* Email de pagamento 10 dias após o cadastro                                 */
/* -------------------------------------------------------------------------- */
Event.signupUsersIds(10, function(error, users_ids) {
    console.log(users_ids.length + ' emails de 10 dias');
    if (error) {
        console.log(error);
    } else {
        Event.groupByUserFilter({user : {$in : users_ids}}, function (error, users) {
            if (error) {
                console.log(error);
            } else {
                for (var i in users) {
                    send(users[i], {
                        subject : 'Seu período de testes do EmpreendeKit acaba em 5 dias',
                        html    : 'Estou mandando este e-mail porque o seu período de testes do EmpreendeKit está terminando. <br />' +
                                  'Existe alguma forma que posso te ajudar, ou sanar alguma dúvida?<br />' +
                                  'Abraços<br />',
                        name : 'lifecycle fim do test drive 10 dias'
                    });
                }
            }
        });
    }
});

/* -------------------------------------------------------------------------- */
/* Email de pagamento 15 dias após o cadastro                                 */
/* -------------------------------------------------------------------------- */
Event.signupUsersIds(15, function(error, users_ids) {
    console.log(users_ids.length + ' emails de 15 dias');
    if (error) {
        console.log(error);
    } else {
        Event.groupByUserFilter({user : {$in : users_ids}}, function (error, users) {
            for (var i in users) {
                send(users[i], {
                    subject : 'Seu período de testes do EmpreendeKit acabou',
                    html    : 'O seu período de testes acabou, mas não precisa ser assim!<br />' +
                              'Você pode ativar o EmpreendeKit fazendo o pagamento de R$59,90 mensais (você pode cancelar quando quiser).<br />' +
                              'É só clicar no botão abaixo.<br />'+
                              '<br /><br /><!-- INICIO FORMULARIO BOTAO PAGSEGURO --><form target="pagseguro" action="https://pagseguro.uol.com.br/v2/pre-approvals/request.html" method="post"><!-- NÃO EDITE OS COMANDOS DAS LINHAS ABAIXO --><input type="hidden" name="code" value="4D1DC72FC7C7FF9FF4CD2F9A1B9DDB2B" /><input type="image" src="https://p.simg.uol.com.br/out/pagseguro/i/botoes/assinaturas/209x48-assinar-assina.gif" name="submit" alt="Pague com PagSeguro - é rápido, grátis e seguro!" /></form><!-- FINAL FORMULARIO BOTAO PAGSEGURO --><br /><br />' +
                              'Se ainda tiver alguma dúvida e quiser falar conosco, é só me responder ou entrar em contato através de um dos canais abaixo, que ficaremos felizões de te atender:<br />'+
                              'Telefone: (11) 3230-9233<br />Skype: Empreendemia-fone<br />Email: <a href="mailto:contato@empreendekit.com.br">contato@empreendekit.com.br</a><br /><a href="https://www.facebook.com/Empreendemia">https://www.facebook.com/Empreendemia</a><br />' +
                              'Abraços<br />',
                    name : 'lifecycle fim do test drive 15 dias'
                });
            }
        });
    }
});
