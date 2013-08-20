var Statistic = require('../model/Model').Statistic,
    config = require('../config.js'),
    needle = require('needle'),
    today, oneDayAgo, twoDaysAgo, threeDaysAgo, fourDaysAgo;

today = new Date();
today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
oneDayAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
twoDaysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2);
threeDaysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3);
fourDaysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4);

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
                console.log('usuario '+user_id+' sem token valido');
            }
        } else {
            console.log('usuario '+user_id+' sem token');
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
            from : 'millor@empreendemia.com.br'
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
            console.log('Enviando email para: ' + user.name + ' ' + user._id)
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
 * Menor data da alteração de status para um status
 *
 * @author Mauro Ribeiro
 * @since  2013-06
 */
var minStatusDate = function (statistic, status, apps) {
    var found = false,
        min = new Date(3000, 0),
        current;

    for (var i in statistic.apps) {
        current = new Date(statistic.apps[i].statusDate);
        if (statistic.apps[i].status === status) {
            if (current < min) {
                if (apps) {
                    if (apps.indexOf(i) >= 0) {
                        min = current;
                        found = true;
                    }
                } else {
                    min = current;
                    found = true;
                }
            }
        }
    }

    return found ? min : null;
}

/**
 * Templates dos emails
 *
 * @author Mauro Ribeiro
 * @since  2013-06
 */
var templates = {

    /* ---------------------------------------------------------------------- */
    /* TAREFAS                                                                */
    /* ---------------------------------------------------------------------- */
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
        html += '<li>Adicione uma tarefa que você tem que fazer hoje</li>';
        html += '<li>Assim que terminar a tarefa, marque a tarefa como feita</li>';
        html += '</ol>';
        html += '<p>Recomendo que faça isso para suas 3 principais tarefas. Você já vai ver a diferença!</p>';
        html += '<p>Para acessar o EmpreendeKit e já aplicar as dicas, <a href="http://www.empreendekit.com.br/tarefas?utm_source=eekit&utm_medium=email&utm_content=ativacao-1t&utm_campaign=lifecycle">clique aqui</a>.</p>';
        html += '<p>Abraços,<br />Millor</p>';

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
        html += '<p>Para acessar o EmpreendeKit e já aplicar as dicas, <a href="http://www.empreendekit.com.br/tarefas?utm_source=eekit&utm_medium=email&utm_content=engajamento-1t&utm_campaign=lifecycle">clique aqui</a>.</p>';
        html += '<p>Se tiver alguma dúvida, é só me mandar um email =)</p>';
        html += '<p>Abraços,<br />Millor</p>';

        return {
            subject : subject,
            html : html,
            name : name
        }
    },
    /**
     * lc engajamento 4f
     *
     * @author Mauro Ribeiro
     * @since  2013-06
     */
    lc_engajamento_4t : function (user) {
        var subject, name, html = '';

        subject = 'Recursos legais do EmpreendeKit que você pode não ter visto ainda';
        name = 'lc engajamento 4f';

        html += '<p>Olá '+user.name.split(' ')[0]+', tudo bem?</p>';
        html += '<p>Você chegou a ver nossos lembretes por email no EmpreendeKit?</p>';
        html += '<p>Enviaremos o lembrete diretamente para seu email para você não se preocupar mais em esquecer de fazer alguma tarefa.</p>';
        html += '<p>É só adicionar uma tarefa com data e clicar em "Mais informações".<br />Depois disso é só clicar no período que você deseja ser lembrado.</p>';
        html += '<p>Para acessar o EmpreendeKit e configurar seus lembretes, é só <a href="http://www.empreendekit.com.br/tarefas?utm_source=eekit&utm_medium=email&utm_content=engajamento-4t&utm_campaign=lifecycle">clicar aqui</a>.</p>';
        html += '<p>Abraços,<br />Millor</p>';

        return {
            subject : subject,
            html : html,
            name : name
        }
    },

    /* ---------------------------------------------------------------------- */
    /* CONTATOS                                                               */
    /* ---------------------------------------------------------------------- */
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
        html += '<li>Adicione um contato</li>';
        html += '<li>Adicione uma tarefa no contato</li>';
        html += '</ol>';
        html += '<p>Recomendo que faça isso para seus 3 principais contatos. Você já vai ver a diferença!</p>';
        html += '<p>Para acessar o EmpreendeKit e já aplicar as dicas, é só <a href="http://www.empreendekit.com.br/contatos?utm_source=eekit&utm_medium=email&utm_content=ativacao-1c&utm_campaign=lifecycle">clicar aqui</a>.</p>';
        html += '<p>Abraços,<br />Millor</p>';

        return {
            subject : subject,
            html : html,
            name : name
        }
    },

    /**
     * lc engajamento 1c
     *
     * @author Mauro Ribeiro
     * @since  2013-06
     */
    lc_engajamento_1c : function (user) {
        var subject, name, html = '';

        subject = 'Agora falta pouco para se tornar um mestre da produtividade!';
        name = 'lc engajamento 1c';

        html += '<p>Olá '+user.name.split(' ')[0]+', tudo bem?</p>';
        html += '<p>Meus parabéns! Você já começou com o pé direito o uso do Empreendekit.</p>';
        html += '<p>O próximo passo é se tornar um mestre da produtividade!<br />Para isso, adicione mais contatos e tarefas para cada um deles.<br />Saber o que deve ser feito para cada cliente é fundamental para aumentar sua produtividade e vender mais.</p>';
        html += '<p>Para acessar o EmpreendeKit e já aplicar as dicas, <a href="http://www.empreendekit.com.br/contatos?utm_source=eekit&utm_medium=email&utm_content=engajamento-1c&utm_campaign=lifecycle">clique aqui</a>.</p>';
        html += '<p>Se tiver alguma dúvida, é só me mandar um email =)</p>';
        html += '<p>Abraços,<br />Millor</p>';

        return {
            subject : subject,
            html : html,
            name : name
        }
    },
    /**
     * lc engajamento 4c
     *
     * @author Mauro Ribeiro
     * @since  2013-06
     */
    lc_engajamento_4c : function (user) {
        var subject, name, html = '';

        subject = 'Recursos legais do EmpreendeKit que você pode não ter visto ainda';
        name = 'lc engajamento 4c';

        html += '<p>Olá '+user.name.split(' ')[0]+', tudo bem?</p>';
        html += '<p>Você chegou a ver nossos campos e categorias personalizáveis no EmpreendeKit?</p>';
        html += '<p>Com os campos personalizados, você consegue inserir em seus contatos apenas as informações relevantes para sua empresa. A partir dai, sempre que for adicionar ou editar um contato, aparecerá o campo que você adicionou para preencher.</p>';
        html += '<p>Já com as categorias, você consegue adaptar a ferramenta para o seu processo de vendas.</p>';
        html += '<p>Para fazer isso, é só clicar em categorias ou campos personalizados, logo na barra lateral esquerda. A partir dai, é só adicionar a categoria ou campo que você quiser.</p>';
        html += '<p>Para começar a deixar a ferramenta do seu jeito, <a href="http://www.empreendekit.com.br/contatos?utm_source=eekit&utm_medium=email&utm_content=engajamento-4c&utm_campaign=lifecycle">clique aqui</a>.</p>';
        html += '<p>Se quiser, posso te ajudar a fazer essa configuração.<br />É só me responder esse email.</p>';
        html += '<p>Abraços,<br />Millor</p>';

        return {
            subject : subject,
            html : html,
            name : name
        }
    },


    /* ---------------------------------------------------------------------- */
    /* FINANÇAS                                                               */
    /* ---------------------------------------------------------------------- */
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
        html += '<p>Abraços,<br />Millor</p>';

        return {
            subject : subject,
            html : html,
            name : name
        }
    },

    /**
     * lc engajamento 1f
     *
     * @author Mauro Ribeiro
     * @since  2013-06
     */
    lc_engajamento_1f : function (user) {
        var subject, name, html = '';

        subject = 'Agora falta pouco para se tornar um mestre da produtividade!';
        name = 'lc engajamento 1f';

        html += '<p>Olá '+user.name.split(' ')[0]+', tudo bem?</p>';
        html += '<p>Meus parabéns! Você já começou com o pé direito o uso do Empreendekit.</p>';
        html += '<p>O próximo passo é se tornar um mestre da produtividade!<br />Para isso, coloque as categorias de receitas e despesas mais adequadas para a rotina da sua empresa e adicione mais movimentações financeiras já com essas novas categorias.<br />Ter seu fluxo de caixa organizado é fundamental para controlar sua empresa e aumentar sua produtividade.</p>';
        html += '<p>Para acessar o EmpreendeKit e já aplicar as dicas, <a href="http://www.empreendekit.com.br/financas?utm_source=eekit&utm_medium=email&utm_content=engajamento-1f&utm_campaign=lifecycle">clique aqui</a>.</p>';
        html += '<p>Se tiver alguma dúvida, é só me mandar um email =)</p>';
        html += '<p>Abraços,<br />Millor</p>';

        return {
            subject : subject,
            html : html,
            name : name
        }
    },
    /**
     * lc engajamento 4f
     *
     * @author Mauro Ribeiro
     * @since  2013-06
     */
    lc_engajamento_4f : function (user) {
        var subject, name, html = '';

        subject = 'Recursos legais do EmpreendeKit que você pode não ter visto ainda';
        name = 'lc engajamento 4f';

        html += '<p>Olá '+user.name.split(' ')[0]+', tudo bem?</p>';
        html += '<p>Você chegou a ver que é possível exportar seus dados financeiros no EmpreendeKit?</p>';
        html += '<p>Você pode mandar periodicamente as informações para seu contador e facilitar a contabilidade na sua empresa.</p>';
        html += '<p>Dentro do Finanças, é só clicar em "baixar dados" que ele vai te gerar um arquivo com todas as movimentações que você tem no período selecionado.</p>';
        html += '<p>Para acessar o EmpreendeKit e já baixar as informações financeiras da sua empresa, é só <a href="http://www.empreendekit.com.br/financas?utm_source=eekit&utm_medium=email&utm_content=engajamento-4f&utm_campaign=lifecycle">clique aqui</a>.</p>';
        html += '<p>Abraços,<br />Millor</p>';

        return {
            subject : subject,
            html : html,
            name : name
        }
    },

    /* ---------------------------------------------------------------------- */
    /* GERAL                                                                  */
    /* ---------------------------------------------------------------------- */
    /**
     * lc ativacao 2
     *
     * @author Mauro Ribeiro
     * @since  2013-06
     */
    lc_ativacao_2 : function (user) {
        var subject, name, html = '';

        subject = 'Como um de nossos usuários melhorou o gerenciamento de sua empresa com o EmpreendeKit';
        name = 'lc ativacao 2';

        html += '<p>Olá '+user.name.split(' ')[0]+', tudo bem?</p>';
        html += '<p>Recebemos um depoimento muito bacana de um usuário nosso e achamos tão legal, que pensamos em repassar para você.</p>';
        html += '<p><span style="italic">O Empreendekit me ajudou a ter sempre claro quais são as próximas tarefas a serem feitas, e de qual área da empresa ou do meu processo de entrega do serviço ela corresponde. Nos contatos posso reunir todas as informações de um cliente, relatar contatos anteriores e adicionar tarefas para aquele cliente, em uma data única ou com recorrência. É muito fácil controlar o fluxo de caixa com o Empreendekit porque é simples adicionar receitas ou despesas.</span><br />Leandro do Carmo - Alto Rendimento Assessoria Esportiva</p>';
        html += '<p>Quer fazer igual o Leandro e organizar mais a sua empresa? <a href="http://www.empreendekit.com.br/?utm_source=eekit&utm_medium=email&utm_content=ativacao-2&utm_campaign=lifecycle">clique aqui</a>.</p>';
        html += '<p>Abraços,<br />Millor</p>';

        return {
            subject : subject,
            html : html,
            name : name
        }
    },
    /**
     * lc ativacao 3
     *
     * @author Mauro Ribeiro
     * @since  2013-06
     */
    lc_ativacao_3 : function (user) {
        var subject, name, html = '';

        subject = 'Não se preocupe, já pensamos em tudo!';
        name = 'lc ativacao 3';

        html += '<p>Olá '+user.name.split(' ')[0]+', tudo bem?</p>';
        html += '<p>Estamos muito felizes que você resolveu testar o EmpreendeKit.</p>';
        html += '<p>É comum termos algumas dúvidas sempre que vamos testar uma nova ferramenta.<br />Pensando nisso, resolvi te mandar esse email para te assegurar: nós já pensamos em tudo!</p>';
        html += '<ul>';
        html += '<li>O EmpreendeKit é seguro - Nos preocupamos com a sua segurança e garantimos a confidencialidade das suas informações</li>';
        html += '<li>Você não vai ser cobrado se não quiser - Nós só te enviamos cobrança se você realmente quiser continuar usando</li>';
        html += '<li>Também somos empreendedores e desenhamos a ferramenta abrangendo tudo que uma pequena empresa precisa.</li>';
        html += '</ul>';
        html += '<p>Quer dar mais uma olhada no sistema? É só <a href="http://www.empreendekit.com.br/?utm_source=eekit&utm_medium=email&utm_content=ativacao-3&utm_campaign=lifecycle">clicar aqui</a>.</p>';
        html += '<p>Abraços,<br />Millor</p>';

        return {
            subject : subject,
            html : html,
            name : name
        }
    },
    /**
     * lc ativacao 4
     *
     * @author Mauro Ribeiro
     * @since  2013-06
     */
    lc_ativacao_4 : function (user) {
        var subject, name, html = '';

        subject = 'Suporte EmpreendeKit';
        name = 'lc ativacao 4';

        html += '<p>Olá '+user.name.split(' ')[0]+', tudo bem?</p>';
        html += '<p>Espero que o Empreendekit consiga ajudar no dia a dia da sua empresa.</p>';
        html += '<p>Você ficou com alguma dúvida? O que acha de marcarmos um horário para conversar e eu te ajudar a configurar o Empreendekit?</p>';
        html += '<p>Abraços,<br />Millor</p>';

        return {
            subject : subject,
            html : html,
            name : name
        }
    },
    /**
     * lc engajamento 2
     *
     * @author Mauro Ribeiro
     * @since  2013-06
     */
    lc_engajamento_2 : function (user) {
        var subject, name, html = '';

        subject = 'Quer aumentar a produtividade e profissionalizar sua empresa?';
        name = 'lc engajamento 2';

        html += '<p>Olá '+user.name.split(' ')[0]+', tudo bem?</p>';
        html += '<p>Temos tantas coisas para fazer no dia-a-dia, que diversas acabam não cabendo em 24h.<br />Entretanto, isso pode ser amenizado quando usamos a tecnologia em nosso favor.';
        html += '<p>As ferramentas de produtividade poupam tempo que você gastaria se organizando e evitam que você tenha que ficar se lembrando de tudo o que precisa fazer. Ou seja, faz a sua gestão ficar mais ágil e profissional.</p>';
        html += '<p>Ter uma empresa produtiva do nunca foi tão rápido e fácil. É só <a href="http://www.empreendekit.com.br/?utm_source=eekit&utm_medium=email&utm_content=engajamento-2&utm_campaign=lifecycle">clicar aqui</a>.</p>';
        html += '<p>Abraços,<br />Millor</p>';

        return {
            subject : subject,
            html : html,
            name : name
        }
    },
    /**
     * lc retenção 1
     *
     * @author Mauro Ribeiro
     * @since  2013-06
     */
    lc_retencao_1 : function (user) {
        var subject, name, html = '';

        subject = 'Parabéns! Você é praticamente um mestre da produtividade';
        name = 'lc retencao 1';

        html += '<p>Olá '+user.name.split(' ')[0]+', tudo bem?</p>';
        html += '<p>Você já usou grande parte dos recursos do EmpreendeKit e é praticamente um mestre da produtividade.<br />Isso vai te ajudar bastante a organizar e profissionalizar sua empresa.</p>';
        html += '<p>Separamos algumas coisas que você pode fazer para aproveitar integrar os recursos da ferramenta e ganhar cada vez mais agilidade.</p>';
        html += '<ul>';
        html += '<li>Ao clicar em um contato, você consegue criar tarefas específicas para ele</li>';
        html += '<li>Dentro do contato você também pode adicionar uma transação financeira</li>';
        html += '</ul>';
        html += '<p>As transações criadas dentro de um contato podem ser vistas, também, dentro do Financeiro. A mesma coisa acontece com as tarefas, que podem ser vistas tanto dentro do contato, quanto no aplicativo de tarefas.</p>';
        html += '<p>Para acessar o EmpreendeKi e continuar a sua jornada em busca da produtividade, <a href="http://www.empreendekit.com.br/?utm_source=eekit&utm_medium=email&utm_content=retencao-1&utm_campaign=lifecycle">clique aqui</a>.</p>';
        html += '<p>Abraços,<br />Millor</p>';

        return {
            subject : subject,
            html : html,
            name : name
        }
    },
    /**
     * lc retenção 2
     *
     * @author Mauro Ribeiro
     * @since  2013-06
     */
    lc_retencao_2 : function (user) {
        var subject, name, html = '';

        subject = 'Personalizando o EmpreendeKit para a sua empresa';
        name = 'lc retencao 2';

        html += '<p>Olá '+user.name.split(' ')[0]+', tudo bem?</p>';
        html += '<p>Nós criamos o EmpreendeKit com o intuito de ser completo, simples, mas principalmente, personalizável para a realidade de cada empresa.</p>';
        html += '<p>Dentro de nossa ferramenta existem alguns recursos que podem te ajudar a fazer isso:</p>';
        html += '<h3>Categorias</h3>';
        html += '<p>Você pode criar rótulos que te ajudam a visualizar e filtrar suas tarefas, contatos e finanças.<br />Para isso, é só clicar em "Categorias" na barra lateral esquerda de qualquer aplicativo e adicionar, editar ou remover as categorias para deixar o EmpreendeKit com a cara da sua empresa.</p>';
        html += '<h3>Campos Personalizados</h3>';
        html += '<p>Sabemos que cada empresa tem necessidades diferentes ao cadastrar clientes e fornecedores, portanto abrimos a possibilidade de criar campos personalizados no Contatos.<br />É só clicar na barra lateral esquerda do Contatos e adicionar, editar ou removar os campos que você quer que apareçam no seu contato.<br />Dessa forma, sempre que você for adicionar ou editar um contato, haverá um espaço adicional personalizado para você colocar as informações que importam no seu processo de vendas.</p>';
        html += '<h3>Contas</h3>';
        html += '<p>É importante na organização de nossas finanças termos separado todas as nossas contas e centro de custo.<br />No Finanças, também na barra lateral esquerda, você pode clicar em contas para editar e adicionar as contas da sua empresa, organizando ainda mais a gestão financeira da sua empresa.</p>';
        html += '<p>Quer começar a personalizar o EmpreendeKit para a sua empresa? <a href="http://www.empreendekit.com.br/?utm_source=eekit&utm_medium=email&utm_content=retencao-2&utm_campaign=lifecycle">Clique aqui</a>.</p>'
        html += '<p>Abraços,<br />Millor</p>';

        return {
            subject : subject,
            html : html,
            name : name
        }
    },
    /**
     * lc retenção 3
     *
     * @author Mauro Ribeiro
     * @since  2013-06
     */
    lc_retencao_3 : function (user) {
        var subject, name, html = '';

        subject = 'Preparamos uma Consultoria para te ajudar a ser mais produtivo com o EmpreendeKit';
        name = 'lc retencao 3';

        html += '<p>Olá '+user.name.split(' ')[0]+', tudo bem?</p>';
        html += '<p>Como empreendedores estamos sempre procurando aumentar a nossa produtividade, seja através de hábitos, ou usufruindo melhor as ferramentas que usamos no dia-a-dia.</p>';
        html += '<p>Sabemos que isso não é só conosco e estamos dispostos a fazer uma consultoria para te ajudar a usar melhor os recursos do EmpreendeKit.<br />Queremos te ajudar a fazer melhor e mais rápido.</p>';
        html += '<p>Vamos marcar uma conversa por telefone ou Skype/Hangout?</p>';
        html += '<p>Abraços,<br />Millor</p>';

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
        html += '<p>Abraços,<br />Millor</p>';

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
        html += '<p>Se ainda tiver alguma dúvida e quiser falar conosco, é só me responder ou entrar em contato através de um dos canais abaixo, que ficaremos felizões de te atender. Eventualmente podemos até estender seu teste.<br />Você pode entrar em contato comigo por esse email, ou pelo telefone: (11) 3230-9233.</p>';
        html += '<p>Se você quiser, também temos outros planos para períodos maiores com um desconto bacana.<br />Para acessar nossa página de planos, é só <a href="http://www.empreendekit.com.br/ee/precos-e-planos?utm_source=eekit&utm_medium=email&utm_content=geral-2&utm_campaign=lifecycle">clicar aqui</a>.</p>'
        html += '<p>Abraços,<br />Millor</p>';

        return {
            subject : subject,
            html : html,
            name : name
        }
    },

    /**
     * lc nutricao 1
     *
     * @author Mauro Ribeiro
     * @since  2013-06
     */
    lc_nutricao_1 : function (user) {
        var subject, name, html = '';

        subject = 'O que você achou do EmpreendeKit?';
        name = 'lc nutricao 1';

        html += '<p>Olá '+user.name.split(' ')[0]+', tudo bem?</p>';
        html += '<p>Sempre estamos querendo melhorar a ferramenta e construir melhores recursos para empreendedores.<br />Para nós a sua opinião é extremamente importante.</p>';
        html += '<p>O que você achou do EmpreendeKit?<br />Ficou faltando alguma coisa?</p>';
        html += '<p>Abraços,<br />Millor</p>';

        return {
            subject : subject,
            html : html,
            name : name
        }
    }
}


/* -------------------------------------------------------------------------- */
/* TAREFAS                                                                    */
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

/* Usuário ativos quatro dias depois de terem ativado */
Statistic.find({
    'apps.tarefas.status' : 'active',
    'apps.contatos.status' : {$ne : 'active'},
    'apps.financas.status' : {$ne : 'active'},
    'apps.tarefas.statusDate' : {
        $gte : new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4),
        $lt : new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3)
    }
}, function (error, statistics) {
    if (error) {
        console.log(error)
    } else {
        for (var i in statistics) {
            mail('lc_engajamento_4t', statistics[i].user)
        }
    }
});

/* -------------------------------------------------------------------------- */
/* CONTATOS                                                                   */
/* -------------------------------------------------------------------------- */
/* Galera que se cadastrou ontem no contatos e não ativou */
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

/* Usuário ativos um dia depois de terem ativado */
Statistic.find({
    'apps.contatos.status' : 'active',
    'apps.financas.status' : {$ne : 'active'},
    'apps.contatos.statusDate' : {
        $gte : oneDayAgo,
        $lt : today
    }
}, function (error, statistics) {
    if (error) {
        console.log(error)
    } else {
        for (var i in statistics) {
            mail('lc_engajamento_1c', statistics[i].user)
        }
    }
});

/* Usuário ativos quatro dias depois de terem ativado */
Statistic.find({
    'apps.contatos.status' : 'active',
    'apps.financas.status' : {$ne : 'active'},
    'apps.contatos.statusDate' : {
        $gte : new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4),
        $lt : new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3)
    }
}, function (error, statistics) {
    if (error) {
        console.log(error)
    } else {
        for (var i in statistics) {
            mail('lc_engajamento_4c', statistics[i].user)
        }
    }
});

/* -------------------------------------------------------------------------- */
/* FINANÇAS                                                                   */
/* -------------------------------------------------------------------------- */
/* Galera que se cadastrou 24h no finanças e não ativou */
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

/* Usuário ativos um dia depois de terem ativado */
Statistic.find({
    'apps.financas.status' : 'active',
    'apps.financas.statusDate' : {
        $gte : oneDayAgo,
        $lt : today
    }
}, function (error, statistics) {
    if (error) {
        console.log(error)
    } else {
        for (var i in statistics) {
            mail('lc_engajamento_1f', statistics[i].user)
        }
    }
});

/* Usuário ativos quatro dias depois de terem ativado */
Statistic.find({
    'apps.financas.status' : 'active',
    'apps.financas.statusDate' : {
        $gte : new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4),
        $lt : new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3)
    }
}, function (error, statistics) {
    if (error) {
        console.log(error)
    } else {
        for (var i in statistics) {
            mail('lc_engajamento_4f', statistics[i].user)
        }
    }
});

/* -------------------------------------------------------------------------- */
/* GERAL                                                                      */
/* -------------------------------------------------------------------------- */

/* Usuário não ativo depois de 2 dias do cadastro */
Statistic.find({
    'apps.tarefas.status': {'$nin': ['active', 'engaged', 'retained']},
    'apps.contatos.status': {'$nin': ['active', 'engaged', 'retained']},
    'apps.financas.status': {'$nin': ['active', 'engaged', 'retained']},
    'signupDate' : {
        $gte : twoDaysAgo,
        $lt : oneDayAgo
    }
}, function (error, statistics) {
    if (error) {
        console.log(error)
    } else {
        for (var i in statistics) {
            mail('lc_ativacao_2', statistics[i].user)
        }
    }
});

/* Usuário não ativo depois de 3 dias do cadastro */
Statistic.find({
    'apps.tarefas.status': {'$nin': ['active', 'engaged', 'retained']},
    'apps.contatos.status': {'$nin': ['active', 'engaged', 'retained']},
    'apps.financas.status': {'$nin': ['active', 'engaged', 'retained']},
    'signupDate' : {
        $gte : new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3),
        $lt : new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2)
    }
}, function (error, statistics) {
    if (error) {
        console.log(error)
    } else {
        for (var i in statistics) {
            mail('lc_ativacao_3', statistics[i].user)
        }
    }
});

/* Usuário não ativo depois de 4 dias do cadastro */
Statistic.find({
    'apps.tarefas.status': {'$nin': ['active', 'engaged', 'retained']},
    'apps.contatos.status': {'$nin': ['active', 'engaged', 'retained']},
    'apps.financas.status': {'$nin': ['active', 'engaged', 'retained']},
    'signupDate' : {
        $gte : new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4),
        $lt : new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3)
    }
}, function (error, statistics) {
    if (error) {
        console.log(error)
    } else {
        for (var i in statistics) {
            mail('lc_ativacao_4', statistics[i].user)
        }
    }
});

/* Usuários ativos dois dias depois */
Statistic.find({
    '$or': [
        {
            'apps.tarefas.status': 'active',
            'apps.contatos.status': {$nin : ['engaged', 'retained']},
            'apps.financas.status': {$nin : ['engaged', 'retained']},
            'apps.tarefas.statusDate' : {
                $gte : twoDaysAgo,
                $lt : oneDayAgo
            }
        },
        {
            'apps.tarefas.status': {$nin : ['engaged', 'retained']},
            'apps.contatos.status': 'active',
            'apps.financas.status': {$nin : ['engaged', 'retained']},
            'apps.contatos.statusDate' : {
                $gte : twoDaysAgo,
                $lt : oneDayAgo
            }
        },
        {
            'apps.tarefas.status': {$nin : ['engaged', 'retained']},
            'apps.contatos.status': {$nin : ['engaged', 'retained']},
            'apps.financas.status': 'active',
            'apps.financas.statusDate' : {
                $gte : twoDaysAgo,
                $lt : oneDayAgo
            }
        }
    ]
}, function (error, statistics) {
    if (error) {
        console.log(error)
    } else {
        for (var i in statistics) {
            var minDate = minStatusDate(statistics[i], 'active', ['tarefas', 'contatos', 'financas']);
            if (minDate >= twoDaysAgo && minDate < oneDayAgo) {
                mail('lc_engajamento_2', statistics[i].user);
            }
        }
    }
});

/* Usuários engajados um dia depois */
Statistic.find({
    '$or': [
        {
            'apps.tarefas.status': 'engaged',
            'apps.contatos.status': {$ne : 'retained'},
            'apps.financas.status': {$ne : 'retained'},
            'apps.tarefas.statusDate' : { $gte : oneDayAgo, $lt : today }
        },
        {
            'apps.tarefas.status': {$ne : 'retained'},
            'apps.contatos.status': 'engaged',
            'apps.financas.status': {$ne : 'retained'},
            'apps.contatos.statusDate' : { $gte : oneDayAgo, $lt : today }
        },
        {
            'apps.tarefas.status': {$ne : 'retained'},
            'apps.contatos.status': {$ne : 'retained'},
            'apps.financas.status': 'engaged',
            'apps.financas.statusDate' : { $gte : oneDayAgo, $lt : today }
        }
    ]
}, function (error, statistics) {
    if (error) {
        console.log(error)
    } else {
        for (var i in statistics) {
            var minDate = minStatusDate(statistics[i], 'engaged', ['tarefas', 'contatos', 'financas']);
            if (minDate >= oneDayAgo && minDate < today) {
                mail('lc_retencao_1', statistics[i].user);
            }
        }
    }
});

/* Usuários engajados dois dias depois */
Statistic.find({
    '$or': [
        {
            'apps.tarefas.status': 'engaged',
            'apps.contatos.status': {$ne : 'retained'},
            'apps.financas.status': {$ne : 'retained'},
            'apps.tarefas.statusDate' : {
                $gte : twoDaysAgo,
                $lt : oneDayAgo
            }
        },
        {
            'apps.tarefas.status': {$ne : 'retained'},
            'apps.contatos.status': 'engaged',
            'apps.financas.status': {$ne : 'retained'},
            'apps.contatos.statusDate' : {
                $gte : twoDaysAgo,
                $lt : oneDayAgo
            }
        },
        {
            'apps.tarefas.status': {$ne : 'retained'},
            'apps.contatos.status': {$ne : 'retained'},
            'apps.financas.status': 'engaged',
            'apps.financas.statusDate' : {
                $gte : twoDaysAgo,
                $lt : oneDayAgo
            }
        }
    ]
}, function (error, statistics) {
    if (error) {
        console.log(error)
    } else {
        for (var i in statistics) {
            var minDate = minStatusDate(statistics[i], 'engaged', ['tarefas', 'contatos', 'financas']);
            if (minDate >= twoDaysAgo && minDate < oneDayAgo) {
                mail('lc_retencao_2', statistics[i].user);
            }
        }
    }
});

/* Usuários engajados três dias depois */
Statistic.find({
    '$or': [
        {
            'apps.tarefas.status': 'engaged',
            'apps.contatos.status': {$ne : 'retained'},
            'apps.financas.status': {$ne : 'retained'},
            'apps.tarefas.statusDate' : {
                $gte : threeDaysAgo,
                $lt : twoDaysAgo
            }
        },
        {
            'apps.tarefas.status': {$ne : 'retained'},
            'apps.contatos.status': 'engaged',
            'apps.financas.status': {$ne : 'retained'},
            'apps.contatos.statusDate' : {
                $gte : threeDaysAgo,
                $lt : twoDaysAgo
            }
        },
        {
            'apps.tarefas.status': {$ne : 'retained'},
            'apps.contatos.status': {$ne : 'retained'},
            'apps.financas.status': 'engaged',
            'apps.financas.statusDate' : {
                $gte : threeDaysAgo,
                $lt : twoDaysAgo
            }
        }
    ]
}, function (error, statistics) {
    if (error) {
        console.log(error)
    } else {
        for (var i in statistics) {
            var minDate = minStatusDate(statistics[i], 'engaged', ['tarefas', 'contatos', 'financas']);
            if (minDate >= threeDaysAgo && minDate < twoDaysAgo) {
                mail('lc_retencao_3', statistics[i].user);
            }
        }
    }
});

/* Email de pagamento 10 dias após o cadastro */
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

/* Email de pagamento 15 dias após o cadastro */
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

/* Usuários cadastrados a 17 dias */
Statistic.find({
    'signupDate' : {
        $gte : new Date(today.getFullYear(), today.getMonth(), today.getDate() - 17),
        $lt : new Date(today.getFullYear(), today.getMonth(), today.getDate() - 16)
    }
}, function (error, statistics) {
    if (error) {
        console.log(error)
    } else {
        for (var i in statistics) {
            mail('lc_nutricao_1', statistics[i].user)
        }
    }
});
