app.routes.dialog('/cadastro', function (params, data) {
    app.ui.title('Cadastre-se no EmpreendeKit!');
    app.tracker.event('cadastrar: inicio');

    var name, surname, login, login_confirmation, password, password_confirmation, role, sector, size, why,
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
        //surname_tracked = false,
        phone_tracked = false,
        login_tracked = false,
        //login_confirmation_tracked = false,
        //password_confirmation_tracked = false,
        //why_tracked = false,
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
/*
    surname = new app.ui.inputText({
        legend : 'Sobrenome',
        name : 'login',
        rules : [
            {rule : /.{3,}/, message : 'campo obrigatório'},
            {rule : /^[a-zàáâãäåçèéêëìíîïñðóòôõöøùúûüýÿ\s]*$/i, message : 'apenas caracteres alfanuméricos'},
        ],
        change : function () {
            if (!surname_tracked) {
                surname_tracked = true;
                app.tracker.event('cadastrar: sobrenome');
            }
        }
    });
*/
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
/*
    login_confirmation = new app.ui.inputText({
        legend : 'Confirmar email',
        name : 'login',
        change : function () {
            if (!login_confirmation_tracked) {
                login_confirmation_tracked = true;
                app.tracker.event('cadastrar: email-2');
            }
        }
    });
*/
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
/*
    password_confirmation = new app.ui.inputPassword({
        legend : 'Confirmar senha',
        name : 'password',
        change : function () {
            if (!password_confirmation_tracked) {
                password_confirmation_tracked = true;
                app.tracker.event('cadastrar: senha-2');
            }
        }
    });

    why = new app.ui.inputText({
        legend : 'O que você espera do EmpreendeKit?',
        name : 'why',
        rules : [
            {rule : /.{3,}/, message : 'campo obrigatório'},
        ],
        change : function () {
            if (!why_tracked) {
                why_tracked = true;
                app.tracker.event('cadastrar: expectativa');
            }
        }
    });
*/
    fieldsets.profile = new app.ui.fieldset({
        legend : 'Dados pessoais',
        fields : [name/*, surname*/, phone, login/*, login_confirmation*/, password/*, password_confirmation*/]
    });
/*
    fieldsets.aditional = new app.ui.fieldset({
        legend : 'Informações da empresa',
        fields : [why]
    });
*/
    app.ui.form.fieldsets.add([fieldsets.profile/*, fieldsets.user, fieldsets.aditional*/]);
    app.ui.form.action('cadastrar!');

    name.focus();

    app.ui.form.submit(function () {
        if (validate()) {
            app.ajax.post({
                url : 'http://' + app.config.services.auth.host + ':' + app.config.services.auth.port + '/user',
                data : {
                    username : login.value(),
                    password : password.value(),
                    //password_confirmation : password_confirmation.value()
                    password_confirmation : password.value()
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
                        profile : {
                            name : name.value(),
                            //surname : surname.value(),
                            phone : phone.value(),
                            //why : why.value(),
                            token : token
                        }
                    });
                }
            });
        }
    });
});