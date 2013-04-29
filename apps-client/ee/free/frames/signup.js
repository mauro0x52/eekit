/**
 * Página de cadastro
 *
 * @author Mauro Ribeiro
 * @since  2013-04
 */

app.routes.frame('/cadastrar', function (params, data) {
    app.tracker.event('visualizar: cadastro');

    var styles, header, content_header, content_form, form, topics,
        inputs = {}, error_message,
        event_name = false, event_company = false, event_phone = false, event_email = false, event_password = false;


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
 * Header do conteúdo
 * -----------------------------------------------------------------------------
 */
    content_header = {
        tag : 'div',
        attributes : {
            style : ' background-color:#fdfdeb;'
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
                    html : 'Cadastre-se para testar gratuitamente por 15 dias',
                    attributes : {
                        style : 'color:#5e93ab; font-family:Arial,Helvetica,sans-serif; font-size:25px; font-weight:bold; margin:0; padding:60px 20px 20px 20px; line-height: em;'
                    }
                },
                {
                    tag : 'h2',
                    html : 'Tudo simples e sem compromisso!',
                    attributes : {
                        style : 'color:#5e93ab; font-family:Arial,Helvetica,sans-serif; font-size:20px; font-weight:bold; margin:0; padding:0 20px 60px 20px; line-height: em;'
                    }
                }
            ]
        }
    };


/*
 * -----------------------------------------------------------------------------
 * Mensagem de erro
 * -----------------------------------------------------------------------------
 */

    styles.html = '.error_message {position:absolute; width:920px; top:-10px; left:20px; background-color:#cc0000; padding:20px 20px 20px 20px; color:#fff; border-radius:8px; font-weight:bold; opacity:0; transition: all 0.4s ease; -webkit-transition: all 0.4s ease; -moz-transition: all 0.4s ease; -o-transition: all 0.4s ease;}';

    error_message = new app.ui.tag({
        tag : 'div',
        attributes : {
            'class': 'error_message'
        },
        html : ''
    });

/*
 * -----------------------------------------------------------------------------
 * Formulário
 * -----------------------------------------------------------------------------
 */

    styles.html += '::-webkit-input-placeholder {color: #B9AC9F; font-style:italic;}';
    styles.html += '.input:-moz-placeholder {color: #B9AC9F; font-style:italic;}';
    styles.html += '.input::-moz-placeholder {color: #B9AC9F; font-style:italic;}';
    styles.html += '.input {background-color:#fdfdeb; outline:none; padding:5px 10px; border-radius:8px; border:none;font-size: 20px; color:#333030; width: 400px; transition: all 0.4s ease; -webkit-transition: all 0.4s ease; -moz-transition: all 0.4s ease; -o-transition: all 0.4s ease;}';
    styles.html += '.input:valid {color: #5E93AB;}';
    styles.html += '.input:invalid {color: #cc0000;}';
    styles.html += '.input:focus {background-color:#fff; box-shadow:0 0 15px rgba(255,255,230,0.9); color:#333030;}';

inputs.name = new app.ui.tag({
    tag : 'input',
    attributes : {
        'type' : 'text',
        'class' : 'input',
        'required' : 'true',
        'pattern' : '^[a-zA-Z0-9][a-zA-Z0-9 ]+$',
        'placeholder' : 'ex.: Fulano de Tal'
    },
    events : {
        keydown : function () {
            if (event_name === false) {
                app.tracker.event('cadastrar: nome');
                event_name = true;
            }
        }
    }
});

    inputs.company = new app.ui.tag({
       tag : 'input',
       type : 'text',
       attributes : {
           'type' : 'text',
           'class' : 'input',
           'required' : 'true',
           'pattern' : '^[a-zA-Z0-9].+$',
           'placeholder' : 'ex.: Fulano e Cia.'
       },
        events : {
            keydown : function () {
                if (event_company === false) {
                    app.tracker.event('cadastrar: empresa');
                    event_company = true;
                }
            }
        }
    });

    inputs.phone = new app.ui.tag({
       tag : 'input',
       attributes : {
           'type' : 'text',
           'class' : 'input',
           'required' : 'true',
           'pattern' : '^((\\(0?[1-9][01-9]\\))|(0?[1-9][1-9])|(0?[1-9][1-9]))\\s?9?\\s?\\d{4}[\\s\\-]?\\d{4}$',
           'placeholder' : 'ex.: (11) 3230-9233'
       },
        events : {
            keydown : function () {
                if (event_phone === false) {
                    app.tracker.event('cadastrar: telefone');
                    event_phone = true;
                }
            }
        }
    });

    inputs.email = new app.ui.tag({
       tag : 'input',
       attributes : {
        type : 'email',
           'class' : 'input',
           'required' : 'true',
           'placeholder' : 'ex.: fulano@fulanoecia.com.br'
       },
        events : {
            keydown : function () {
                if (event_email === false) {
                    app.tracker.event('cadastrar: email');
                    event_email = true;
                }
            }
        }
    });

    inputs.password = new app.ui.tag({
       tag : 'input',
       type : 'text',
       attributes : {
           'type' : 'password',
           'class' : 'input',
           'required' : 'true',
           'pattern' : '^.{6,}$',
           'placeholder' : 'ex.: ful4n0d3t4l (pelo menos 6 caracteres)'
       },
        events : {
            keydown : function () {
                if (event_password === false) {
                    app.tracker.event('cadastrar: password');
                    event_password = true;
                }
            }
        }
    });


    form = {
        tag : 'form',
        html : [
            {
                tag : 'div',
                attributes : {
                    style : 'margin: 15px 0;'
                },
                html : [
                    {
                        tag : 'div',
                        html : 'Seu nome',
                        attributes : {
                            style : 'width:150px; padding:8px 20px 5px 20px; text-align:right; color:#fdfdeb; font-size: 18px; font-weight: bold; font-family:Arial,Helvetica,sans-serif; float:left;'
                        }
                    },
                    inputs.name
                ]
            },
            {
                tag : 'div',
                attributes : {
                    style : 'margin: 15px 0;'
                },
                html : [
                    {
                        tag : 'div',
                        html : 'Empresa',
                        attributes : {
                            style : 'width:150px; padding:8px 20px 5px 20px; text-align:right; color:#fdfdeb; font-size: 18px; font-weight: bold; font-family:Arial,Helvetica,sans-serif; float:left;'
                        }
                    },
                    inputs.company
                ]
            },
            {
                tag : 'div',
                attributes : {
                    style : 'margin: 15px 0;'
                },
                html : [
                    {
                        tag : 'div',
                        html : 'Telefone',
                        attributes : {
                            style : 'width:150px; padding:8px 20px 5px 20px; text-align:right; color:#fdfdeb; font-size: 18px; font-weight: bold; font-family:Arial,Helvetica,sans-serif; float:left;'
                        }
                    },
                    inputs.phone
                ]
            },
            {
                tag : 'div',
                attributes : {
                    style : 'margin: 40px 0 15px 0;'
                },
                html : [
                    {
                        tag : 'div',
                        html : 'E-mail',
                        attributes : {
                            style : 'width:150px; padding:8px 20px 5px 20px; text-align:right; color:#fdfdeb; font-size: 18px; font-weight: bold; font-family:Arial,Helvetica,sans-serif; float:left;'
                        }
                    },
                    inputs.email
                ]
            },
            {
                tag : 'div',
                attributes : {
                    style : 'margin: 15px 0;'
                },
                html : [
                    {
                        tag : 'div',
                        html : 'Senha',
                        attributes : {
                            style : 'width:150px; padding:8px 20px 5px 20px; text-align:right; color:#fdfdeb; font-size: 18px; font-weight: bold; font-family:Arial,Helvetica,sans-serif; float:left;'
                        }
                    },
                    inputs.password
                ]
            },
            {
                tag : 'div',
                attributes : {
                    style : 'text-align:right; margin: 40px 10px;'
                },
                html : [
                    {
                        tag : 'input',
                        attributes : {
                            type : 'submit',
                            value : 'Cadastrar!',
                            style : 'text-align:center; background-color:#F38305; color:#fdfdeb; text-shadow:2px 2px 2px rgba(0,0,0,0.5); padding:20px; font-family:Arial,Helvetica,sans-serif; font-size: 20px; width:200px; cursor:pointer; border:0;'
                        }
                    }
                ]
            }
        ],
        events : {
            submit : function (evt) {
                evt.preventDefault();
                var data = {
                    name : inputs.company.value(),
                    admin : {
                        name : inputs.name.value(),
                        username : inputs.email.value(),
                        password : inputs.password.value(),
                        informations : {
                            phone : inputs.phone.value()
                        }
                    }
                }
                app.ajax.post({
                    url : 'http://' + app.config.services.auth.host + ':' + app.config.services.auth.port + '/company',
                    data : data
                }, function (response) {
                    if (!response || response.error) {
                        error_message.attribute('style').set('opacity:1;top:-32px;');
                        error_message.html('Desculpe-nos, mas ocorreu um erro em nossos servidores. Tente novamente mais tarde.')
                        if (response.error.name === 'ValidationError' && response.error.errors.username && response.error.errors.username.type ) {
                            error_message.html('O email '+data.admin.username+' já está cadastrado em nosso sistema.')
                        }
                    } else {
                        var token = response.token;
                        app.tracker.event('cadastrar');
                        app.empreendemia.user.signup(token);
                        app.close();
                    }
                });
            }
        }
    }


    /*
     * -------------------------------------------------------------------------
     * Tópicos
     * -------------------------------------------------------------------------
     */
    topics = {
        tag : 'div',
        attributes : {
            style : 'background-color:#333030; border-radius:8px; margin: 10px 20px; padding:20px; text-align:left; color:#fdfdeb;'
        },
        html : [
            /* dados seguros */
            {
                tag : 'div',
                attributes : {
                    style : 'height: 90px; padding:10px 0; position:relative;'
                },
                html : [
                    {
                        tag : 'div',
                        attributes : {
                            style : 'background-image:url(/images/ee/topic_1.png); background-repeat:no-repeat; width:100px; height:100px; position:absolute; left:15px;top:10px;'
                        }
                    },
                    {
                        tag : 'div',
                        html : 'Seus dados estão seguros',
                        attributes : {
                            style : 'color:#B9AC9F; font-weight:bold; font-size: 16px; font-family:Arial,Helvetica,sans-serif; margin-left:100px;'
                        }
                    },
                    {
                        tag : 'div',
                        html : 'Nós nos preocupamos com a sua segurança e garantimos que suas informações são confidenciais',
                        attributes : {
                            style : 'font-size: 12px; margin:10px 0 20px 100px;'
                        }
                    }
                ]
            },
            /* dados de pagamento */
            {
                tag : 'div',
                attributes : {
                    style : 'height: 90px; padding:10px 0; position:relative;'
                },
                html : [
                    {
                        tag : 'div',
                        attributes : {
                            style : 'background-image:url(/images/ee/topic_2.png); background-repeat:no-repeat; width:100px; height:100px; position:absolute; left:10px;top:10px;'
                        }
                    },
                    {
                        tag : 'div',
                        html : 'Não vamos te pedir dados de pagamento',
                        attributes : {
                            style : 'color:#B9AC9F; font-weight:bold; font-size: 16px; font-family:Arial,Helvetica,sans-serif; margin-left:100px;'
                        }
                    },
                    {
                        tag : 'div',
                        html : 'Se você não quiser mais usar após o teste, não será cobrado!',
                        attributes : {
                            style : 'font-size: 12px; margin:10px 0 20px 100px;'
                        }
                    }
                ]
            },
            /* tudo online */
            {
                tag : 'div',
                attributes : {
                    style : 'height: 80px; padding:10px 0; position:relative;'
                },
                html : [
                    {
                        tag : 'div',
                        attributes : {
                            style : 'background-image:url(/images/ee/topic_3.png); background-repeat:no-repeat; width:100px; height:100px; position:absolute; left:10px;top:10px;'
                        }
                    },
                    {
                        tag : 'div',
                        html : 'Tudo online, sem downloads',
                        attributes : {
                            style : 'color:#B9AC9F; font-weight:bold; font-size: 16px; font-family:Arial,Helvetica,sans-serif; margin-left:100px;'
                        }
                    },
                    {
                        tag : 'div',
                        html : 'É só cadastrar e usar. Não precisa instalar nada. Simples assim!',
                        attributes : {
                            style : 'font-size: 12px; margin:10px 0 20px 100px;'
                        }
                    }
                ]
            }
        ]
    }

    /*
     * -------------------------------------------------------------------------
     * Conteúdo
     * -------------------------------------------------------------------------
     */
    content_form = {
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
            /* borda inferior branca */
            {
                tag : 'div',
                attributes : { style : 'position: absolute; bottom: 0; display: block; background-image:url(/images/ee/border-wave-w.png); border-bottom: 5px solid #fdfdeb; height: 6px; width: 100%;'}
            },
            /* wrapper */
            {
                tag : 'div',
                attributes : {
                    style : 'width:1000px; margin:auto; position:relative; padding: 40px 0 40px 0;'
                },
                html : [
                    /* mensagem de erro */
                    error_message,
                    /* formulário */
                    {
                        tag : 'div',
                        attributes : {
                            style : 'width:600px; float:left;'
                        },
                        html : form
                    },
                    /* topics */
                    {
                        tag : 'div',
                        attributes : {
                            style : 'text-align:center;'
                        },
                        html : {
                            tag : 'a',
                            attributes : {
                                style : 'width:400px; float:right;'
                            },
                            html : topics
                        }
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
 * Põe tudo na tela
 * -----------------------------------------------------------------------------
 */
    app.ui.html([styles, header, content_header, content_form]);
});