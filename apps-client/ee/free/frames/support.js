/**
 * Suporte
 *
 * @author Mauro Ribeiro
 * @since  2013-02
 */

app.routes.frame('/suporte', function (params, data) {
    app.tracker.event('visualizar suporte');

    app.ui.html([
        {
            tag : 'h1',
            attributes : {
                style : 'left: 0; color:#2b4f67; font-size:24px; font-family:Arial,Helvetica,sans-serif; line-height:1.2em; margin: 40px 0 0 20px;'
            },
            html : 'Quer saber como o EmpreendeKit<br />pode funcionar para sua empresa?'
        },
        {
            tag : 'h2',
            attributes : {
                style : 'left: 0; color:#F38305; font-size:24px; font-family:Arial,Helvetica,sans-serif; line-height:1.2em; margin: 10px 0 40px 20px;'
            },
            html : 'Vamos conversar!'
        },
        {
            tag : 'p',
            attributes : {
                style : 'left: 0; color:#332F2F; font-size:14px; font-family:Arial,Helvetica,sans-serif; line-height:1.2em; margin: 20px 0 10px 20px;'
            },
            html : 'Entre em contato conosco:'
        },
        {
            tag : 'p',
            attributes : {
                style : 'left: 0; color:#332F2F; font-size:14px; font-family:Arial,Helvetica,sans-serif; line-height:1.2em; margin: 10px 0 10px 40px;'
            },
            html : 'email: <a href="mailto:gabriel@empreendemia.com.br">gabriel@empreendemia.com.br</a>'
        },
        {
            tag : 'p',
            attributes : {
                style : 'left: 0; color:#332F2F; font-size:14px; font-family:Arial,Helvetica,sans-serif; line-height:1.2em; margin: 10px 0 20px 40px;'
            },
            html : 'skype: empreendemia'
        },
        {
            tag : 'div',
            attributes : {
                style : 'background-color:#2b4f67; font-size:14x; color:#fff; font-weight:bold; width: 300px; border-radius:8px; padding:10px 20px; text-align:center; margin: 120px 20px 0 20px; font-family:Arial,Helvetica,sans-serif; cursor:pointer;'
            },
            html : [
                {
                    tag : 'p',
                    html : 'Já tirei minhas dúvidas.',
                    attributes : {
                        style : 'margin: 5px 0;'
                    }
                },
                {
                    tag : 'p',
                    html : 'Quero experimentar <span style="color:#f38305">grátis</span>!',
                    attributes : {
                        style : 'margin: 5px 0;'
                    }
                }
            ],
            events : {
                click : function () {
                    app.empreendemia.user.signup();
                }
            }
        }
    ]);
});