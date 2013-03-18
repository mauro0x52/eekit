/**
 * Home
 *
 * @author Mauro Ribeiro
 * @since  2013-02
 */

app.routes.frame('/usuario-cadastrado', function (params, data) {
    var questionHtml, answer;

    answerHtml = function (toolName) {
        var html, tool;

        if (toolName === 'contacts') {
            tool = {
                tool : 'contacts',
                name : 'Contatos',
                app : 'contatos',
                bg_position : '-80',
                topics : [
                    'Registrar os seus contatos',
                    'Definir tarefas e lembretes para um cliente',
                    'Organizar seu processo de vendas'
                ]
            };
        } else if (answer === 'finances') {
            tool = {
                tool : 'finances',
                name : 'Finanças',
                app : 'financas',
                bg_position : '-120',
                topics : [
                    'Controlar suas movimentações financeiras',
                    'Exportar os dados para o seu contador',
                    'Fazer previsões do fluxo de caixa'
                ]
            };
        } else if (answer === 'tasks') {
            tool = {
                tool : 'tasks',
                name : 'Tarefas',
                app : 'tarefas',
                bg_position : '-40',
                topics : [
                    'Adicionar tarefas recorrentes',
                    'Receber lembretes por email',
                    'Definir prioridades apenas clicando e arrastando'
                ]
            };
        }

        html = [
            {
                tag : 'h1',
                attributes : { style : 'font-size: 20px; font-family:Arial,Helvetica,sans-serif; color:#6196ae; margin:40px 20px; position:relative;'},
                html : [
                    {
                        tag : 'div',
                        attributes : { style : 'background-image: url(/images/tools.png);background-position:'+tool.bg_position+'px 0; width:40px; height:40px; position:absolute; top:-15px; left:0;' }
                    },
                    {
                        tag : 'span',
                        html : tool.name,
                        attributes : { style : 'color:#f38305;margin-left:50px;' }
                    },
                    {
                        tag : 'span',
                        html : ' é a ferramenta recomendada para você!'
                    },
                ]
            },
            {
                tag : 'p',
                attributes : { style : 'margin:20px 20px; font-size:12px;'},
                html : 'Com '+tool.name+' você poderá:'
            },
            {
                tag : 'ul',
                attributes : { style : 'margin:10px 40px; font-size:12px; list-style:disc;'},
                html : [
                    {
                        tag : 'li',
                        attributes : { style : 'margin:10px 0;'},
                        html : tool.topics[0]
                    },
                    {
                        tag : 'li',
                        attributes : { style : 'margin:10px 0;'},
                        html : tool.topics[1]
                    },
                    {
                        tag : 'li',
                        attributes : { style : 'margin:10px 0;'},
                        html : tool.topics[2]
                    }
                ]
            },
            {
                tag : 'div',
                html : [
                    {
                        tag : 'div',
                        attributes : { style : 'background-color:#f38305; color:#fff; font-weight:bold; width:140px; padding:5px 0; text-align:center; margin:20px; border-radius:8px; font-size:12px; cursor:pointer; float:left;'},
                        html : 'testar já!',
                        events : {
                            click : function () {
                                app.close();
                                app.empreendemia.apps.open({
                                    app   : tool.app,
                                    route : '/',
                                    open  : function (tool) {
                                        if (toolName === 'contacts') {
                                            app.tracker.event('ir para app: contatos');
                                        } else if (answer === 'finances') {
                                            app.tracker.event('ir para app: finanças');
                                        } else if (answer === 'tasks') {
                                            app.tracker.event('ir para app: tarefas');
                                        }
                                        tool.open();
                                        app.empreendemia.apps.render(tool, true);
                                    }
                                });
                            }
                        }
                    }
                ]
            }


        ]

        return html;
    }

    selectAnswer = function () {
        var html = {};
        if (answer) {
            app.ui.html(answerHtml(answer));
        }
    }

    questionHtml = [
        {
            tag : 'h1',
            html : 'Qual a maior necessidade da sua empresa atualmente?',
            attributes : { style : 'font-size: 20px; font-family:Arial,Helvetica,sans-serif; color:#6196ae; margin:40px 20px;'}
        },
        {
            tag : 'div',
            attributes : { style : 'margin: 10px 20px; font-size: 12px;'},
            html :
                {
                    tag : 'label',
                    html : [
                        {
                            tag : 'input',
                            attributes : {
                                type : 'radio',
                                name : 'question-answer'
                            },
                            events : {
                                click : function () {
                                    answer = 'contacts';
                                    app.tracker.event('marcar: contatos');
                                }
                            }
                        },
                        {
                            tag : 'span',
                            html : ' 1. Preciso cuidar dos meus clientes de forma mais eficiente'
                        }
                    ]
                }
        },
        {
            tag : 'div',
            attributes : { style : 'margin: 10px 20px; font-size: 12px;'},
            html : {
                tag : 'label',
                html : [
                    {
                        tag : 'input',
                        attributes : {
                            type : 'radio',
                            name : 'question-answer'
                        },
                        events : {
                            click : function () {
                                answer = 'finances';
                                app.tracker.event('marcar: finanças');
                            }
                        }
                    },
                    {
                        tag : 'span',
                        html : ' 2. Tenho dificuldade em gerenciar o fluxo de caixa da minha empresa'
                    }
                ]
            }
        },
        {
            tag : 'div',
            attributes : { style : 'margin: 10px 20px; font-size: 12px;'},
            html : {
                tag : 'label',
                html : [
                    {
                        tag : 'input',
                        attributes : {
                            type : 'radio',
                            name : 'question-answer'
                        },
                        events : {
                            click : function () {
                                answer = 'tasks';
                                app.tracker.event('marcar: tarefas');
                            }
                        }
                    },
                    {
                        tag : 'span',
                        html : ' 3. Quero uma forma simples de lembrar das minhas tarefas diárias'
                    }
                ]
            }
        },
        {
            tag : 'div',
            attributes : { style : 'background-color:#2b4f67; color:#fff; font-weight:bold; width:120px; padding:5px 0; text-align:center; margin:20px; border-radius:8px; font-size:12px; cursor:pointer;'},
            html : 'ok',
            events : {
                click : selectAnswer
            }
        }
    ];

    app.ui.html(questionHtml);
});