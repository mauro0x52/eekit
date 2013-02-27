/**
 * Informações de uma transacao
 *
 * @author Rafael Erthal
 * @since  2013-01
 *
 * @param  params.id : id da transacao
 */
app.routes.entity('/transacao/:id', function (params, data) {

    var
    /**
     * Lista de categorias
     */
    categories,

    /**
     * Lista de contas
     */
    accounts,

    /*
     * Classe que representa os campos do usuário
     */
    Entity;

    Entity = function (data) {
        var that = this,
            transaction = new app.models.transaction(data),
            actions,
            fields,
            fieldsets;

        /* Conjuntos de campos */
        fieldsets = {
            details : new app.ui.dataset({legend : 'Detalhes'})
        };
        app.ui.datasets.add([fieldsets.details]);


        /* Campos de dados */
        fields = {
            category : new app.ui.data({legend : 'categoria'}),
            account  : new app.ui.data({legend : 'conta'}),
            value    : new app.ui.data({legend : 'valor'})
        };

        /* Botões do item */
        actions = {
            billet : new app.ui.action({
                legend : 'boleto',
                image : 'download',
                click : function() {
                    var i,
                        account;

                    for (i in accounts) {
                        if (transaction.account.toString() === accounts[i]._id.toString()) {
                            account = accounts[i];
                        }
                    }
                    app.apps.open({
                        app : 'boletos',
                        route : '/adicionar-boleto',
                        data : {
                            dueDate : transaction.date,
                            value : transaction.value,
                            account : account && account.account ? account.account : undefined,
                            agency : account && account.agency ? account.agency : undefined
                        }
                    });
                }
            }),
            edit         : new app.ui.action({
                legend : 'editar transação',
                image  : 'pencil',
                click  : function() {
                    app.apps.open({app : app.slug, route : '/editar-transacao/' + transaction._id});
                }
            }),
            remove       : new app.ui.action({
                legend : 'remover transação',
                image  : 'trash',
                click  : function() {
                    app.apps.open({app : app.slug, route : '/remover-transacao/' + transaction._id});
                }
            })
        };
        app.ui.actions.add([actions.billet, actions.remove, actions.edit]);

        /* Exibe o nome da transação */
        this.name = function (value) {
            app.ui.title('Contato: ' + value);
            app.ui.subtitle(value);
        }

        /* Exibe o valor da transação */
        this.value = function (value) {
            fields.value.values.remove();
            if (value) {
                fields.value.values.add(new app.ui.value({value : '$' + parseFloat(value).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(\,))/g, '.')}));
                fieldsets.details.fields.add(fields.value);
            } else {
                fieldsets.details.fields.remove(fields.value);
            }
        };

        /* Exibe a conta da transação */
        this.account = function (value) {
            var i;

            fields.account.values.remove();
            if (value) {
                for (i in accounts) {
                    if (value.toString() === accounts[i]._id.toString()) {
                        fields.account.values.add(new app.ui.value({value : accounts[i].name}));
                        fieldsets.details.fields.add(fields.account);
                    }
                }
            } else {
                fieldsets.details.fields.remove(fields.account);
            }
        };

        /* Exibe a categoria da transação */
        this.category = function (value) {
            var i;

            fields.category.values.remove();
            if (value) {
                for (i in categories) {
                    if (value.toString() === categories[i]._id.toString()) {
                        fields.category.values.add(new app.ui.value({value : categories[i].name}));
                        fieldsets.details.fields.add(fields.category);
                    }
                }
            } else {
                fieldsets.details.fields.remove(fields.category);
            }
        };

        /* Pegando a edição do contato */
        app.events.bind('update transaction ' + transaction._id, function (data) {
            transaction = new app.models.transaction(data);

            if (transaction) {
                that.name(transaction.name);
                that.category(transaction.category);
                that.account(transaction.account);
                that.value((transaction.type === 'debt' ? -1 : 1) * transaction.value);
            }
        });

        /* Pegando a exclusão do contato */
        app.events.bind('remove transaction ' + transaction._id, app.close);

        if (transaction) {
            this.name(transaction.name);
            this.category(transaction.category);
            this.account(transaction.account);
            this.value((transaction.type === 'debt' ? -1 : 1) * transaction.value);
        }
    };

    /**
     * Monta a view
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     */
    app.models.category.list(function (data) {
        categories = data;
        app.models.account.list(function (data) {
            accounts = data;
            app.models.transaction.find(params.id, function (transaction) {
                new Entity(transaction);
            });
        });
    });
});