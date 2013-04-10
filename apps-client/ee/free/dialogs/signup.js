app.routes.dialog('/cadastro', function (params, data) {
    app.ui.title('Cadastre-se no EmpreendeKit!');
    app.tracker.event('cadastrar: inicio');

    var name, login, password, company, phone,
        fieldsets = {},
        token;

    function validate () {
        var validate = true;/*
        if (password.value() !== password_confirmation.value()) {
            password_confirmation.errors.add(new app.ui.inputError({ message : 'as senhas não conferem' }));
            validate = false;
        }
        if (login.value() !== login_confirmation.value()) {
            login_confirmation.errors.add(new app.ui.inputError({ message : 'os emails não conferem' }));
            validate = false;
        }*/
        return validate;
    }

    var name_tracked = false,
        phone_tracked = false,
        login_tracked = false,
        companyName_tracked = false,
        password_tracked = false;

    name = new app.ui.inputText({
        legend : 'Nome',
        name : 'login',
        rules : [
            {rule : /.{3,}/, message : 'campo obrigatório'},
            {rule : /^[a-zàáâãäåçèéêëìíîïñðóòôõöøùúûüýÿ\s]*$/i, message : 'apenas caracteres alfanuméricos'},
        ],
        change : function () {
            if (!name_tracked) {
                name_tracked = true;
                app.tracker.event('cadastrar: nome');
            }
        }
    });

    login = new app.ui.inputText({
        legend : 'Email',
        name : 'login',
        rules : [
            {rule : /.{3,}/, message : 'campo obrigatório'},
            {rule : /^[a-z0-9\.\_\-]+\@[a-z0-9\-]+(\.[a-z]+)+$/i, message : 'email inválido'}
        ],
        change : function () {
            if (!login_tracked) {
                login_tracked = true;
                app.tracker.event('cadastrar: email');
            }
        }
    });

    password = new app.ui.inputPassword({
        legend : 'Senha',
        name : 'password',
        rules : [
            { rule : /.{5,}/, message : 'pelo menos 5 caracteres' }
        ],
        change : function () {
            if (!password_tracked) {
                password_tracked = true;
                app.tracker.event('cadastrar: senha');
            }
        }
    });

    company = new app.ui.inputText({
        legend : 'Nome da Empresa',
        name : 'company',
        rules : [
            {rule : /.{3,}/, message : 'campo obrigatório'}
        ],
        change : function () {
            if (!companyName_tracked) {
                companyName_tracked = true;
                app.tracker.event('cadastrar: nome da empresa');
            }
        }
    });

    phone = new app.ui.inputText({
        legend : 'Telefone com DDD',
        name : 'phone',
        rules : [
            {rule : /.{3,}/, message : 'campo obrigatório'}
        ],
        change : function () {
            if (!phone_tracked) {
                phone_tracked = true;
                app.tracker.event('cadastrar: telefone');
            }
        }
    });


    fieldsets.user = new app.ui.fieldset({
        legend : 'Dados de cadastro',
        fields : [name, login, password]
    });

    fieldsets.company = new app.ui.fieldset({
        legend : 'Dados da Empresa',
        fields : [company, phone]
    });

    app.ui.form.fieldsets.add([fieldsets.user, fieldsets.company]);
    app.ui.form.action('cadastrar!');

    name.focus();

    app.ui.form.submit(function () {
        if (validate()) {
            app.ajax.post({
                url : 'http://' + app.config.services.auth.host + ':' + app.config.services.auth.port + '/company',
                data : {
                    name : company.value(),
                    admin : {
                        username : login.value(),
                        password : password.value(),
                        name : name.value(),
                        informations : {
                            phone : phone.value()
                        }
                    }
                }
            }, function (response) {
                if (!response || response.error) {
                    app.ui.error('Erro ao cadastrar usuário');
                    if (response.error.name === 'ValidationError' && response.error.errors.username && response.error.errors.username.type ) {
                        login.errors.add(new app.ui.inputError({ message : 'este email já está cadastrado' }));
                    }
                } else {
                    token = response.token;
                    app.tracker.event('cadastrar');
                    app.close({
                        token : token,
                        user : {
                            name : name.value(),
                            informations : {
                                phone : phone.value()
                            }
                        }
                    });
                }
            });
        }
    });
});