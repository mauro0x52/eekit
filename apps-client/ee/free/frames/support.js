/**
 * Suporte
 *
 * @author Mauro Ribeiro
 * @since  2013-04
 */

app.routes.frame('/suporte', function (params, data) {
    app.tracker.event('visualizar: suporte');

    var styles, header, ask, faq, footer_signup, questions = [], questions_html = [];


/*
 * -----------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------
 */
styles = {
    tag : 'style',
    attributes : {
        type : 'text/css'
    },
    html : ''
};

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
                                },
                                events : {
                                    click : function () {
                                        app.apps.open({app : app.slug, route : '/como-funciona'});
                                        app.close();
                                    }
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
 * Tirar dúvida
 * -----------------------------------------------------------------------------
 */
    ask = {
        tag : 'div',
        attributes : {
            style : ' background-color:#5e93ab;'
        },
        /* wrapper */
        html : {
            tag : 'div',
            attributes : {
                style : 'width:1000px; margin:auto; position:relative;'
            },

            html : [
                {
                    tag : 'h1',
                    html : 'Ajuda e suporte',
                    attributes : {
                        style : 'color:#fdfdeb; font-family:Arial,Helvetica,sans-serif; font-size:30px; font-weight:bold; margin:0; padding:60px 20px 20px 20px;'
                    }
                },
                {
                    tag : 'div',
                    html : 'Oferecemos suporte gratuito por e-mail e telefone a todos nossos usuários.',
                    attributes : {
                        style : 'color:#fdfdeb; font-family:Arial,Helvetica,sans-serif; font-size:20px; margin:0; padding:0 20px 10px 20px; line-height: 1.4em;'
                    }
                },
                {
                    tag : 'div',
                    html : 'Se você tiver dúvidas ou problemas, fique à vontade para entrar em contato conosco pelo e-mail contato@empreendekit.com.br ou pelo nosso telefone (11) 3230-9233',
                    attributes : {
                        style : 'color:#fdfdeb; font-family:Arial,Helvetica,sans-serif; font-size:20px; fmargin:0; padding:0 20px 60px 20px; line-height: 1.4em;'
                    }
                }
            ]
        }
    };

/*
 * -----------------------------------------------------------------------------
 * Perguntas
 * -----------------------------------------------------------------------------
 */

    styles.html += '.question-item {margin:40px 20px; line-height:1.4em;}';
    styles.html += '.question {color:#5e93ab; font-family:Arial,Helvetica,sans-serif; font-size:18px; font-weight:normal;}';
    styles.html += '.answer {color:#333030; font-family:Verdana,Helvetica,sans-serif; font-size:16px; font-weight:normal; margin:20px 0;}';
    styles.html += '.answer-paragraph {margin:10px 0;}';
    styles.html += '.answer-anchor { cursor:pointer; color:#5e93ab;}';

    questions = [
        {
            tag : 'div',
            attributes : { 'class' : 'question-item' },
            html : [
                {
                    tag : 'div',
                    attributes : { 'class' : 'question' },
                    html : 'Como funciona?'
                },
                {
                    tag : 'div',
                    attributes : { 'class' : 'answer' },
                    html : [
                        {
                            tag : 'div',
                            attributes : { 'class' : 'answer-paragraph' },
                            html : 'O objetivo do Empreendekit é simplificar a gestão das microempresas. Atualmente o Empreendekit conta com três ferramentas para cuidar das finanças, clientes e tarefas.'
                        },
                        {
                            tag : 'div',
                            attributes : { 'class' : 'answer-paragraph' },
                            html : [
                                {
                                    tag : 'span',
                                    html : 'Você pode ver mais informações na página '
                                },
                                {
                                    tag : 'a',
                                    attributes : { 'class' : 'answer-anchor' },
                                    html : 'Como Funciona',
                                    events : {
                                        click : function () {
                                            app.apps.open({app : app.slug, route : '/como-funciona'});
                                            app.close();
                                        }
                                    }
                                },
                                {
                                    tag : 'span',
                                    html : '.'
                                }
                            ]
                        },
                        {
                            tag : 'div',
                            attributes : { 'class' : 'answer-paragraph' },
                            html : [
                                {
                                    tag : 'span',
                                    html : 'Se você quiser saber se o Empreendekit funcionará bem na sua empresa, você pode '
                                },
                                {
                                    tag : 'a',
                                    attributes : { 'class' : 'answer-anchor' },
                                    html : 'testar gratuitamente',
                                    events : {
                                        click : function () {
                                            app.apps.open({app : app.slug, route : '/cadastrar'});
                                            app.close();
                                        }
                                    }
                                },
                                {
                                    tag : 'span',
                                    html : ' ou conversar conosco por chat ou skype.'
                                },
                            ]
                        }

                    ]
                }
            ]
        },
        {
            tag : 'div',
            attributes : { 'class' : 'question-item' },
            html : [
                {
                    tag : 'div',
                    attributes : { 'class' : 'question' },
                    html : 'Quanto custa?'
                },
                {
                    tag : 'div',
                    attributes : { 'class' : 'answer' },
                    html : [
                        {
                            tag : 'span',
                            html : 'A ferramenta custa R$59,00 por mês. Entretanto, esse preço diminui nos planos trimestral e semestral. Veja mais nossos '
                        },
                        {
                            tag : 'a',
                            attributes : { 'class' : 'answer-anchor' },
                            html : 'preços e planos',
                            events : {
                                click : function () {
                                    app.apps.open({app : app.slug, route : '/precos-e-planos'});
                                    app.close();
                                }
                            }
                        },
                        {
                            tag : 'span',
                            html : '.'
                        }
                    ]
                }
            ]
        },
        {
            tag : 'div',
            attributes : { 'class' : 'question-item' },
            html : [
                {
                    tag : 'div',
                    attributes : { 'class' : 'question' },
                    html : 'Como pago?'
                },
                {
                    tag : 'div',
                    attributes : { 'class' : 'answer' },
                    html : [
                        {
                            tag : 'div',
                            html : 'O pagamento pode ser feito através do Pagseguro, com cartão de crédito ou boleto.'
                        },
                        {
                            tag : 'div',
                            attributes : { 'class' : 'answer-paragraph' },
                            html : [
                                {
                                    tag : 'span',
                                    html : 'Você pode acessar nossos '
                                },
                                {
                                    tag : 'a',
                                    attributes : { 'class' : 'answer-anchor' },
                                    html : 'preços e planos',
                                    events : {
                                        click : function () {
                                            app.apps.open({app : app.slug, route : '/precos-e-planos'});
                                            app.close();
                                        }
                                    }
                                },
                                {
                                    tag : 'span',
                                    html : '.'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            tag : 'div',
            attributes : { 'class' : 'question-item' },
            html : [
                {
                    tag : 'div',
                    attributes : { 'class' : 'question' },
                    html : 'Tem alguma fidelidade no contrato?'
                },
                {
                    tag : 'div',
                    attributes : { 'class' : 'answer' },
                    html : 'Não. Você pode cancelar a qualquer momento.'
                }
            ]
        },
        {
            tag : 'div',
            attributes : { 'class' : 'question-item' },
            html : [
                {
                    tag : 'div',
                    attributes : { 'class' : 'question' },
                    html : 'Outras pessoas da minha empresa podem usar?'
                },
                {
                    tag : 'div',
                    attributes : { 'class' : 'answer' },
                    html : 'Sim! Até 5 pessoas da sua empresa podem usar. As tarefas, contatos e finanças podem ser compartilhadas.'
                }
            ]
        },
        {
            tag : 'div',
            attributes : { 'class' : 'question-item' },
            html : [
                {
                    tag : 'div',
                    attributes : { 'class' : 'question' },
                    html : 'Tenho que instalar alguma coisa?'
                },
                {
                    tag : 'div',
                    attributes : { 'class' : 'answer' },
                    html : 'Não! Toda a ferramenta é online e você pode acessar de qualquer computador.'
                }
            ]
        },
        {
            tag : 'div',
            attributes : { 'class' : 'question-item' },
            html : [
                {
                    tag : 'div',
                    attributes : { 'class' : 'question' },
                    html : 'Os meus dados estão seguros?'
                },
                {
                    tag : 'div',
                    attributes : { 'class' : 'answer' },
                    html : 'Sim!'
                }
            ]
        },
        {
            tag : 'div',
            attributes : { 'class' : 'question-item' },
            html : [
                {
                    tag : 'div',
                    attributes : { 'class' : 'question' },
                    html : 'Existe alguma forma de fazer backup dos meus dados?'
                },
                {
                    tag : 'div',
                    attributes : { 'class' : 'answer' },
                    html : 'Sim! Você pode exportar seus dados financeiros ou de clientes e guardar com você.'
                }
            ]
        },
        {
            tag : 'div',
            attributes : { 'class' : 'question-item' },
            html : [
                {
                    tag : 'div',
                    attributes : { 'class' : 'question' },
                    html : 'E se eu tiver dificuldades para usar?'
                },
                {
                    tag : 'div',
                    attributes : { 'class' : 'answer' },
                    html : 'Esperamos que você não tenha. Mas se tiver, estamos aqui para te ajudar. Podemos marcar um horário para conversar e te ajudamos a configurar e usar a ferramenta.'
                }
            ]
        },
        {
            tag : 'div',
            attributes : { 'class' : 'question-item' },
            html : [
                {
                    tag : 'div',
                    attributes : { 'class' : 'question' },
                    html : 'Existe suporte para a ferramenta?'
                },
                {
                    tag : 'div',
                    attributes : { 'class' : 'answer' },
                    html : 'Sim! Se você precisar de ajuda para configurar ou tirar duas dúvidas, você tem suporte por email, telefone, skype ou chat online com a gente.'
                }
            ]
        }
    ];

    faq = {
        tag : 'div',
        attributes : {
            style : 'background-color:#fdfdeb; position:relative;'
        },
        html : [
            /* borda superior branco */
            {
                tag : 'div',
                attributes : { style : 'position: absolute; top: -10px; display: block; background-image:url(/images/ee/border-wave-w.png); border-bottom: 10px solid #fdfdeb; height: 6px; width: 100%;'}
            },
            /* wrapper */
            {
                tag : 'div',
                attributes : {
                    style : 'width:1000px; margin:auto; position:relative;'
                },
                html : [
                    /* perguntas e respostas */
                    {
                        tag : 'h1',
                        attributes : { style : 'color:#5e93ab; font-family:Arial,Helvetica,sans-serif; font-size:24px; font-weight:bold; margin:0; padding:40px 20px 0 20px;' },
                        html : 'Perguntas frequentes'
                    },
                    {
                        tag : 'ol',
                        attributes : { style : '' },
                        html : questions
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
                        html : 'VIU COMO É BACANA USAR O EMPREENDEKIT? ENTÃO EXPERIMENTE!'
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
    app.ui.html([styles, header, ask, faq, footer_signup]);
});