/**
 * Adiciona usuário
 *
 * @author Rafael Erthal
 * @since 2013-04
 */
app.routes.dialog('/adicionar-usuario', function (params, data) {
    app.ui.title('Adicionar usuário');

    var name, login, password,
        fieldsets = {},
        token;

    name = new app.ui.inputText({
        legend : 'Nome',
        name : 'login',
        rules : [
            {rule : /.{3,}/, message : 'campo obrigatório'},
            {rule : /^[a-zàáâãäåçèéêëìíîïñðóòôõöøùúûüýÿ\s]*$/i, message : 'apenas caracteres alfanuméricos'},
        ]
    });

    login = new app.ui.inputText({
        legend : 'Email',
        name : 'login',
        rules : [
            {rule : /.{3,}/, message : 'campo obrigatório'},
            {rule : /^[a-z0-9\.\_\-]+\@[a-z0-9\-]+(\.[a-z]+)+$/i, message : 'email inválido'}
        ]
    });

    password = new app.ui.inputPassword({
        legend : 'Senha',
        name : 'password',
        rules : [
            { rule : /.{5,}/, message : 'pelo menos 5 caracteres' }
        ]
    });

    fieldsets.user = new app.ui.fieldset({
        legend : 'Dados de cadastro',
        fields : [name, login, password]
    });

    app.ui.form.fieldsets.add([fieldsets.user]);
    app.ui.form.action('cadastrar!');

    name.focus();

    app.ui.form.submit(function () {
        app.ajax.post({
            url : 'http://' + app.config.services.auth.host + ':' + app.config.services.auth.port + '/user',
            data : {
                username : login.value(),
                password : password.value(),
                name : name.value(),
                secret : app.config.services.www.secret
            }
        }, function (response) {
            if (!response || response.error) {
                app.ui.error('Erro ao cadastrar usuário');
                if (response.error.name === 'ValidationError' && response.error.errors.username && response.error.errors.username.type ) {
                    login.errors.add(new app.ui.inputError({ message : 'este email já está cadastrado' }));
                }
            } else {
                app.trigger('create user', {name : name.value()});
                app.close();
            }
        });
    });
});