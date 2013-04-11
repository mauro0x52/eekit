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
     * ?
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
                    app.apps.open({app : app.slug, route : '/alterar-senha/' + user._id});
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
            app.apps.open({
                app : app.slug,
                route : '/adicionar-usuario'
            })
        }
    }));

    /* Monta o filtro */

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
    app.events.bind('create user', function (user) {
        groups.admins.items.add(new app.ui.item({
            title : user.name,
            label : {
                color: 'blue',
                legend: 'usuário'
            }
        }));
    });
});
