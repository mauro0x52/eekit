app.routes.dialog('/esqueci-minha-senha', function (params, data) {
    app.ui.title('Esqueci minha senha');

    var username,
        fieldsets = {};

    username = new app.ui.inputText({
        legend : 'Seu email',
        name : 'username',
        rules : [
            {rule : /.{3,}/, message : 'campo obrigatório'},
            {rule : /^[a-z0-9\.\_\-]+\@[a-z0-9\-]+(\.[a-z]+)+$/i, message : 'email inválido'}
        ]
    });


    fieldsets.fieldset = new app.ui.fieldset({
        legend : 'Email',
        fields : [username]
    });

    app.ui.description('Você receberá em seu email um link com acesso à sua conta. Nesse link você poderá escolher sua nova senha.')

    app.ui.form.fieldsets.add([fieldsets.fieldset]);
    app.ui.form.action('enviar email!');

    //password.focus();

    app.ui.form.submit(function () {
        app.ajax.post({
            url : 'http://' + app.config.services.auth.host + ':' + app.config.services.auth.port + '/user/forgot-password',
            data : {
                username : username.value()
            }
        }, function (response) {
            if (response && response.error) {
                if (response.error.name && response.error.name === 'NotFoundError') {
                    app.ui.error('Este email não está cadastrado');
                } else {
                    app.ui.error('Erro ao enviar email');
                }
            } else {
                app.ui.success('Email enviado para '+username.value());
                app.ui.form.action('fechar');
                fieldsets.fieldset.visibility('hide');
                app.ui.form.submit(function () {
                    app.close();
                })
            }
        });
    });
});