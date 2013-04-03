/**
 * Lista das contas
 *
 * @author Mauro Ribeiro
 * @since 2012-12
 */
app.routes.list('/usuarios', function (params, data) {
    var fields = {}

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
        groups.admins.items.add(new app.ui.item({
            title : app.config.users[i].name
        }));
    }
});
