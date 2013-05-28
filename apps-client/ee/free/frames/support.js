/**
 * Suporte
 *
 * @author Mauro Ribeiro
 * @since  2013-04
 */

app.routes.frame('/suporte', function (params, data) {
    app.event('visualizar: suporte');

    var header, ask, faq, footer_signup, questions = [], questions_html = [],
        styles = {};

/*
 * -----------------------------------------------------------------------------
 * Header
 * -----------------------------------------------------------------------------
 */
    header = new app.ui.tag('div', {
        attributes : {
            style : 'background-color:#2b4f67; position:relative; height:120px'
        },
        /* wrapper */
        html : [
            new app.ui.tag('div', {
                attributes : {
                    style : 'width:1000px; margin:auto; position:relative;'
                },
                /* menu */
                html : [
                    /* imagem */
                    new app.ui.tag('div', {
                        attributes : { style : 'position: absolute; top: 20px; left:20px;'},
                        html : [
                            new app.ui.tag('a', {
                                attributes : { style : 'display: block; background-image:url(/images/ee/logo.png); width:289px; height:74px; cursor:pointer;'},
                                events : {
                                    click : function () {
                                        app.open({app : app.slug(), route : '/'});
                                        app.close();
                                    }
                                }
                            })
                        ]
                    }),
                    /* menu */
                    new app.ui.tag('menu', {
                        attributes : {
                            style : 'position:absolute; right: 0; display:block; font-size:18px; font-family:Verdana, Helvetica, sans-serif;'},
                        html : [
                            /* planos */
                            new app.ui.tag('li', {
                                attributes : {
                                    style : 'display:inline-block; padding: 50px 10px; margin:0;'
                                },
                                html : [
                                    new app.ui.tag('a', {
                                        html : 'PLANOS',
                                        attributes : {
                                            style : 'cursor:pointer; color:#fdfdeb;'
                                        },
                                        events : {
                                            click : function () {
                                                app.open({app : app.slug(), route : '/precos-e-planos'});
                                                app.close();
                                            }
                                        }
                                    })
                                ]
                            }),
                            /* como funciona */
                            new app.ui.tag('li', {
                                attributes : {
                                    style : 'display:inline-block; padding: 50px 10px; margin:0 ;'
                                },
                                html : [
                                    new app.ui.tag('a', {
                                        html : 'COMO FUNCIONA',
                                        attributes : {
                                            style : 'cursor:pointer; color:#fdfdeb;'
                                        },
                                        events : {
                                            click : function () {
                                                app.open({app : app.slug(), route : '/como-funciona'});
                                                app.close();
                                            }
                                        }
                                    })
                                ]
                            }),
                            /* dúvidas */
                            new app.ui.tag('li', {
                                attributes : {
                                    style : 'display:inline-block; padding: 50px 10px; margin:0;'
                                },
                                html : [
                                    new app.ui.tag('a', {
                                        html : 'DÚVIDAS',
                                        attributes : {
                                            style : 'color:#6196ae;'
                                        }
                                    })
                                ]
                            }),
                            /* cadastrar */
                            new app.ui.tag('li', {
                                attributes : {
                                    style : 'display:inline-block; padding: 50px 10px; margin:0 0 0 20px;'
                                },
                                html : [
                                    new app.ui.tag('a', {
                                        html : 'Cadastrar',
                                        attributes : {
                                            style : 'cursor:pointer; color:#fdfdeb; font-weight:bold;'
                                        },
                                        events : {
                                            click : function () {
                                                Empreendekit.auth.user.signup();
                                                app.close();
                                            }
                                        }
                                    })
                                ]
                            }),
                            /* login */
                            new app.ui.tag('li', {
                                attributes : {
                                    style : 'display:inline-block; padding: 50px 10px; margin:0;'
                                },
                                html : [
                                    new app.ui.tag('a', {
                                        html : 'Entrar',
                                        attributes : {
                                            style : 'cursor:pointer; color:#fdfdeb; font-weight:bold;'
                                        },
                                        events : {click : Empreendekit.auth.user.signin}
                                    })
                                ]
                            }),
                        ]
                    })
                ]
            })
        ]
    });

/*
 * -----------------------------------------------------------------------------
 * Tirar dúvida
 * -----------------------------------------------------------------------------
 */
    ask = new app.ui.tag('div', {
        attributes : {
            style : ' background-color:#5e93ab;'
        },
        /* wrapper */
        html : new app.ui.tag('div', {
            attributes : {
                style : 'width:1000px; margin:auto; position:relative;'
            },

            html : [
                new app.ui.tag('h1', {
                    html : 'Ajuda e suporte',
                    attributes : {
                        style : 'color:#fdfdeb; font-family:Arial,Helvetica,sans-serif; font-size:30px; font-weight:bold; margin:0; padding:60px 20px 20px 20px;'
                    }
                }),
                new app.ui.tag('div', {
                    html : 'Oferecemos suporte gratuito por e-mail e telefone a todos nossos usuários.',
                    attributes : {
                        style : 'color:#fdfdeb; font-family:Arial,Helvetica,sans-serif; font-size:20px; margin:0; padding:0 20px 10px 20px; line-height: 1.4em;'
                    }
                }),
                new app.ui.tag('div', {
                    html : 'Se você tiver dúvidas ou problemas, fique à vontade para entrar em contato conosco pelo e-mail contato@empreendekit.com.br ou pelo nosso telefone (11) 3230-9233',
                    attributes : {
                        style : 'color:#fdfdeb; font-family:Arial,Helvetica,sans-serif; font-size:20px; fmargin:0; padding:0 20px 60px 20px; line-height: 1.4em;'
                    }
                })
            ]
        })
    });

/*
 * -----------------------------------------------------------------------------
 * Perguntas
 * -----------------------------------------------------------------------------
 */
    styles['question-item'] = new app.ui.css({
        'margin' : '40px 20px',
        'line-height' : '1.4em'
    });

    styles['question'] = new app.ui.css({
        'color' : '#5e93ab',
        'font-family' : 'Arial,Helvetica,sans-serif',
        'font-size' : 'font-size:18px',
        'font-weight' : 'normal'
    });

    styles['answer'] = new app.ui.css({
        'color' : '#333030',
        'font-family' : 'Verdana,Helvetica,sans-serif',
        'font-size' : 'font-size:16px',
        'font-weight' : 'normal',
        'margin': '20px 0'
    });

    styles['answer-paragraph'] = new app.ui.css({
        'margin': '10px 0'
    });

    styles['answer-anchor'] = new app.ui.css({
        'cursor' : 'pointer',
        'color' : '#5e93ab'
    });

    questions = [
        new app.ui.tag('div', {
            attributes : { 'class' : 'question-item' },
            css : styles['question-item'],
            html : [
                new app.ui.tag('div', {
                    attributes : { 'class' : 'question' },
                    css : styles['question'],
                    html : 'Como funciona?'
                }),
                new app.ui.tag('div', {
                    attributes : { 'class' : 'answer' },
                    css : styles['answer'],
                    html : [
                        new app.ui.tag('div', {
                            attributes : { 'class' : 'answer-paragraph' },
                            css : styles['answer-paragraph'],
                            html : 'O objetivo do Empreendekit é simplificar a gestão das microempresas. Atualmente o Empreendekit conta com três ferramentas para cuidar das finanças, clientes e tarefas.'
                        }),
                        new app.ui.tag('div', {
                            attributes : { 'class' : 'answer-paragraph' },
                            css : styles['answer-paragraph'],
                            html : [
                                new app.ui.tag('span', {
                                    html : 'Você pode ver mais informações na página '
                                }),
                                new app.ui.tag('a', {
                                    attributes : { 'class' : 'answer-anchor' },
                                    css : styles['answer-anchor'],
                                    html : 'Como Funciona',
                                    events : {
                                        click : function () {
                                            app.open({app : app.slug(), route : '/como-funciona'});
                                            app.close();
                                        }
                                    }
                                }),
                                new app.ui.tag('span', {
                                    html : '.'
                                })
                            ]
                        }),
                        new app.ui.tag('div', {
                            attributes : { 'class' : 'answer-paragraph' },
                            css : styles['answer-paragraph'],
                            html : [
                                new app.ui.tag('span', {
                                    html : 'Se você quiser saber se o Empreendekit funcionará bem na sua empresa, você pode '
                                }),
                                new app.ui.tag('a', {
                                    attributes : { 'class' : 'answer-anchor' },
                                    css : styles['answer-anchor'],
                                    html : 'testar gratuitamente',
                                    events : {
                                        click : function () {
                                            app.open({app : app.slug(), route : '/cadastrar'});
                                            app.close();
                                        }
                                    }
                                }),
                                new app.ui.tag('span', {
                                    html : ' ou conversar conosco por chat ou skype.'
                                }),
                            ]
                        })
                    ]
                })
            ]
        }),
        new app.ui.tag('div', {
            attributes : { 'class' : 'question-item' },
            css : styles['question-item'],
            html : [
                new app.ui.tag('div', {
                    attributes : { 'class' : 'question' },
                    css : styles['question'],
                    html : 'Quanto custa?'
                }),
                new app.ui.tag('div', {
                    attributes : { 'class' : 'answer' },
                    css : styles['answer'],
                    html : [
                        new app.ui.tag('span', {
                            html : 'A ferramenta custa R$59,00 por mês. Entretanto, esse preço diminui nos planos trimestral e semestral. Veja mais nossos '
                        }),
                        new app.ui.tag('a', {
                            attributes : { 'class' : 'answer-anchor' },
                            css : styles['answer-anchor'],
                            html : 'preços e planos',
                            events : {
                                click : function () {
                                    app.open({app : app.slug(), route : '/precos-e-planos'});
                                    app.close();
                                }
                            }
                        }),
                        new app.ui.tag('span', {
                            html : '.'
                        })
                    ]
                })
            ]
        }),
        new app.ui.tag('div', {
            attributes : { 'class' : 'question-item' },
            css : styles['question-item'],
            html : [
                new app.ui.tag('div', {
                    attributes : { 'class' : 'question' },
                    css : styles['question'],
                    html : 'Como pago?'
                }),
                new app.ui.tag('div', {
                    attributes : { 'class' : 'answer' },
                    css : styles['answer'],
                    html : [
                        new app.ui.tag('div', {
                            html : 'O pagamento pode ser feito através do Pagseguro, com cartão de crédito ou boleto.'
                        }),
                        new app.ui.tag('div', {
                            attributes : { 'class' : 'answer-paragraph' },
                            css : styles['answer-paragraph'],
                            html : [
                                new app.ui.tag('span', {
                                    html : 'Você pode acessar nossos '
                                }),
                                new app.ui.tag('a', {
                                    attributes : { 'class' : 'answer-anchor' },
                                    css : styles['answer-anchor'],
                                    html : 'preços e planos',
                                    events : {
                                        click : function () {
                                            app.open({app : app.slug(), route : '/precos-e-planos'});
                                            app.close();
                                        }
                                    }
                                }),
                                new app.ui.tag('span', {
                                    html : '.'
                                })
                            ]
                        })
                    ]
                })
            ]
        }),
        new app.ui.tag('div', {
            attributes : { 'class' : 'question-item' },
            css : styles['question-item'],
            html : [
                new app.ui.tag('div', {
                    attributes : { 'class' : 'question' },
                    css : styles['question'],
                    html : 'Tem alguma fidelidade no contrato?'
                }),
                new app.ui.tag('div', {
                    attributes : { 'class' : 'answer' },
                    css : styles['answer'],
                    html : 'Não. Você pode cancelar a qualquer momento.'
                })
            ]
        }),
        new app.ui.tag('div', {
            attributes : { 'class' : 'question-item' },
            css : styles['question-item'],
            html : [
                new app.ui.tag('div', {
                    attributes : { 'class' : 'question' },
                    css : styles['question'],
                    html : 'Outras pessoas da minha empresa podem usar?'
                }),
                new app.ui.tag('div', {
                    attributes : { 'class' : 'answer' },
                    css : styles['answer'],
                    html : 'Sim! Até 5 pessoas da sua empresa podem usar. As tarefas, contatos e finanças podem ser compartilhadas.'
                })
            ]
        }),
        new app.ui.tag('div', {
            attributes : { 'class' : 'question-item' },
            css : styles['question-item'],
            html : [
                new app.ui.tag('div', {
                    attributes : { 'class' : 'question' },
                    css : styles['question'],
                    html : 'Tenho que instalar alguma coisa?'
                }),
                new app.ui.tag('div', {
                    attributes : { 'class' : 'answer' },
                    css : styles['answer'],
                    html : 'Não! Toda a ferramenta é online e você pode acessar de qualquer computador.'
                })
            ]
        }),
        new app.ui.tag('div', {
            attributes : { 'class' : 'question-item' },
            css : styles['question-item'],
            html : [
                new app.ui.tag('div', {
                    attributes : { 'class' : 'question' },
                    css : styles['question'],
                    html : 'Os meus dados estão seguros?'
                }),
                new app.ui.tag('div', {
                    attributes : { 'class' : 'answer' },
                    css : styles['answer'],
                    html : 'Sim!'
                })
            ]
        }),
        new app.ui.tag('div', {
            attributes : { 'class' : 'question-item' },
            css : styles['question-item'],
            html : [
                new app.ui.tag('div', {
                    attributes : { 'class' : 'question' },
                    css : styles['question'],
                    html : 'Existe alguma forma de fazer backup dos meus dados?'
                }),
                new app.ui.tag('div', {
                    attributes : { 'class' : 'answer' },
                    css : styles['answer'],
                    html : 'Sim! Você pode exportar seus dados financeiros ou de clientes e guardar com você.'
                })
            ]
        }),
        new app.ui.tag('div', {
            attributes : { 'class' : 'question-item' },
            css : styles['question-item'],
            html : [
                new app.ui.tag('div', {
                    attributes : { 'class' : 'question' },
                    css : styles['question'],
                    html : 'E se eu tiver dificuldades para usar?'
                }),
                new app.ui.tag('div', {
                    attributes : { 'class' : 'answer' },
                    css : styles['answer'],
                    html : 'Esperamos que você não tenha. Mas se tiver, estamos aqui para te ajudar. Podemos marcar um horário para conversar e te ajudamos a configurar e usar a ferramenta.'
                })
            ]
        }),
        new app.ui.tag('div', {
            attributes : { 'class' : 'question-item' },
            css : styles['question-item'],
            html : [
                new app.ui.tag('div', {
                    attributes : { 'class' : 'question' },
                    css : styles['question'],
                    html : 'Existe suporte para a ferramenta?'
                }),
                new app.ui.tag('div', {
                    attributes : { 'class' : 'answer' },
                    css : styles['answer'],
                    html : 'Sim! Se você precisar de ajuda para configurar ou tirar duas dúvidas, você tem suporte por email, telefone, skype ou chat online com a gente.'
                })
            ]
        })
    ];

    faq = new app.ui.tag('div', {
        attributes : {
            style : 'background-color:#fdfdeb; position:relative; padding: 1px 0;'
        },
        html : [
            /* borda superior branco */
            new app.ui.tag('div', {
                attributes : { style : 'position: absolute; top: -10px; display: block; background-image:url(/images/ee/border-wave-w.png); border-bottom: 10px solid #fdfdeb; height: 6px; width: 100%;'}
            }),
            /* wrapper */
            new app.ui.tag('div', {
                attributes : {
                    style : 'width:1000px; margin:auto; position:relative;'
                },
                html : [
                    /* perguntas e respostas */
                    new app.ui.tag('h1', {
                        attributes : { style : 'color:#5e93ab; font-family:Arial,Helvetica,sans-serif; font-size:24px; font-weight:bold; margin:0; padding:40px 20px 0 20px;' },
                        html : 'Perguntas frequentes'
                    }),
                    new app.ui.tag('ol', {
                        attributes : { style : ' ' },
                        html : questions
                    })
                ]
            })
        ]
    });



/*
 * -----------------------------------------------------------------------------
 * Footer de Cadastro
 * -----------------------------------------------------------------------------
 */
    footer_signup = new app.ui.tag('div', {
        attributes : {
            style : 'background-color:#5e93ab; position:relative;'
        },
        html : [
            /* borda superior azul claro */
            new app.ui.tag('div', {
                attributes : { style : 'position: absolute; top: -10px; display: block; background-image:url(/images/ee/border-wave-lb.png); border-bottom: 10px solid #5e93ab; height: 6px; width: 100%;'}
            }),
            /* borda inferior azul */
            new app.ui.tag('div', {
                attributes : { style : 'position: absolute; bottom: 0; display: block; background-image:url(/images/ee/border-wave-db.png); border-bottom: 5px solid #2b4f67; height: 6px; width: 100%;'}
            }),
            /* wrapper */
            new app.ui.tag('div', {
                attributes : {
                    style : 'width:1000px; margin:auto; position:relative;'
                },
                html : [
                    /* mensagem */
                    new app.ui.tag('div', {
                        attributes : {
                            style : 'font-family:Arial,Helvetica,sans-serif; padding:60px 0 40px 0; color:#fdfdeb; text-align:center; font-size:20px;'
                        },
                        html : 'VIU COMO É BACANA USAR O EMPREENDEKIT? ENTÃO EXPERIMENTE!'
                    }),
                    /* botão */
                    new app.ui.tag('div', {
                        attributes : {
                            style : 'text-align:center;'
                        },
                        html : [
                            new app.ui.tag('a', {
                                attributes : {
                                    style : 'display: block; text-align:center; background-color:#fdfdeb; color:5e93ab; padding:20px; font-family:Arial,Helvetica,sans-serif; font-size: 20px; width:200px; margin: auto; cursor:pointer;'
                                },
                                html : 'Experimente já!',
                                events : {
                                    click : function () {
                                        app.open({app : app.slug(), route : '/cadastrar'});
                                        app.close();
                                    }
                                }
                            })
                        ]
                    }),
                    /* observacao */
                    new app.ui.tag('div', {
                        attributes : {
                            style : 'font-family:Verdana,Helvetica,sans-serif; padding:10px 0 50px 0; color:#fdfdeb; text-align:center; font-size:12px;'
                        },
                        html : 'e teste gratuitamente por 15 dias!'
                    }),
                ]
            })
        ]
    });

/*
 * -----------------------------------------------------------------------------
 * Mete tudo na tela
 * -----------------------------------------------------------------------------
 */
    app.ui.html.add([header, ask, faq, footer_signup]);
});