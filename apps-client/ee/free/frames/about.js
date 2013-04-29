/**
 * Como funciona
 *
 * @author Mauro Ribeiro
 * @since  2013-04
 */

app.routes.frame('/como-funciona', function (params, data) {
    app.tracker.event('visualizar: como-funciona');

    var header, title, printscreen, text, features, feature_item, footer_signup;


/*
 * -----------------------------------------------------------------------------
 * Header
 * -----------------------------------------------------------------------------
 */
    header = {
        tag : 'div',
        attributes : {
            style : 'background-color:#2b4f67; position:relative; height:120px'
        },
        /* wrapper */
        html : {
            tag : 'div',
            attributes : {
                style : 'width:1000px; margin:auto; position:relative;'
            },
            /* menu */
            html : [
                /* imagem */
                {
                    tag : 'div',
                    attributes : { style : 'position: absolute; top: 20px; left:20px;'},
                    html : {
                        tag : 'a',
                        attributes : { style : 'display: block; background-image:url(/images/ee/logo.png); width:289px; height:74px; cursor:pointer;'},
                        events : {
                            click : function () {
                                app.apps.open({app : app.slug, route : '/'});
                                app.close();
                            }
                        }
                    }
                },
                /* menu */
                {
                    tag : 'menu',
                    attributes : {
                        style : 'position:absolute; right: 0; display:block; font-size:18px; font-family:Verdana, Helvetica, sans-serif;'
                    },
                    html : [
                        /* planos */
                        {
                            tag : 'li',
                            attributes : {
                                style : 'display:inline-block; padding: 50px 10px; margin:0;'
                            },
                            html : {
                                tag : 'a',
                                html : 'PLANOS',
                                attributes : {
                                    style : 'cursor:pointer; color:#fdfdeb;'
                                },
                                events : {
                                    click : function () {
                                        app.apps.open({app : app.slug, route : '/precos-e-planos'});
                                        app.close();
                                    }
                                }
                            }
                        },
                        /* como funciona */
                        {
                            tag : 'li',
                            attributes : {
                                style : 'display:inline-block; padding: 50px 10px; margin:0;'
                            },
                            html : {
                                tag : 'a',
                                html : 'COMO FUNCIONA',
                                attributes : {
                                    style : 'cursor:pointer; color:#fdfdeb;'
                                }
                            }
                        },
                        /* dúvidas */
                        {
                            tag : 'li',
                            attributes : {
                                style : 'display:inline-block; padding: 50px 10px; margin:0;'
                            },
                            html : {
                                tag : 'a',
                                html : 'DÚVIDAS',
                                attributes : {
                                    style : 'cursor:pointer; color:#fdfdeb;'
                                },
                                events : {
                                    click : function () {
                                        app.apps.open({app : app.slug, route : '/suporte'});
                                        app.close();
                                    }
                                }
                            }
                        },
                        /* cadastrar */
                        {
                            tag : 'li',
                            attributes : {
                                style : 'display:inline-block; padding: 50px 10px; margin:0; margin-left: 20px;'
                            },
                            html : {
                                tag : 'a',
                                html : 'Cadastrar',
                                attributes : {
                                    style : 'cursor:pointer; color:#fdfdeb; font-weight:bold;'
                                },
                                events : {
                                    click : function () {
                                        app.apps.open({app : app.slug, route : '/cadastrar'});
                                        app.close();
                                    }
                                }
                            }
                        },
                        /* login */
                        {
                            tag : 'li',
                            attributes : {
                                style : 'display:inline-block; padding: 50px 10px; margin:0;'
                            },
                            html : {
                                tag : 'a',
                                html : 'Entrar',
                                attributes : {
                                    style : 'cursor:pointer; color:#fdfdeb; font-weight:bold;'
                                },
                                events : {
                                    click : function () {
                                        app.empreendemia.user.login()
                                    }
                                }
                            }
                        }
                    ]
                }
            ]
        }
    };

/*
 * -----------------------------------------------------------------------------
 * Title
 * -----------------------------------------------------------------------------
 */

    title = {
        tag : 'div',
        attributes : {
            style : 'background-color:#fdfdeb; position:relative;'
        },
        html : [
            /* wrapper */
            {
                tag : 'div',
                attributes : {
                    style : 'width:1000px; margin:auto; position:relative;'
                },
                html : [
                    {
                        tag : 'h1',
                        attributes : {
                            style : 'color:#2b4f67; font-family:Arial,Helvetica,sans-serif; font-size:25px; font-weight:bold; margin:0; padding:60px 20px 60px 20px;'
                        },
                        html : 'O sistema de gestão para microempresas mais simples da internet!'
                    }
                ]
            }
        ]
    };

/*
 * -----------------------------------------------------------------------------
 * Printscreen
 * -----------------------------------------------------------------------------
 */

    printscreen = {
        tag : 'div',
        attributes : {
            style : 'background-color:#333030; position:relative;'
        },
        html : [
            /* wrapper */
            {
                tag : 'div',
                attributes : {
                    style : 'width:1000px; height:400px; margin:auto; position:relative; overflow:hidden;'
                },
                html : [
                    {
                        tag : 'div',
                        attributes : {
                            style : 'background-image:url(/images/ee/about_printscreen.jpg); background-repeat:no-repeat; width:620px; height:400px; box-shadow: 0 0 8px rgba(0,0,0,0.9); margin-left:20px;'
                        }
                    },
                    {
                        tag : 'div',
                        attributes : {
                            style : 'color:#fdfdeb; font-family:Arial,Helvetica,sans-serif; font-size:25px; margin:0 20px 0 680px; position: absolute; top: 120px; line-height:1.6em;'
                        },
                        html : 'O EmpreendeKit é a mais simples ferramenta online de gestão para microempresários.'
                    }
                ]
            }
        ]
    };

/*
 * -----------------------------------------------------------------------------
 * Text
 * -----------------------------------------------------------------------------
 */

    text = {
        tag : 'div',
        attributes : {
            style : 'background-color:#b9ac9f; position:relative;'
        },
        html : [
            /* wrapper */
            {
                tag : 'div',
                attributes : {
                    style : 'width:1000px; margin:auto; position:relative; padding: 20px;'
                },
                html : [
                    {
                        tag : 'div',
                        attributes : {
                            style : 'color:#333030; font-family:Verdana,Helvetica,sans-serif; font-size:18px; width: 600px; position: relative; margin: 20px 0; line-height:1.4em;'
                        },
                        html : 'Em um só lugar você consegue controlar de forma rápida e fácil tudo o que precisa no dia-a-dia da sua empresa.'
                    },
                    {
                        tag : 'div',
                        attributes : {
                            style : 'color:#333030; font-family:Verdana,Helvetica,sans-serif; font-size:18px; width: 600px; position: relative; margin: 20px 0; line-height:1.4em;'
                        },
                        html : 'O principal objetivo é economizar tempo na gestão, para investir seu tempo no que realmente importa: Vender mais e crescer o seu negócio.'
                    },
                    {
                        tag : 'div',
                        attributes : {
                            style : 'color:#333030; font-family:Verdana,Helvetica,sans-serif; font-size:18px; width: 600px; position: relative; margin: 20px 0; line-height:1.4em;'
                        },
                        html : 'Aqui todos os nossos clientes são especiais e fazemos questão de dar um suporte personalizado.'
                    }
                ]
            }
        ]
    };

/*
 * -----------------------------------------------------------------------------
 * Features
 * -----------------------------------------------------------------------------
 */

    feature_item = function (data) {
        var html;

        html = {
            tag : 'div',
            attributes : {
                style : 'width:450px; margin:60px 0; position:relative;'
            },
            html : [
                /* imagem */
                {
                    tag : 'div',
                    attributes : {
                        style : 'width:140px; height:140px; background-image:url(/images/ee/'+data.image+'); background-repeat:no-repeat; background-position:top center; position:absolute; left:0; top:0;'
                    }
                },
                /* titulo */
                {
                    tag : 'div',
                    html : data.title,
                    attributes : {
                        style : 'color:#5e93ab; font-family:Arial,Helvetica,sans-serif; font-size:20px; margin-left: 160px; line-height: 1.2em; margin-bottom: 10px;'
                    }
                },
                /* texto */
                {
                    tag : 'div',
                    html : data.text,
                    attributes : {
                        style : 'color:#333030; font-family:Verdana,Helvetica,sans-serif; font-size:16px; margin-left: 160px; line-height: 1.4em;'
                    }
                }
            ]
        };

        return html;
    }

    features = {
        tag : 'div',
        attributes : {
            style : 'background-color:#fdfdeb; position:relative;'
        },
        html : [
            /* borda superior branca */
            {
                tag : 'div',
                attributes : { style : 'position: absolute; top: -10px; display: block; background-image:url(/images/ee/border-wave-w.png); border-bottom: 10px solid #fdfdeb; height: 6px; width: 100%;'}
            },
            /* wrapper */
            {
                tag : 'div',
                attributes : {
                    style : 'width:1000px; margin:auto; position:relative; padding:10px 20px;'
                },
                html : [
                    /* coluna esquerda */
                    {
                        tag : 'div',
                        attributes : {
                            style : 'width:450px; float:left;'
                        },
                        html : [
                            feature_item({
                                image : 'about_1.png',
                                title : 'Gerencie o prazo das tarefas dos seus clientes',
                                text : 'Adicione tarefas para cada cliente, assim não perde o prazo das atividades que tem que entregar.'
                            }),
                            feature_item({
                                image : 'about_2.png',
                                title : 'Lembre-se do que tem que ser feito',
                                text : 'Receba lembretes por email de suas tarefas e transações. Dessa forma você nunca mais vai esquecer de ligar para um cliente, fazer um relatório ou pagar uma conta.'
                            }),
                            feature_item({
                                image : 'about_3.png',
                                title : 'Sua equipe trabalhando junta',
                                text : 'Sistema para até 5 usuários, onde tudo pode ser compartilhado. Tarefas, clientes e finanças.'
                            })
                        ]
                    },
                    /* coluna direita */
                    {
                        tag : 'div',
                        attributes : {
                            style : 'width:450px; float:right;'
                        },
                        html : [
                            feature_item({
                                image : 'about_4.png',
                                title : 'Suas finanças sem complicação',
                                text : {
                                    tag : 'div',
                                    html : [
                                        {
                                            tag : 'div',
                                            attributes : {
                                                style: 'margin: 10px 0;'
                                            },
                                            html : 'Faça o básico bem feito:'
                                        },
                                        {
                                            tag : 'div',
                                            attributes : {
                                                style: 'margin: 2px 0;'
                                            },
                                            html : '- Registre suas vendas'
                                        },
                                        {
                                            tag : 'div',
                                            attributes : {
                                                style: 'margin: 2px 0;'
                                            },
                                            html : '- Controle seu fluxo de caixa'
                                        },
                                        {
                                            tag : 'div',
                                            attributes : {
                                                style: 'margin: 2px 0;'
                                            },
                                            html : '- Emita boletos'
                                        }
                                    ]
                                }
                            }),
                            feature_item({
                                image : 'about_5.png',
                                title : 'Tarefas, clientes e finanças, tudo isso integrado',
                                text : {
                                    tag : 'div',
                                    html : [
                                        {
                                            tag : 'div',
                                            attributes : {
                                                style: 'margin: 10px 0;'
                                            },
                                            html : 'Todas as ferramentas são integradas, isso significa que é possível adicionar tarefas e transações em um contato e adicionar lembretes em uma conta. '
                                        },
                                        {
                                            tag : 'div',
                                            attributes : {
                                                style: 'margin: 10px 0;'
                                            },
                                            html : 'Você pode gerenciar tudo da sua empresa em um só lugar. '
                                        },
                                        {
                                            tag : 'div',
                                            attributes : {
                                                style: 'margin: 20px 0;'
                                            },
                                            html : 'Simples. Rápido. Fácil.'
                                        }
                                    ]
                                }
                            })
                        ]
                    },
                    /* clear */
                    {
                        tag : 'div',
                        attributes : {
                            style : 'clear:both;'
                        }
                    }
                ]
            }
        ]
    };


/*
 * -----------------------------------------------------------------------------
 * Footer de Cadastro
 * -----------------------------------------------------------------------------
 */
    footer_signup = {
        tag : 'div',
        attributes : {
            style : 'background-color:#5e93ab; position:relative;'
        },
        html : [
            /* borda superior azul claro */
            {
                tag : 'div',
                attributes : { style : 'position: absolute; top: -10px; display: block; background-image:url(/images/ee/border-wave-lb.png); border-bottom: 10px solid #5e93ab; height: 6px; width: 100%;'}
            },
            /* borda inferior azul */
            {
                tag : 'div',
                attributes : { style : 'position: absolute; bottom: 0; display: block; background-image:url(/images/ee/border-wave-db.png); border-bottom: 5px solid #2b4f67; height: 6px; width: 100%;'}
            },
            /* wrapper */
            {
                tag : 'div',
                attributes : {
                    style : 'width:1000px; margin:auto; position:relative;'
                },
                html : [
                    /* mensagem */
                    {
                        tag : 'div',
                        attributes : {
                            style : 'font-family:Arial,Helvetica,sans-serif; padding:60px 0 40px 0; color:#fdfdeb; text-align:center; font-size:20px;'
                        },
                        html : 'COMECE JÁ A ECONOMIZAR TEMPO PARA SUA EMPRESA!'
                    },
                    /* botão */
                    {
                        tag : 'div',
                        attributes : {
                            style : 'text-align:center;'
                        },
                        html : {
                            tag : 'a',
                            attributes : {
                                style : 'display: block; text-align:center; background-color:#fdfdeb; color:5e93ab; padding:20px; font-family:Arial,Helvetica,sans-serif; font-size: 20px; width:200px; margin: auto; cursor:pointer;'
                            },
                            html : 'Experimente já!',
                            events : {
                                click : function () {
                                    app.apps.open({app : app.slug, route : '/cadastrar'});
                                    app.close();
                                }
                            }
                        }
                    },
                    /* observacao */
                    {
                        tag : 'div',
                        attributes : {
                            style : 'font-family:Verdana,Helvetica,sans-serif; padding:10px 0 50px 0; color:#fdfdeb; text-align:center; font-size:12px;'
                        },
                        html : 'e teste gratuitamente por 15 dias!'
                    },
                ]
            }
        ]
    };

/*
 * -----------------------------------------------------------------------------
 * Mete tudo na tela
 * -----------------------------------------------------------------------------
 */
    app.ui.html([header, title, printscreen, text, features, footer_signup]);
});