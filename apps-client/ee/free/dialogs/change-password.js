app.routes.dialog('/alterar-senha/:id', function (params, data) {
    app.ui.title('Alterar senha');

    var password, password_confirmation,
        fieldsets = {};

    function validate () {
        var validate = true;
        if (password.value() !== password_confirmation.value()) {
            password_confirmation.errors.add(new app.ui.inputError({ message : 'as senhas não conferem' }));
            validate = false;
        }
        return validate;
    }

    password = new app.ui.inputPassword({
        legend : 'Nova senha',
        name : 'password',
        rules : [
            { rule : /.{5,}/, message : 'pelo menos 5 caracteres' }
        ]
    });

    password_confirmation = new app.ui.inputPassword({
        legend : 'Confirmar nova senha',
        name : 'password'
    });

    fieldsets.fieldset = new app.ui.fieldset({
        legend : 'Alterar senha',
        fields : [password, password_confirmation]
    });

    app.ui.form.fieldsets.add([fieldsets.fieldset]);
    app.ui.form.action('alterar!');

    //password.focus();

    app.ui.form.submit(function () {
        if (validate()) {
            app.ajax.post({
                url : 'http://' + app.config.services.auth.host + ':' + app.config.services.auth.port + '/user/'+params.id+'/change-password',
                data : {
                    password : password.value(),
                    password_confirmation : password_confirmation.value()
                }
            }, function (response) {
                if (response && response.error) {
                    app.ui.error('Erro ao alterar senha');
                } else {
                    app.ui.success('Senha alterada com sucesso!');
                    app.ui.form.action('fechar');
                    fieldsets.fieldset.visibility('hide');
                    app.ui.form.submit(function () {
                        app.close();
                    })
                }
            });
        }
    });
});