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
    Item,
    /**
     * Campos da busca
     */
    fields = {};


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
            print : new app.ui.action({
                tip    : 'imprimir boleto',
                image  : 'download',
                click  : function() {
                    app.routes.redirect('http://' + app.config.services.billets.host + ':' + app.config.services.billets.port + '/billet/'+billet._id+'/print/'+billet.ourNumber);
                }
            }),
            edit : new app.ui.action({
                tip    : 'editar dados do boleto',
                image  : 'pencil',
                click  : function() {
                    app.apps.open({app : app.slug, route : '/editar-boleto/' + billet._id});
                }
            }),
            remove : new app.ui.action({
                tip    : 'remover boleto',
                image  : 'trash',
                click  : function() {
                    app.apps.open({app : app.slug, route : '/remover-boleto/' + billet._id});
                }
            })
        };
        this.item.actions.add([actions.print, actions.edit, actions.remove]);

        /* Exibe o nome do boleto */
        this.title = function (value) {
            this.item.title(value);
        };

        this.category = function (bankId, bank) {
            if (bankId === '001') {
                this.item.label.legend(bank);
                this.item.label.color('yellow');
            } else if (bankId === '104') {
                this.item.label.legend(bank);
                this.item.label.color('orange');
            } else if (bankId === '237') {
                this.item.label.legend(bank);
                this.item.label.color('red');
            } else if (bankId === '341') {
                this.item.label.legend(bank);
                this.item.label.color('blue');
            } else {
                this.item.label.legend(bank);
                this.item.label.color('black');
            }
        }

        /* Pegando a exclusão do boleto */
        app.events.bind('remove billet ' + billet._id, function () {
            that.item.detach();
        });

        /* Pegando quando o filtro é acionado */
        app.events.bind('filter billet', function (fields) {
            var queryField = fields.query.value();
            if (
                queryField.length > 1 && billet.ourNumber.toLowerCase().indexOf(queryField.toLowerCase()) === -1
            ) {
                that.item.visibility('hide');
            } else {
                that.item.visibility('show');
            }
        });

        if (billet) {
            this.title(billet.ourNumber);
            this.category(billet.bankId, billet.bank);
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
    app.ui.filter.action('filtrar');
    /* filtro por texto */
    fields.query = new app.ui.inputText({
        legend : 'Nosso número',
        type : 'text',
        name : 'query',
        change : app.ui.filter.submit
    });
    /* fieldset principal */
    app.ui.filter.fieldsets.add(new app.ui.fieldset({
        legend : 'Filtrar boletos',
        fields : [fields.query]
    }));
    /* dispara o evento de filtro */
    app.ui.filter.submit(function () {
        app.events.trigger('filter billet', fields);
    });

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
