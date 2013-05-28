/**
 * Lista das contas
 *
 * @author Mauro Ribeiro
 * @since 2012-12
 */
app.routes.list('/usuarios', function (params, data) {
    var
    /**
     * Classe que representa um item
     */
    Item,
    /**
     * Campos da busca
     */
    fields = {};


    /* montando os items */
    Item = function (data) {
        var that = this,
            user = data,
            icons,
            actions;

        this.item = new app.ui.item({});

        /* Botões do item */
        actions = {
            password : new app.ui.action({
                tip    : 'alterar senha',
                image  : 'pencil',
                click  : function() {
                    app.open({app : app.slug(), route : '/alterar-senha/' + user._id});
                }
            })
        };
        this.item.actions.add([actions.password]);

        /* Exibe o nome do contato */
        this.name = function (value) {
            this.item.title(value);
        };

        this.category = function (value) {
            this.item.label.legend(value);
            this.item.label.color('blue');
        }

        /* Pegando quando o filtro é acionado */
        app.bind('filter user', function (fields) {
            var queryField = fields.query.value();
            if (
                queryField.length > 1 && user.name.toLowerCase().indexOf(queryField.toLowerCase()) === -1
            ) {
                that.item.visibility('hide');
            } else {
                that.item.visibility('show');
            }
        });

        if (user) {
            this.name(user.name);
            this.category('usuário');
        }
    }


    app.ui.title('Usuários');

    /* Botão global de adicionar categoria */
    app.ui.actions.add(new app.ui.action({
        image : 'add',
        legend : 'adicionar usuário',
        tip : 'adicionar novo usuário',
        click : function () {
            app.open({
                app : app.slug(),
                route : '/adicionar-usuario'
            })
        }
    }));

    /* Monta o filtro */
    app.ui.filter.action('filtrar');
    /* filtro por texto */
    fields.query = new app.ui.inputText({
        legend : 'Buscar',
        type : 'text',
        name : 'query',
        change : app.ui.filter.submit
    });
    /* fieldset principal */
    app.ui.filter.fieldsets.add(new app.ui.fieldset({
        legend : 'Filtrar usuários',
        fields : [fields.query]
    }));
    /* dispara o evento de filtro */
    app.ui.filter.submit(function () {
        app.trigger('filter user', fields);
    });

    /* montando os grupos */
    groups = {
        admins : new app.ui.group()
    };

    app.ui.groups.add([groups.admins]);

    /* listando as contas */
    for (var i in app.config.users) {
        groups.admins.items.add(new Item(app.config.users[i]).item);
    }

    /* Pegando usuários que são cadastradas ao longo do uso do app */
    app.bind('create user', function (user) {
        console.log(user)
        groups.admins.items.add(new app.ui.item({
            title : user.name,
            label : {
                color: 'blue',
                legend: 'usuário'
            }
        }));
    });
});
