/**
 * Home 9
 *
 * @author Mauro Ribeiro
 * @since  2013-03
 */

app.routes.frame('/lp-09', function (params, data) {
    app.tracker.event('visualizar home');

    app.ui.html([
        /* header do logo */
        {
            tag : 'div',
            attributes : {
                style : 'background-color:#2b4f67; position:relative;'
            },
            html : {
                /* container */
                tag : 'div',
                attributes : {
                    style : 'height:160px; width: 760px; margin:auto; position:relative;'
                },
                html : [
                    {
                        tag : 'img',
                        attributes : {
                            src : '/images/ee/pablito.png',
                            style : 'position:absolute; top:40px;'
                        }
                    },
                    {
                        tag : 'h1',
                        attributes : {
                            style : 'position:absolute; left: 320px; color:#fff; font-size:24px; font-family:Arial,Helvetica,sans-serif; line-height:1.2em; top: 60px;'
                        },
                        html : 'Pare de se aborrecer com planilhas<br />e foque em vender mais'
                    }
                ]
            }
        },
        /* header do printscreen */
        {
            tag : 'div',
            attributes : {
                style : 'background-color:#6096ae'
            },
            html : {
                /* container */
                tag : 'div',
                attributes : {
                    style : 'width: 760px; height: 240px; margin:auto; position:relative;'
                },
                html : [
                    {
                        tag : 'h2',
                        attributes : {
                            style : 'position:absolute; left: 0; color:#fff; font-size:20px; font-family:Arial,Helvetica,sans-serif; line-height:1.2em; top: 30px; width:350px;'
                        },
                        html : 'Uma maneira mais eficiente de cuidar dos seus clientes'
                    },
                    {
                        tag : 'p',
                        attributes : {
                            style : 'position:absolute; left: 0; color:#fff; font-size:16px; font-family:Arial,Helvetica,sans-serif; line-height:1.2em; top: 90px; width:400px;'
                        },
                        html : '51% das 250 PMEs que mais cresceram no Brasil consideram que melhorar sua relação com clientes (CRM) aumentou seu volume de vendas*.'
                    },
                    {
                        tag : 'p',
                        attributes : {
                            style : 'position:absolute; left: 0; color:#2b4f67; font-size:11px; font-family:Arial,Helvetica,sans-serif; line-height:1.2em; top: 170px; width:400px;'
                        },
                        html : '* Delloite, Revista Exame - 2012'
                    },
                    {
                        tag : 'img',
                        attributes : {
                            src : '/images/ee/printscreen.png',
                            style : 'position:absolute; bottom:0; right: 0; box-shadow: 5px 5px 10px rgba(0,0,0,0.4);'
                        }
                    }
                ]
            }
        },
        /* descrição */
        {
            tag : 'div',
            attributes : {
                style : 'position:relative; background-color:#fff; box-shadow: 0 0 10px rgba(0,0,0,0.8); height:280px'
            },
            html : {
                /* container */
                tag : 'div',
                attributes : {
                    style : 'height:160px; width:760px; margin:auto; position:relative;'
                },
                html : [
                    /* ferramentas */
                    {
                        tag : 'div',
                        attributes : {
                            style : 'position:absolute; top:20px; left:20px;'
                        },
                        html : [
                            /* contatos */
                            {
                                tag : 'div',
                                attributes : {
                                    style : 'font-size:14px; color:#2b4f67; position:absolute; top:20px; left:0; width:320px;'
                                },
                                html : [
                                    {
                                        tag : 'div',
                                        attributes : {
                                            style : 'background-image: url(/images/tools.png);background-position: -80px 0; width:40px; height:40px; position:absolute; top:0; left:0;'
                                        }
                                    },
                                    {
                                        tag : 'p',
                                        html : 'Registre seus contatos',
                                        attributes : {
                                            style : 'margin:0 0 0 50px; line-height:1.4em;'
                                        }
                                    },
                                    {
                                        tag : 'p',
                                        html : 'Organize seu processo de vendas',
                                        attributes : {
                                            style : 'margin:0 0 0 50px; line-height:1.4em;'
                                        }
                                    }
                                ]
                            },
                            /* finanças */
                            {
                                tag : 'div',
                                attributes : {
                                    style : 'font-size:14px; color:#2b4f67; position:absolute; top:90px; left:40px; width:320px;'
                                },
                                html : [
                                    {
                                        tag : 'div',
                                        attributes : {
                                            style : 'background-image: url(/images/tools.png);background-position: -120px 0; width:40px; height:40px; position:absolute; top:0; left:0;'
                                        }
                                    },
                                    {
                                        tag : 'p',
                                        html : 'Registre suas vendas',
                                        attributes : {
                                            style : 'margin:0 0 0 50px; line-height:1.4em;'
                                        }
                                    },
                                    {
                                        tag : 'p',
                                        html : 'Emita boletos facilmente',
                                        attributes : {
                                            style : 'margin:0 0 0 50px; line-height:1.4em;'
                                        }
                                    }
                                ]
                            },
                            /* tarefas*/
                            {
                                tag : 'div',
                                attributes : {
                                    style : 'font-size:14px; color:#2b4f67; position:absolute; top:160px; left:40px; width:320px;'
                                },
                                html : [
                                    {
                                        tag : 'div',
                                        attributes : {
                                            style : 'background-image: url(/images/tools.png);background-position: -40px 0; width:40px; height:40px; position:absolute; top:0; left:0;'
                                        }
                                    },
                                    {
                                        tag : 'p',
                                        html : 'Defina tarefas e lembretes',
                                        attributes : {
                                            style : 'margin:0 0 0 50px; line-height:1.4em;'
                                        }
                                    },
                                    {
                                        tag : 'p',
                                        html : 'para cada cliente',
                                        attributes : {
                                            style : 'margin:0 0 0 50px; line-height:1.4em;'
                                        }
                                    }
                                ]
                            },
                            /* setinhas */
                            {
                                tag : 'div',
                                attributes : {
                                    style : 'position:absolute; top:70px; left:10px; border-left:10px solid transparent; border-right:10px solid transparent; border-bottom:10px solid #332f2f;'
                                }
                            },
                            {
                                tag : 'div',
                                attributes : {
                                    style : 'position: absolute; top:80px; left: 17px; width:6px; height: 103px; background-color: #332f2f;'
                                }
                            },
                            {
                                tag : 'div',
                                attributes : {
                                    style : 'position: absolute; top:107px; left: 17px; width:18px; height: 6px; background-color: #332f2f;'
                                }
                            },
                            {
                                tag : 'div',
                                attributes : {
                                    style : 'position: absolute; top:177px; left: 17px; width:18px; height: 6px; background-color: #332f2f;'
                                }
                            },
                        ]
                    },
                    /* ação */
                    {
                        tag : 'div',
                        attributes : {
                            style : 'position:absolute; top:40px; left:410px; text-align:center;'
                        },
                        html : [
                            {
                                tag : 'div',
                                attributes : {
                                    style : 'background-color:#2b4f67; font-size:20px; color:#fff; font-weight:bold; width:350px; border-radius:8px; padding:30px 0; text-align:center; margin: 20px 0; font-family:Arial,Helvetica,sans-serif; cursor:pointer;'
                                },
                                html : [
                                    {
                                        tag : 'span',
                                        html : 'Experimente '
                                    },
                                    {
                                        tag : 'span',
                                        html : 'grátis',
                                        attributes : {
                                            style : 'color:#f38305;'
                                        }
                                    },
                                    {
                                        tag : 'span',
                                        html : '!'
                                    }
                                ],
                                events : {
                                    click : function () {
                                        app.empreendemia.user.signup();
                                    }
                                }
                            },
                            {
                                tag : 'div',
                                attributes : {
                                    style : 'font-size:14px; color:#2b4f67; font-weight:bold; cursor:pointer;'
                                },
                                html : 'Ou descubra como essa ferramenta<br />por ajudar a sua empresa',
                                events : {
                                    click : function () {
                                        app.apps.open({
                                            app : 'ee',
                                            route : '/suporte'
                                        })
                                        app.close();
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        },
    ]);
});