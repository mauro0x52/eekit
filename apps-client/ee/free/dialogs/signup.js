app.routes.dialog('/cadastro', function (params, data) {
    app.ui.title('Cadastre-se no EmpreendeKit!');
    app.tracker.event('cadastrar: inicio');

    var name, surname, login, login_confirmation, password, password_confirmation, role, sector, size, why,
        fieldsets = {},
        token;

    function validate () {
        var validate = true;
        if (password.value() !== password_confirmation.value()) {
            password_confirmation.errors.add(new app.ui.inputError({ message : 'as senhas não conferem' }));
            validate = false;
        }
        if (login.value() !== login_confirmation.value()) {
            login_confirmation.errors.add(new app.ui.inputError({ message : 'os emails não conferem' }));
            validate = false;
        }
        if (!size.value().length) {
            validate = false;
            app.ui.error('Escolha um tamanho');
        }
        if (!sector.value().length) {
            validate = false;
             app.ui.error('Escolha um setor');
        }
        if (!role.value().length) {
            validate = false;
            app.ui.error('Escolha uma função');
        }
        return validate;
    }

    var name_tracked = false,
        surname_tracked = false,
        login_tracked = false,
        login_confirmation_tracked = false,
        password_tracked = false,
        password_confirmation_tracked = false,
        role_tracked = false,
        sector_tracked = false,
        size_tracked = false,
        why_tracked = false,

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

    login = new app.ui.inputText({
        legend : 'Email',
        name : 'login',
        rules : [
            {rule : /.{3,}/, message : 'campo obrigatório'},
            {rule : /^[a-z0-9\.]+\@[a-z0-9]+(\.[a-z]+)+$/i, message : 'email inválido'}
        ],
        change : function () {
            if (!login_tracked) {
                login_tracked = true;
                app.tracker.event('cadastrar: email');
            }
        }
    });

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

    role = new app.ui.inputSelector({
        type : 'single',
        name : 'role',
        legend : 'Qual a sua função na empresa?',
        options : [
            new app.ui.inputOption({legend : 'Dono/sócio', value : 'Dono/sócio'}),
            new app.ui.inputOption({legend : 'Marketing e Vendas', value : 'Marketing e Vendas'}),
            new app.ui.inputOption({legend : 'Administrativo', value : 'Administrativo'}),
            new app.ui.inputOption({legend : 'Outros', value : 'Outros'})
        ],
        change : function () {
            if (!role_tracked) {
                role_tracked = true;
                app.tracker.event('cadastrar: funcao');
            }
        }
    });

    sector = new app.ui.inputSelector({
        type : 'single',
        name : 'sector',
        legend : 'Qual é o setor da sua empresa?',
        options : [
            new app.ui.inputOption({legend : 'Assessoria e consultoria', value : 'Assessoria e consultoria'}),
            new app.ui.inputOption({legend : 'TI', value : 'TI'}),
            new app.ui.inputOption({legend : 'Comércio atacado e varejo', value : 'Comércio atacado e varejo'}),
            new app.ui.inputOption({legend : 'Outros', value : 'Outros'})
        ],
        change : function () {
            if (!sector_tracked) {
                sector_tracked = true;
                app.tracker.event('cadastrar: setor');
            }
        }
    });

    size = new app.ui.inputSelector({
        type : 'single',
        name : 'size',
        legend : 'Qual o tamanho da sua empresa?',
        options : [
            new app.ui.inputOption({legend : '1 a 5', value : '1 a 5'}),
            new app.ui.inputOption({legend : '6 a 10', value : '6 a 10'}),
            new app.ui.inputOption({legend : 'Mais que 10', value : 'Mais que 10'})
        ],
        change : function () {
            if (!size_tracked) {
                size_tracked = true;
                app.tracker.event('cadastrar: tamanho');
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

    fieldsets.profile = new app.ui.fieldset({
        legend : 'Dados pessoais',
        fields : [name, surname, login, login_confirmation, password, password_confirmation]
    });

    fieldsets.aditional = new app.ui.fieldset({
        legend : 'Informações da empresa',
        fields : [role, sector, size, why]
    });

    app.ui.form.fieldsets.add([fieldsets.profile, fieldsets.user, fieldsets.aditional]);
    app.ui.form.action('cadastrar!');

    name.focus();

    app.ui.form.submit(function () {
        if (validate()) {
            app.ajax.post({
                url : 'http://' + app.config.services.auth.host + ':' + app.config.services.auth.port + '/user',
                data : {
                    username : login.value(),
                    password : password.value(),
                    password_confirmation : password_confirmation.value()
                }
            }, function (response) {
                if (!response || response.error) {
                    app.ui.error('Erro ao cadastrar usuário');
                    if (response.error.name === 'ValidationError' && response.error.errors.username && response.error.errors.username.type ) {
                        login.errors.add(new app.ui.inputError({ message : 'este email já está cadastrado' }));
                    }
                } else {
                    token = response.user.token;
                    app.ajax.post({
                        url : 'http://' + app.config.services.profiles.host + ':' + app.config.services.profiles.port + '/profile',
                        data : {
                            name : name.value(),
                            surname : surname.value(),
                            role : role.value()[0],
                            sector : sector.value()[0],
                            size : size.value()[0],
                            why : why.value(),
                            token : token
                        }
                    }, function (response) {
                        if (!response || response.error) {
                            app.ui.error('Erro ao cadastrar perfil');
                        } else {
                            app.tracker.event('cadastrar');
                            app.close(token);
                        }
                    });
                }
            });
        }
    });
});