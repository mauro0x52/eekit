app.routes.dialog('/login', function (params, data) {
    app.ui.title('Logar no EmpreendeKit');

    var login = new app.ui.inputText({legend : 'Email', name : 'login'}),
        password = new app.ui.inputPassword({legend : 'Senha', name : 'password'}),
        forgotpassword = new app.ui.inputSelector({
            type : 'multiple',
            name : 'forgot',
            legend : '',
            options : [
                new app.ui.inputOption({legend : 'Esqueci minha senha', value : 'true'})
            ],
            change : function () {
                app.ajax.post({
                    url : 'http://' + app.config.services.auth.host + ':' + app.config.services.auth.port + '/user/forgot-password',
                    data : {
                        username : login.value()
                    }
                });
                app.close();
            }
        }),
        remindme = new app.ui.inputSelector({
            type : 'multiple',
            name : 'remindme',
            legend : '',
            options : [
                new app.ui.inputOption({legend : 'lembrar de mim', value : 'true'})
            ]
        }),
        fieldset = new app.ui.fieldset({
            legend : 'login',
            fields : [login, password, remindme/*, forgotpassword*/]
        });

    app.ui.form.fieldsets.add(fieldset);
    app.ui.form.action('logar');

    login.focus();

    app.ui.form.submit(function () {
        app.ajax.post({
            url : 'http://' + app.config.services.auth.host + ':' + app.config.services.auth.port + '/user/login',
            data : {
                username : login.value(),
                password : password.value()
            }
        }, function (response) {
            if (response && !response.error) {
                app.tracker.event('autenticar');
                app.close({token : response.token, remindme : remindme.value()[0] ? true : false});
            } else {
                app.ui.error('Erro com login ou senha');
            }
        });
    });
});