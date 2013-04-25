/**
 * Preços e Planos
 *
 * @author Mauro Ribeiro
 * @since  2013-04
 */

app.routes.frame('/planos', function (params, data) {
    app.tracker.event('visualizar planos');

    var header, prices, footer_signup, table_header, plan, table_plan_1, table_plan_2, table_plan_3;


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
                                },
                                events : {
                                    click : function () {
                                        app.apps.open({app : app.slug, route : '/duvidas'});
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
                                html : 'Login',
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
 * Tabela de preços
 * -----------------------------------------------------------------------------
 */

    /* header */
    table_header = {
        tag : 'div',
        attributes : {
            style : 'font-family:Arial,Helvetica,sans-serif; width: 240px; float:left; margin-right:-10px; border:1px solid #fdfdeb; text-align:center; color:#fdfdeb; text-shadow: -1px -1px 1px rgba(0,0,0,0.4); font-size: 18px; '
        },
        html : [
            {
                tag : 'div',
                html : 'Pacotes',
                attributes : {
                    style : 'background-color:#333030; border-radius: 10px 0 0 0; height:180px; line-height:180px; padding-right:10px; font-size: 20px; border-bottom:1px solid #211'
                }
            },
            {
                tag : 'div',
                html : 'Número de usuários',
                attributes : {
                    style : 'background-color:#B9AC9F; height:100px; line-height:100px; padding-right:10px; border-top: 1px solid #dad0c6; border-bottom:1px solid #948a80;'
                }
            },
            {
                tag : 'div',
                html : 'Ferramentas',
                attributes : {
                    style : 'background-color:#B9AC9F; height:140px; line-height:140px; padding-right:10px; border-top: 1px solid #dad0c6; border-bottom:1px solid #948a80;'
                }
            },
            {
                tag : 'div',
                html : 'Suporte',
                attributes : {
                    style : 'background-color:#B9AC9F; border-radius: 0 0 0 10px; height:80px; line-height:80px; padding-right:10px; border-top: 1px solid #dad0c6; border-bottom:1px solid #948a80;'
                }
            }
        ]
    }

    /* plano */
    plan = function (data, featured) {
        var tools = [], html;

        for (var i in data.tools) {
            tools.push({
                tag : 'div',
                html : data.tools[i]
            });
        }

        html = {
            tag : 'div',
            attributes : {
                style : 'width: 240px; float:left; margin-right:-1px; border:1px solid #fff; border-radius:10px; background-color:#dddddd; text-align:center; z-index:1000;' + (featured ? 'background-color:#e8e8e8; box-shadow:0 0 20px rgba(0,0,0,0.5); z-index:10000; position:relative; top:-10px;' : '')
            },
            html : [
                /* header */
                {
                    tag : 'div',
                    attributes : {
                        style : 'height:180px; background-color:#5d93ab; position:relative; border-radius:8px 8px 0 0;' + (featured ? 'height:190px;linear-gradient(bottom, rgb(94,147,171) 0%, rgb(139,184,205) 100%); background-image: -o-linear-gradient(bottom, rgb(94,147,171) 0%, rgb(139,184,205) 100%); background-image: -moz-linear-gradient(bottom, rgb(94,147,171) 0%, rgb(139,184,205) 100%); background-image: -webkit-linear-gradient(bottom, rgb(94,147,171) 0%, rgb(139,184,205) 100%); background-image: -ms-linear-gradient(bottom, rgb(94,147,171) 0%, rgb(139,184,205) 100%);' : 'linear-gradient(bottom, rgb(94,147,171) 0%, rgb(43,79,103) 100%); background-image: -o-linear-gradient(bottom, rgb(94,147,171) 0%, rgb(43,79,103) 100%); background-image: -moz-linear-gradient(bottom, rgb(94,147,171) 0%, rgb(43,79,103) 100%); background-image: -webkit-linear-gradient(bottom, rgb(94,147,171) 0%, rgb(43,79,103) 100%); background-image: -ms-linear-gradient(bottom, rgb(94,147,171) 0%, rgb(43,79,103) 100%);')
                    },
                    html : [
                        /* titulo */
                        {
                            tag : 'div',
                            attributes : {
                                style : 'font-family:Arial,Helvetica,sans-serif; font-weight:bold; text-shadow:1px 1px 2px rgba(0,0,0,0.8); color:#fdfdeb; padding: 20px 0 5px 0;font-size: 16px;'
                            },
                            html : data.title
                        },
                        /* subtitulo */
                        {
                            tag : 'div',
                            attributes : {
                                style : 'position:relative; width:240px; font-family:Arial,Helvetica,sans-serif; text-shadow:-1px -1px 0 rgba(0,0,0,0.4); color:#fdfdeb; font-size: 12px;' + (featured ? 'margin: 5px 0 -0 -20px; padding: 10px 0 10px 20px; background-color:#F38305;box-shadow:4px 4px 10px rgba(0,0,0,0.6); color:#333030; text-shadow:1px 1px 0 rgba(255,255,255,0.4); font-weight:bold;linear-gradient(right, rgb(243, 131, 5) 0%, rgb(255, 180, 10) 100%); background-image: -o-linear-gradient(right, rgb(243, 131, 5) 0%, rgb(255, 180, 10) 100%); background-image: -moz-linear-gradient(right, rgb(243, 131, 5) 0%, rgb(255, 180, 10) 100%); background-image: -webkit-linear-gradient(right, rgb(243, 131, 5) 0%, rgb(255, 180, 10) 100%); background-image: -ms-linear-gradient(right, rgb(243, 131, 5) 0%, rgb(255, 180, 10) 100%);' : '')
                            },
                            html : [
                                {
                                    tag : 'div',
                                    html : data.subtitle
                                },
                                /* triangulo da bandeirinha */
                                {
                                    tag : 'div',
                                    attributes : {style : (featured ? 'position: absolute; border-bottom:20px solid #633;border-left:19px solid transparent;border-top:none;border-right:none; left:0; top:-20px;' : '')}
                                },
                                /* triangulo 2 da bandeirinha */
                                {
                                    tag : 'div',
                                    attributes : {style : (featured ? 'position: absolute; border-bottom:20px solid #F38305;border-right:20px solid transparent;border-top:none;border-left:none; right:-20px; bottom:0;' : '')}
                                },
                                /* triangulo 3 da bandeirinha */
                                {
                                    tag : 'div',
                                    attributes : {style : (featured ? 'position: absolute; border-top:20px solid #F38305;border-right:20px solid transparent;border-bottom:none;border-left:none; right:-20px; top:0;' : '')}
                                }
                            ]
                        },
                        /* preço */
                        {
                            tag : 'div',
                            attributes : {
                                style : 'position:absolute; top: 120px;' + (featured ? 'top:130px;' : '')
                            },
                            html : [
                                {
                                    tag : 'div',
                                    attributes : {
                                        style : 'position:absolute; left:35px; top:-20px; font-family:Arial,Helvetica,sans-serif; font-size:20px; color:#fdfdeb; text-shadow:1px 1px 2px rgba(0,0,0,0.7);'
                                    },
                                    html : 'R$'
                                },
                                {
                                    tag : 'div',
                                    attributes : {
                                        style : 'position:absolute; left:66px; top:0; font-family:Arial,Helvetica,sans-serif; font-size:80px; color:#fdfdeb; text-shadow:1px 1px 2px rgba(0,0,0,0.7);'
                                    },
                                    html : data.price.toString()
                                },
                                {
                                    tag : 'div',
                                    attributes : {
                                        style : 'position:absolute; left:160px; top:20px; font-family:Arial,Helvetica,sans-serif; font-size:20px; color:#fdfdeb; text-shadow:1px 1px 2px rgba(0,0,0,0.7);'
                                    },
                                    html : '/mês'
                                }
                            ]
                        },
                        /* triangulo preto */
                        {
                            tag : 'div',
                            attributes : {
                                style : 'position:absolute; top:182px; border-top:21px solid rgba(0,0,0,0.1);border-left:120px solid transparent;border-right:120px solid transparent;border-bottom:none;' + (featured ? 'top:192px;' : '')
                            }
                        },
                        /* triangulo branco */
                        {
                            tag : 'div',
                            attributes : {
                                style : 'position:absolute; top:181px; border-top:21px solid #fff;border-left:120px solid transparent;border-right:120px solid transparent;border-bottom:none;' + (featured ? 'top:191px;' : '')
                            }
                        },
                        /* triangulo azul */
                        {
                            tag : 'div',
                            attributes : {
                                style : 'position:absolute; top:180px; border-top:21px solid #5d93ab;border-left:120px solid transparent;border-right:120px solid transparent;border-bottom:none;' + (featured ? 'top:190px;' : '')
                            }
                        }
                    ]
                },
                /* body */
                {
                    tag : 'div',
                    attributes : {
                        style : 'font-size: 16px; border-radius:0 0 10px 10px; overflow:hidden; padding-top: 1px;' + (featured ? 'linear-gradient(top, rgb(200,200,200) 0%, rgb(232,232,232) 10%); background-image: -o-linear-gradient(top, rgb(200,200,200) 0%, rgb(232,232,232) 10%); background-image: -moz-linear-gradient(top, rgb(200,200,200) 0%, rgb(232,232,232) 10%); background-image: -webkit-linear-gradient(top, rgb(200,200,200) 0%, rgb(232,232,232) 10%); background-image: -ms-linear-gradient(top, rgb(200,200,200) 0%, rgb(232,232,232) 10%);' : 'linear-gradient(top, rgb(200,200,200) 0%, rgb(220,220,220) 10%); background-image: -o-linear-gradient(top, rgb(200,200,200) 0%, rgb(220,220,220) 10%); background-image: -moz-linear-gradient(top, rgb(200,200,200) 0%, rgb(220,220,220) 10%); background-image: -webkit-linear-gradient(top, rgb(200,200,200) 0%, rgb(220,220,220) 10%); background-image: -ms-linear-gradient(top, rgb(200,200,200) 0%, rgb(220,220,220) 10%);')
                    },
                    html : [
                        /* numero de usuarios */
                        {
                            tag : 'div',
                            attributes : {
                                style : 'height:100px; line-height: 100px; border-top:1px solid #eee; border-bottom: 1px solid #ccc;'
                            },
                            html : 'Até '+data.users.toString()+' usuários'
                        },
                        /* ferramentas */
                        {
                            tag : 'div',
                            attributes : {
                                style : 'height:120px; vertical-align:center; border-top:1px solid #eee; border-bottom: 1px solid #ccc; padding-top:20px; line-height:30px;'
                            },
                            html : tools
                        },
                        /* suporte */
                        {
                            tag : 'div',
                            attributes : {
                                style : 'height:80px; vertical-align:center; border-top:1px solid #eee; border-bottom: 1px solid #ccc; line-height:80px;' + (featured ? 'height:90px;' : '')                            },
                            html : [
                                {
                                    tag : 'span',
                                    html : 'Suporte '
                                },
                                {
                                    tag : 'span',
                                    attributes : {
                                        style : 'font-weight:bold;' + (data.support === 'personalizado' ? 'color:#F38305;' : '')
                                    },
                                    html : data.support
                                }
                            ]
                        },
                    ]
                }
            ]
        }

        return html;
    };

    table_plan_1 = plan({
        title : 'Plano 1 mês',
        subtitle : 'só para começar',
        price : 59,
        users : 5,
        tools : ['Organize seus contatos', 'Gerencie suas tarefas', 'Cuide das suas finanças'],
        support : 'básico'
    });

    table_plan_2 = plan({
        title : 'Plano 3 meses',
        subtitle : 'mais popular',
        price : 54,
        users : 5,
        tools : ['Organize seus contatos', 'Gerencie suas tarefas', 'Cuide das suas finanças'],
        support : 'personalizado'
    }, true);

    table_plan_3 = plan({
        title : 'Plano 6 meses',
        subtitle : 'cliente VIP',
        price : 49,
        users : 5,
        tools : ['Organize seus contatos', 'Gerencie suas tarefas', 'Cuide das suas finanças'],
        support : 'personalizado'
    });



    prices = {
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
                html : {
                    /* tabela */
                    tag : 'div',
                    attributes : {
                        style : 'padding: 40px 20px; position:relative;'
                    },
                    html : [
                        /* topicos da tabela */
                        table_header,
                        /* planos */
                        table_plan_1, table_plan_2, table_plan_3,
                        /*  clear */
                        {
                            tag : 'div',
                            attributes : {
                                style : 'clear:both;'
                            }
                        }
                    ]
                }
            }
        ]
    }

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
                        html : 'BARATO, NÃO É MESMO? E VOCÊ AINDA PODE TESTAR DE GRAÇA!'
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
    app.ui.html([header, prices, footer_signup]);
});