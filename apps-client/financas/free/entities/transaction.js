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
            value    : new app.ui.data({legend : 'valor'}),
            date     : new app.ui.data({legend : 'data'}),
            author   : new app.ui.data({legend : 'criado por'})
        };

        /* Botões do item */
        actions = {
            billet : new app.ui.action({
                legend : 'boleto',
                tip : 'gerar boleto para esta cobrança',
                image : 'download',
                click : function() {
                    var i,
                        account;

                    for (i in accounts) {
                        if (transaction.account.toString() === accounts[i]._id.toString()) {
                            account = accounts[i];
                        }
                    }
                    app.open({
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
                tip    : 'editar dados desta transação',
                image  : 'pencil',
                click  : function() {
                    app.open({app : app.slug(), route : '/editar-transacao/' + transaction._id});
                }
            }),
            remove       : new app.ui.action({
                legend : 'remover transação',
                tip    : 'apagar esta transação',
                image  : 'trash',
                click  : function() {
                    app.open({app : app.slug(), route : '/remover-transacao/' + transaction._id});
                }
            })
        };
        app.ui.actions.add([actions.billet, actions.remove, actions.edit]);

        /* Exibe o nome da transação */
        this.name = function (value) {
            app.ui.title('Transação: ' + value);
            app.ui.subtitle(value);
        }

        /* Exibe as notas da transação */
        this.observation = function (value) {
            app.ui.description(value.replace(/\n/g, '<br />'));
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

        /* Exibe a data da transação */
        this.date = function (value) {
            var monthsNames = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
                daysNames = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

            fields.date.values.remove();
            if (value) {
                fields.date.values.add(new app.ui.value({value : value.getDate() + '/' + monthsNames[value.getMonth()] + '/' + value.getFullYear() + ' - ' + daysNames[value.getDay()]}));
                fieldsets.details.fields.add(fields.date);
            } else {
                fieldsets.details.fields.remove(fields.date);
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

        /* Exibe o autor da transação */
        this.author = function (value) {
            fields.author.values.remove();
            if (value) {
                for (var i in app.config.users) {
                    if (app.config.users[i]._id === value) {
                        fields.author.values.add(new app.ui.value({value : app.config.users[i].name}));
                        fieldsets.details.fields.add(fields.author);
                    }
                }
            } else {
                fieldsets.details.fields.remove(fields.author);
            }
        };

        /* Pegando a edição do contato */
        app.bind('update transaction ' + transaction._id, function (data) {
            transaction = new app.models.transaction(data);

            if (transaction) {
                that.name(transaction.name + (transaction.subtitle ? ' (' + transaction.subtitle + ')' : ''));
                that.observation(transaction.observation);
                that.category(transaction.category);
                that.account(transaction.account);
                that.date(transaction.date);
                that.value((transaction.type === 'debt' ? -1 : 1) * transaction.value);
                that.author(transaction.author);
            }
        });

        /* Pegando a exclusão do contato */
        app.bind('remove transaction ' + transaction._id, app.close);

        if (transaction) {
            this.name(transaction.name + (transaction.subtitle ? ' (' + transaction.subtitle + ')' : ''));
            this.observation(transaction.observation || '');
            this.category(transaction.category);
            this.account(transaction.account);
            this.date(transaction.date);
            this.value((transaction.type === 'debt' ? -1 : 1) * transaction.value);
            this.author(transaction.author);
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

                if (transaction.embeddeds) {
                    var appa = transaction.embeddeds[0].split('/')[1],
                        route = transaction.embeddeds[0].replace('/' + appa, '');

                    app.open({
                        app : appa,
                        route : route
                    })
                }
            });
        });
    });
});