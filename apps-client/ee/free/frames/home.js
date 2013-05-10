/**
 * Home
 *
 * @author Mauro Ribeiro
 * @since  2013-04
 */

app.routes.frame('/', function (params, data) {
    app.tracker.event('visualizar: principal');

    var header, content_header, content_signup, content_title, content_apps, footer_signup, app_contacts, app_finances, app_tasks, app_scroller, scroll_animation_style, contacts_button, tasks_button, finances_button, app_button_style, selected_app_button_style;

    scroll_animation_style = 'transition: all 0.4s ease; -webkit-transition: all 0.4s ease; -moz-transition: all 0.4s ease; -o-transition: all 0.4s ease;';

    app_button_style = 'padding:10px 0 5px 0; width:160px; display:inline-block; background-color:#fdfdeb; font-weight:bold; color:#cdc5be; font-family:Arial,Helvetica,sans-serif; line-height: 18px; border-radius: 5px 5px 0 0; cursor:pointer;';
    selected_app_button_style = 'padding:10px 0 5px 0; width:160px; display:inline-block; background-color:#f38305; font-weight:bold; color:#fdfdeb; font-family:Arial,Helvetica,sans-serif; line-height: 18px; border-radius: 5px 5px 0 0; cursor:pointer;';


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
                    new app.ui.tag('div', {attributes : { style : 'position: absolute; top: 20px; left:20px;'}, html : [
                        new app.ui.tag('a', {attributes : { style : 'display: block; background-image:url(/images/ee/logo.png); width:289px; height:74px; cursor:pointer;'}})
                    ]}),
                    /* menu */
                    new app.ui.tag('menu', {attributes : {style : 'position:absolute; right: 0; display:block; font-size:18px; font-family:Verdana, Helvetica, sans-serif;'}, html : [

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
                                            app.apps.open({app : app.slug(), route : '/precos-e-planos'});
                                            app.close();
                                        }
                                    }
                                })
                            ]
                        }),
                        /* como funciona */
                        new app.ui.tag('li', {
                            attributes : {
                                style : 'display:inline-block; padding: 50px 10px; margin:0;'
                            },
                            html : [
                                new app.ui.tag('a', {
                                    html : 'COMO FUNCIONA',
                                    attributes : {
                                        style : 'cursor:pointer; color:#fdfdeb;'
                                    },
                                    events : {
                                        click : function () {
                                            app.apps.open({app : app.slug(), route : '/como-funciona'});
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
                                        style : 'cursor:pointer; color:#fdfdeb;'
                                    },
                                    events : {
                                        click : function () {
                                            app.apps.open({app : app.slug(), route : '/suporte'});
                                            app.close();
                                        }
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
                                            app.apps.open({app : app.slug(), route : '/cadastrar'});
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
                                    events : {
                                        click : function () {
                                            app.apps.open({app : app.slug(), route : '/login'});
                                            app.close();
                                        }
                                    }
                                })
                            ]
                        }),
                    ]})
                ]
            })
        ]
    });

/*
 * -----------------------------------------------------------------------------
 * Content Header
 * -----------------------------------------------------------------------------
 */
    content_header = new app.ui.tag('div', {
        attributes : {
            style : 'background-color:#5e93ab; background-image: linear-gradient(bottom, rgb(94,147,171) 0%, rgb(43,79,103) 100%); background-image: -o-linear-gradient(bottom, rgb(94,147,171) 0%, rgb(43,79,103) 100%); background-image: -moz-linear-gradient(bottom, rgb(94,147,171) 0%, rgb(43,79,103) 100%); background-image: -webkit-linear-gradient(bottom, rgb(94,147,171) 0%, rgb(43,79,103) 100%); background-image: -ms-linear-gradient(bottom, rgb(94,147,171) 0%, rgb(43,79,103) 100%); position:relative; height: 420px;'
        },
        html : [
            /* wrapper */
            new app.ui.tag('div', {
                attributes : {
                    style : 'width:1000px; margin:auto; position:relative;'
                },
                html : [
                    /* imagem */
                    new app.ui.tag('div', {
                        attributes : { style : 'position: absolute; top: 0; left:-60px; display: block; background-image:url(/images/ee/notebook.png); width:607px; height:395px;'}
                    }),
                    /* direita*/
                    new app.ui.tag('div', {
                        attributes : {
                            style : 'margin-left: 540px;'
                        },
                        html : [
                            /* título */
                            new app.ui.tag('h1', {
                                html : 'FERRAMENTA DE GESTÃO PARA MICROEMPRESÁRIOS',
                                attributes : {
                                    style : 'font-family:Arial,Helvetica,sans-serif; color:#fdfdeb; font-size:30px; font-weight: bold; line-height: 1.2em; margin:0; padding: 60px 0 20px 0;'
                                }
                            }),
                            /* subtítulo */
                            new app.ui.tag('h2', {
                                html : 'Simples. Rápido. Barato.',
                                attributes : {
                                    style : 'font-family:Arial,Helvetica,sans-serif; color:#fdfdeb; font-size:28px; line-height: 1.2em; font-weight: normal; margin: 0; padding: 0 0 20px 0'
                                }
                            }),
                            /* feature: contatos */
                            new app.ui.tag('div', {
                                attributes : { style : 'position:relative; color: #fdfdeb; font-size:14px; padding: 15px 0 15px 50px;'},
                                html : [
                                    new app.ui.tag('div', {
                                        attributes : {
                                            style : 'float: left; background-image: url(/images/tools.png);background-position: -80px 0; width:40px; height:40px;position:absolute; top:3px; left:0; '
                                        }
                                    }),
                                    new app.ui.tag('div', {
                                        html : 'Organize seus contatos'
                                    })
                                ]
                            }),
                            /* feature: tarefas */
                            new app.ui.tag('div', {
                                attributes : { style : 'position:relative; color: #fdfdeb; font-size:14px; padding: 15px 0 15px 80px;'},
                                html : [
                                    new app.ui.tag('div', {
                                        attributes : {
                                            style : 'background-image: url(/images/tools.png);background-position: -40px 0; width:40px; height:40px; position:absolute; top:3px; left:30px;'
                                        }
                                    }),
                                    new app.ui.tag('div', {
                                        html : 'Gerencie suas tarefas'
                                    })
                                ]
                            }),
                            /* feature: finanças */
                            new app.ui.tag('div', {
                                attributes : { style : 'position:relative; color: #fdfdeb; font-size:16px; padding: 15px 0 15px 110px;'},
                                html : [
                                    new app.ui.tag('div', {
                                        attributes : {
                                            style : 'background-image: url(/images/tools.png);background-position: -120px 0; width:40px; height:40px; position:absolute; top:3px; left:60px;'
                                        }
                                    }),
                                    new app.ui.tag('div', {
                                        html : 'Cuide das suas finanças'
                                    })
                                ]
                            })
                        ]
                    })
                ]
            })
        ]
    });

/*
 * -----------------------------------------------------------------------------
 * Cadastro
 * -----------------------------------------------------------------------------
 */
    content_signup = new app.ui.tag('div', {
        attributes : {
            style : 'background-color:#2b4f67; position:relative; height:120px;'
        },
        /* wrapper */
        html : [
            /* borda branca */
            new app.ui.tag('div', {
                attributes : { style : 'position: absolute; top: -10; display: block; background-image:url(/images/ee/border-wave-w.png); border-bottom: 8px solid #fdfdeb; height: 6px; width: 100%;'}
            }),
            /* borda azul */
            new app.ui.tag('div', {
                attributes : { style : 'position: absolute; top: -4; display: block; background-image:url(/images/ee/border-wave-db.png); border-bottom: 10px solid #2b4f67; height: 6px; width: 100%;'}
            }),
            /* wrapper */
            new app.ui.tag('div', {
                attributes : {
                    style : 'width:1000px; margin:auto; position:relative;'
                },
                html : [
                    /* frase */
                    new app.ui.tag('div', {
                        attributes : {
                            style : 'position:absolute; font-weight:bold; color:#fdfdeb; font-size: 28px; font-family:Arial,Helvetica,sans-serif; left:120px; top:36px;'
                        },
                        html : [
                            new app.ui.tag('span', { html : 'Experimente' }),
                            new app.ui.tag('span', { html : ' grátis ', attributes : { style : 'color:#f08220;'}}),
                            new app.ui.tag('span', { html : 'por 15 dias!'})
                        ]
                    }),
                    /* subfrase */
                    new app.ui.tag('div', {
                        attributes : {
                            style : 'position:absolute; font-weight:bold; color:#fdfdeb; font-size: 20px; font-family:Arial,Helvetica,sans-serif; left:120px; top:68px;'
                        },
                        html : [
                            new app.ui.tag('span', { html : 'cadastre-se', attributes : { style : 'color:#f08220;'}}),
                            new app.ui.tag('span', { html : ', leva menos que 30 segundos'})
                        ]
                    }),
                    /* botão */
                    new app.ui.tag('div', {
                        attributes : {
                            style : 'position:absolute; left: 605px; top:31px;'
                        },
                        html : [
                            new app.ui.tag('a', {
                                html : 'Experimente já!',
                                attributes : {
                                    style : 'display: block; text-align:center; background-color:#fdfdeb; color:5e93ab; padding:20px; font-family:Arial,Helvetica,sans-serif; font-size: 20px; width:200px; margin: auto; cursor:pointer;'
                                },
                                events : {
                                    click : function () {
                                        app.apps.open({app : app.slug()()(), route : '/cadastrar'});
                                        app.close();
                                    }
                                }
                            })
                        ]
                    })
                ]
            })
        ]
    });

/*
 * -----------------------------------------------------------------------------
 * Título dos apps
 * -----------------------------------------------------------------------------
 */
    content_title = new app.ui.tag('div', {
        attributes : {
            style : 'background-color:#fdfdeb; position:relative;'
        },
        /* wrapper */
        html : [
            /* conteudo */
            new app.ui.tag('div', {
                attributes : {
                    style : 'width:1000px; margin:auto; position:relative;'
                },
                html : [
                    /* titulo */
                    new app.ui.tag( 'h1', {
                        html : 'ECONOMIZE TEMPO NA GESTÃO DE SUA EMPRESA E GANHE TEMPO PARA OS SEUS CLIENTES',
                        attributes : {
                            style : 'color:#2b4f67; margin:auto; width:600px; font-size: 20px; text-align:center; padding: 80px 0; line-height: 1.2em; font-family:Arial,Helvetica,sans-serif;'
                        }
                    })
                ]
            })
        ]
    });

/*
 * -----------------------------------------------------------------------------
 * Vitrine de Apps
 * -----------------------------------------------------------------------------
 */
    /* contatos */
    contacts_button = new app.ui.tag ('a', {
        html : 'CONTATOS',
        attributes : {
            style : selected_app_button_style
        },
        events : {
            click : function () {
                contacts_button.attribute('style').set(selected_app_button_style);
                tasks_button.attribute('style').set(app_button_style);
                finances_button.attribute('style').set(app_button_style);
                app_scroller.attribute('style').set(scroll_animation_style + 'margin-top: 0;');
            }
        }
    });
    app_contacts = new app.ui.tag('div', {
        attributes : {
            style : 'height: 300px; position:relative;'
        },
        html : [
            /* imagem */
            new app.ui.tag('div', {
                attributes : {
                    style : 'background-image:url(/images/ee/large-app-contacts.png); background-repeat:no-repeat; width:200px; height:200px; position:absolute; top: 50px; left: 80px;'
                }
            }),
            /* titulo */
            new app.ui.tag('h2', {
                html : 'Cuide de seus contatos',
                attributes : {
                    style : 'font-size: 30px; font-weight: normal; font-family: Arial,Helvetica,sans-serif; color:#332f2f; padding: 60px 20px 25px 370px; margin:0;'
                }
            }),
            /* texto */
            new app.ui.tag('div', {
                html : 'Melhore seu processo de vendas e acompanhe o prazo dos seus contatos. Com o Empreendekit você consegue definir atividades para cada um dos seus clientes, priorizaras tarefas e ainda pode ser lembrado por email.',
                attributes : {
                    style : 'font-size: 18px; font-weight: normal; font-family: Verdana,Helvetica,sans-serif; color:#332f2f; line-height: 1.6em; margin-left: 370px; margin-right: 20px;'
                }
            })
        ]
    });

    /* tarefas */
    tasks_button = new app.ui.tag('a', {
        html : 'TAREFAS',
        attributes : {
            style : app_button_style
        },
        events : {
            click : function () {
                contacts_button.attribute('style').set(app_button_style);
                tasks_button.attribute('style').set(selected_app_button_style);
                finances_button.attribute('style').set(app_button_style);
                app_scroller.attribute('style').set(scroll_animation_style + 'margin-top: -300px;');
            }
        }
    });
    app_tasks = new app.ui.tag('div', {
        attributes : {
            style : 'height: 300px; position:relative;'
        },
        html : [
            /* imagem */
            new app.ui.tag('div', {
                attributes : {
                    style : 'background-image:url(/images/ee/large-app-tasks.png); background-repeat:no-repeat; width:200px; height:200px; position:absolute; top: 50px; left: 80px;'
                }
            }),
            /* titulo */
            new app.ui.tag('h2', {
                html : 'Organize suas tarefas',
                attributes : {
                    style : 'font-size: 30px; font-weight: normal; font-family: Arial,Helvetica,sans-serif; color:#332f2f; padding: 60px 20px 25px 370px; margin:0;'
                }
            }),
            /* texto */
            new app.ui.tag('div', {
                html : 'Não se esqueça de mais nada. Organize suas tarefas pessoais, o que tem que fazer para seus clientes e a gestão financeira em um lugar só.',
                attributes : {
                    style : 'font-size: 18px; font-weight: normal; font-family: Verdana,Helvetica,sans-serif; color:#332f2f; line-height: 1.6em; margin-left: 370px; margin-right: 20px;'
                }
            })
        ]
    });

    /* finanças */
    finances_button = new app.ui.tag('a', {
        html : 'FINANÇAS',
        attributes : {
            style : app_button_style
        },
        events : {
            click : function () {
                contacts_button.attribute('style').set(app_button_style);
                tasks_button.attribute('style').set(app_button_style);
                finances_button.attribute('style').set(selected_app_button_style);
                app_scroller.attribute('style').set(scroll_animation_style + 'margin-top: -600px;');
            }
        }
    });
    app_finances = new app.ui.tag('div', {
        attributes : {
            style : 'height: 300px; position:relative;'
        },
        html : [
            /* imagem */
            new app.ui.tag('div', {
                attributes : {
                    style : 'background-image:url(/images/ee/large-app-finances.png); background-repeat:no-repeat; width:200px; height:200px; position:absolute; top: 50px; left: 80px;'
                }
            }),
            /* titulo */
            new app.ui.tag('h2', {
                html : 'Gerencie suas finanças',
                attributes : {
                    style : 'font-size: 30px; font-weight: normal; font-family: Arial,Helvetica,sans-serif; color:#332f2f; padding: 60px 20px 25px 370px; margin:0;'
                }
            }),
            /* texto */
            new app.ui.tag('div', {
                html : 'Faça o básico da sua empresa bem feito. Controle seu fluxo de caixa e não esqueça mais das contas a pagar. Gere boletos para seus clientes da maneira mais fácil possivel.',
                attributes : {
                    style : 'font-size: 18px; font-weight: normal; font-family: Verdana,Helvetica,sans-serif; color:#332f2f; line-height: 1.6em; margin-left: 370px; margin-right: 20px;'
                }
            })
        ]
    });

    app_scroller = new app.ui.tag('div', {
        attributes : {
            style : scroll_animation_style + 'margin-top: 0'
        },
        html : [ app_contacts, app_tasks, app_finances]
    });

    content_apps = new app.ui.tag('div', {
        attributes : {
            style : 'background-color:#cdc5be; position:relative; border-top:5px solid #332f2f; height: 310px;'
        },
        /* wrapper */
        html : [
            /* conteudo */
            new app.ui.tag('div', {
                attributes : {
                    style : 'width:1000px; margin:auto; position:relative; border-top:5px solid #f38305; margin-top:-5px;'
                },
                html : [
                    /* menu */
                    new app.ui.tag('menu', {
                        attributes : {
                            style : 'text-align:center; margin-top: -38px; font-size:18px;'
                        },
                        html : [
                            /* contatos */
                            new app.ui.tag('li', {
                                attributes : {
                                    style : 'display:inline-block; margin: 0 10px'
                                },
                                html : [contacts_button]
                            }),
                            /* tarefas */
                            new app.ui.tag('li', {
                                attributes : {
                                    style : 'display:inline-block; margin: 0 10px'
                                },
                                html : [tasks_button]
                            }),
                            /* finanças */
                            new app.ui.tag('li', {
                                attributes : {
                                    style : 'display:inline-block; margin: 0 10px'
                                },
                                html : [finances_button]
                            })
                        ]
                    }),
                    /* apps */
                    new app.ui.tag('div', {
                        attributes : {
                            style : 'margin-top:5px; height:300px; overflow:hidden;'
                        },
                        /* scroller */
                        html : [
                            app_scroller
                        ]
                    }),
                    /* botão */
                    new app.ui.tag('div', {
                        attributes : {
                            style : 'position: absolute; top: 230px; right:20px; text-align: right;'
                        },
                        html : [
                            new app.ui.tag('a', {
                                html : 'saiba mais',
                                attributes : {
                                    style : 'display: block; text-align:center; background-color:#332f2f; color:#cdc5be; padding:20px; font-family:Arial,Helvetica,sans-serif; font-size: 20px; width:200px; cursor:pointer; z-index:10000;'
                                },
                                events : {
                                    click : function () {
                                        app.apps.open({app : app.slug()()(), route : '/como-funciona'});
                                        app.close();
                                    }
                                }
                            })
                        ]
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
                        html : 'COMECE JÁ A ECONOMIZAR TEMPO PARA SUA EMPRESA!'
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
                                        app.apps.open({app : app.slug()()(), route : '/cadastrar'});
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
      app.ui.html.add([header, content_header, content_signup, content_title, content_apps, footer_signup])
});