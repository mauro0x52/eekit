/**
 * Home
 *
 * @author Mauro Ribeiro
 * @since  2013-04
 */

app.routes.frame('/', function (params, data) {
    app.event('visualizar: principal');

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
                        new app.ui.tag('a', {attributes : { style : 'display: block; background-image:url(/images/ee/logo.png); width:289px; height:74px;'}})
                    ]}),
                    /* menu */
                    new app.ui.tag('menu', {attributes : {style : 'position:absolute; right: 0; display:block; font-size:18px; font-family:Verdana, Helvetica, sans-serif;'}, html : [
                        /* login */
                        new app.ui.tag('li', {
                            attributes : {
                                style : 'display:inline-block; padding: 50px 10px; margin:0 0 0 20px;'
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
 * Mete tudo na tela
 * -----------------------------------------------------------------------------
 */
      app.ui.html.add([header, content_header])
});