/**
 * Lista de transações relacionadas
 *
 * @author Rafael Erthal
 * @since  2013-03
 * data : {embeddeds : [], insert : {title}}
 */
app.routes.embedList('/relacionadas', function (params, data) {

    var
    /*
     * Classe que representa um item
     */
    Item,

    /*
     * Objeto com os grupos
     */
    groups,

    /*
     * Vetor com as categorias do usuário
     */
    categories,

    /*
     * Vetor com as contas do usuário
     */
    accounts,

    /*
     * Identificador do embbed
     */
    response = data,

    /*
     * dia de hoje
     */
    now = new Date();

    /* montando os grupos */
    groups = {
        transactions : new app.ui.group({
            header : {
                title   : 'Transações',
                actions : [
                    new app.ui.action({
                        legend : 'receita',
                        tip : 'adicionar receita',
                        image : 'add',
                        click : function () {
                            app.open({
                                app : app.slug(),
                                route : '/adicionar-receita',
                                data  : {
                                    embeddeds : response.embed,
                                    title     : response.insert.title
                                }
                            });
                        }
                    }),
                    new app.ui.action({
                        legend : 'despesa',
                        tip : 'adicionar despesa',
                        image : 'sub',
                        click : function () {
                            app.open({
                                app : app.slug(),
                                route : '/adicionar-despesa',
                                data  : {
                                    embeddeds : response.embed,
                                    title     : response.insert.title
                                }
                            });
                        }
                    })
                ]
            }
        })
    };

    app.ui.groups.add([groups.transactions]);

    /**
     * Grupo que uma transação se encaixa
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  task : task
     * @return ui.group
     */
    function fitGroup (task) {
        return groups.transactions;
    }

    /* montando os items */
    Item = function (data) {
        var that = this,
            transaction = new app.models.transaction(data),
            icons,
            actions;

        this.item = new app.ui.item({
            click : function () {
                app.open({app : app.slug(), route : '/transacao/' + transaction._id})
            }
        });

        /* Icones do item */
        icons = {
            debt    : new app.ui.icon({image : 'sub'}),
            credit  : new app.ui.icon({image : 'add'}),
            account : new app.ui.icon({image : 'wallet'})
        };

        /* Botões do item */
        actions = {
            edit         : new app.ui.action({
                tip : 'editar esta transação',
                image  : 'pencil',
                click  : function() {
                    app.open({app : app.slug(), route : '/editar-transacao/' + transaction._id});
                }
            }),
            remove       : new app.ui.action({
                tip : 'remover esta transação',
                image  : 'trash',
                click  : function() {
                    app.open({app : app.slug(), route : '/remover-transacao/' + transaction._id});
                }
            })
        };
        this.item.actions.add([actions.edit, actions.remove]);

        /* Exibe o nome da transação */
        this.name = function (value) {
            this.item.title(value);
        };

        /* Exibe a categoria da transação */
        this.category = function (value) {
            var i;

            this.item.label.legend('transferência');
            for (i in categories) {
                if (categories[i]._id === value) {
                    this.item.label.legend(categories[i].name);
                }
            }
            if (transaction.isTransfer) {
                this.item.label.color('cyan');
            } else {
                this.item.label.color(transaction.type === 'credit' ? 'green' : 'red');
            }
        };

        /* Exibe a conta da transação */
        this.account = function (value) {
            var i;

            if (value) {
                for (i in accounts) {
                    if (accounts[i]._id === value) {
                        this.item.icons.add(icons.account);
                        icons.account.legend(accounts[i].name);
                    }
                }
            } else {
                this.item.icons.remove(icons.account);
                icons.account.legend('-');
            }
        };

        /* Exibe o valor da transação */
        this.value = function (value) {
            if (value) {
                if (transaction.type === 'credit') {
                    this.item.icons.add(icons.credit);
                    icons.credit.legend(parseFloat(value).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(\,))/g, '.'));
                } else {
                    this.item.icons.add(icons.debt);
                    icons.debt.legend(parseFloat(value).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(\,))/g, '.'));
                }
            } else {
                this.item.icons.remove(icons.credit);
                icons.credit.legend('-');
                this.item.icons.remove(icons.debt);
                icons.debt.legend('-');
            }
        };

        /* Pegando a edição da transação */
        app.bind('update transaction ' + transaction._id, function (data) {
            transaction = new app.models.transaction(data);

            if (transaction) {
                that.name(transaction.name + (transaction.subtitle ? ' (' + transaction.subtitle + ')' : ''));
                that.category(transaction.category);
                that.account(transaction.account);
                that.value(transaction.value);
            }
        });

        /* Pegando a exclusão da transação */
        app.bind('remove transaction ' + transaction._id, that.item.detach);

        if (transaction) {
            this.name(transaction.name + (transaction.subtitle ? ' (' + transaction.subtitle + ')' : ''));
            this.category(transaction.category);
            this.account(transaction.account);
            this.value(transaction.value);
        }
    };

    /* autenticando usuário e pegando categorias */
    app.models.user.auth(function () {
        app.models.category.list(function (data) {
            /* variável global com categorias */
            categories = data;

            /* ordena as categorias */
            categories.sort(function (a,b) {
                var aposition = a.name || '',
                    bposition = b.name || '';
                if (aposition > bposition) return  1;
                if (aposition < bposition) return -1;
                return 0;
            })
            /* autenticando usuário e pegando contas */
            app.models.account.list(function (data) {
                /* variável global com contas */
                accounts = data;
                /* monta a listagem */
                app.models.transaction.list({filterByEmbeddeds : response.embed}, function (transactions) {
                    app.ui.title('Transações relacionadas');

                    transactions.sort(function (a,b) {
                        if (a.date > b.date) return -1;
                        if (a.date < b.date) return  1;
                        return 0;
                    });

                    /* listando as transações */
                    for (var i in transactions) {
                        fitGroup(transactions[i]).items.add((new Item(transactions[i])).item);
                    }

                    /* Pegando transações que são cadastradas ao longo do uso do app */
                    app.bind('create transaction', function (transaction) {
                        fitGroup(transaction).items.add((new Item(transaction)).item);
                    });
                })
            });
        });
    });
});