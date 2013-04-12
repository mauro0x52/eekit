/**
 * Lista de Boletos
 *
 * @author Mauro Ribeiro
 * @since 2013-04
 */
app.routes.list('/', function (params, data) {
    var
    /**
     * Classe que representa um item
     */
    Item;


    /* montando os items */
    Item = function (data) {
        var that = this,
            billet = new app.models.billet(data),
            icons,
            actions;

        this.item = new app.ui.item({
            click : function () {
                app.apps.open({app : app.slug, route : '/boleto/' + billet._id})
            }
        });

        /* Botões do item */
        actions = {
            edit : new app.ui.action({
                tip    : 'editar dados do boleto',
                image  : 'pencil',
                click  : function() {
                    app.apps.open({app : app.slug, route : '/alterar-boleto/' + billet._id});
                }
            }),
            print : new app.ui.action({
                tip    : 'imprimir boleto',
                image  : 'download',
                click  : function() {
                    app.routes.redirect('http://' + app.config.services.billets.host + ':' + app.config.services.billets.port + '/billet/'+billet._id+'/print/'+billet.ourNumber, data);
                }
            })
        };
        this.item.actions.add([actions.print, actions.edit]);

        /* Exibe o nome do boleto */
        this.title = function (value) {
            this.item.title(value);
        };

        this.category = function (value) {
            this.item.label.legend(value);
            this.item.label.color('blue');
        }

        if (billet) {
            this.title(billet.ourNumber);
            this.category('boleto');
        }
    }


    app.ui.title('Boletos');

    /* Botão global de adicionar categoria */
    app.ui.actions.add(new app.ui.action({
        image : 'add',
        legend : 'adicionar boleto',
        tip : 'adicionar novo boleto',
        click : function () {
            app.apps.open({
                app : app.slug,
                route : '/adicionar-boleto'
            })
        }
    }));

    /* Monta o filtro */

    /* montando os grupos */
    groups = {
        billets : new app.ui.group()
    };

    app.ui.groups.add([groups.billets]);

    /* listando os boletos */
    app.models.billet.list({}, function (billets) {
        console.log(billets)
        for (var i in billets) {
            groups.billets.items.add(new Item(billets[i]).item);
        }
    });

    /* Pegando usuários que são cadastradas ao longo do uso do app */
    app.events.bind('create billet', function (billet) {
        groups.billets.items.add(new Item(billet).item);
    });
});
