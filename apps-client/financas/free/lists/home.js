/**
 * Balanço de caixa
 *
 * @author Mauro Ribeiro
 * @since 2012-12
 */
app.routes.list('/', function (params, data) {

    var
    /**
     * Classe que representa um item
     */
    Item,

    /**
     * Classe que representa um grupo
     */
    Group,

    /*
     * Objeto com os grupos de grupos
     */
    groupsets,
    
    /*
     * Vetor com as categorias do usuário
     */
    categories,
    
    /*
     * Vetor com as contas do usuário
     */
    accounts,

    /**
     * Data atual
     */
    now = new Date(),

    /**
     * Data de hoje sem horário
     */
    today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    /* montando os groupsets */
    groupsets = {
        groupset : new app.ui.groupset({header : {title : 'Transações'}})
    };
    app.ui.groups.add([groupsets.groupset])

    /**
     * Grupo
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  group : group
     * @return ui.groupset
     */
    function fitGroupset (group) {
        return groupsets.groupset;
    }

    /* montando os grupos */
    Group = function (data) {
        var that = this,
            date = new Date(data),
            actions;

        this.group = new app.ui.group();
        this.group.date = date;

        /* Botões do grupo */
        actions = {
            credit : new app.ui.action({
                legend : 'receita',
                image : 'add',
                click : function () {
                    app.apps.open({
                        app : app.slug,
                        route : '/adicionar-receita',
                        data : {date : date}
                    })
                }
            }),
            debt : new app.ui.action({
                legend : 'despesa',
                image : 'sub',
                click : function () {
                    app.apps.open({
                        app : app.slug,
                        route : '/adicionar-despesa',
                        data : {date : date}
                    })
                }
            }),
            transfer : new app.ui.action({
                legend : 'transferencia',
                image : 'transfer',
                click : function () {
                    app.apps.open({
                        app : app.slug,
                        route : '/adicionar-transferencia',
                        data : {date : date}
                    })
                }
            })
        };
        this.group.header.actions.add([actions.credit, actions.debt, actions.transfer]);

        /* Exibe a data do grupo */
        this.date = function (value) {
            var monthsNames = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
                daysNames = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

            if (date.toString() === today.toString()) {
                this.group.header.title('Hoje ('+today.getDate() + '/' + monthsNames[today.getMonth()] + '/' + today.getFullYear() + ' - ' + daysNames[today.getDay()] + ')');
            } else {
                this.group.header.title(date.getDate() + '/' + monthsNames[date.getMonth()] + '/' + date.getFullYear() + ' - ' + daysNames[date.getDay()]);
            }
        };

        if (date) {
            this.date(date);
        }
    }

    /**
     * Grupo que uma transação se encaixa
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  transaction : transaction
     * @return ui.group
     */
    function fitGroup (transaction) {
        var i,
            groups,
            group;

        groups = groupsets.groupset.groups.get();
        for (i in groups) {
            if (
                groups[i].date.getFullYear() === transaction.date.getFullYear() &&
                groups[i].date.getMonth() === transaction.date.getMonth() &&
                groups[i].date.getDate() === transaction.date.getDate()
            ) {
                return groups[i];
            }
        }
        /* Caso não tenha grupo para a transação cria-o e ordena os grupos */
        group = new Group(transaction.date);
        groups.push(group.group);
        groups.sort(function (a, b) {
            var aDate = a.date || new Date(),
                bDate = b.date || new Date();

            if (aDate > bDate) return  1;
            if (aDate < bDate) return -1;
            return 0;
        });
        groupsets.groupset.groups.remove();
        for (i in groups) {
            fitGroupset(groups[i]).groups.add(groups[i]);
        }
        return group.group;
    }

    /* montando os items */
    Item = function (data) {
        var that = this,
            transaction = new app.models.transaction(data),
            icons,
            actions;

        this.item = new app.ui.item({
            click : function () {
                app.apps.open({app : app.slug, route : '/transacao/' + transaction._id})
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
                legend : 'editar transacao',
                image  : 'pencil',
                click  : function() {
                    app.apps.open({app : app.slug, route : '/editar-transacao/' + transaction._id});
                }
            }),
            remove       : new app.ui.action({
                legend : 'remover transacao',
                image  : 'trash',
                click  : function() {
                    app.apps.open({app : app.slug, route : '/remover-transacao/' + transaction._id});
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
        app.events.bind('update transaction ' + transaction._id, function (data) {
            var oldGroup = fitGroup(transaction);

            transaction = new app.models.transaction(data);

            if (oldGroup !== fitGroup(transaction)) {
                that.item.detach();
                if (oldGroup.items.get().length === 0) {
                    oldGroup.detach();
                    delete oldGroup;
                }
                fitGroup(transaction).items.add(that.item);
            }

            if (transaction) {
                that.name(transaction.name);
                that.category(transaction.category);
                that.account(transaction.account);
                that.value(transaction.value);
            }
        });

        /* Pegando a exclusão da transação */
        app.events.bind('remove transaction ' + transaction._id, function () {
            var oldGroup = fitGroup(transaction);

            this.item.detach();
            if (oldGroup.items.get().length === 0) {
                oldGroup.detach();
                delete oldGroup;
            }
        });

        /* Pegando quando o filtro é acionado */
        app.events.bind('filter transaction', function (fields) {
            if (
                false
            ) {
                that.item.visibility('hide');
            } else {
                that.item.visibility('show');
                /*app.ui.actions.get()[0].href(
                    app.ui.actions.get()[0].href() +
                    contact.name  + ' %2C' +
                    contact.phone + ' %2C' +
                    contact.email + '%0A'
                );*/
            }
        });

        if (transaction) {
            this.name(transaction.name);
            this.category(transaction.category);
            this.account(transaction.account);
            this.value(transaction.value);
        }
    }

    /* autenticando usuário e pegando categorias */
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
            app.models.transaction.list({}, function (transactions) {
                var fields = {};

                app.ui.title('Fluxo de Caixa');

                /* Botão global de baixar dados */
                app.ui.actions.add(new app.ui.action({
                    legend : 'baixar dados',
                    image : 'download'
                })); 
                /* Botão global de adicionar receita */
                app.ui.actions.add(new app.ui.action({
                    legend : 'receita',
                    image : 'add',
                    click : function () {
                        app.apps.open({app : app.slug, route : '/adicionar-receita'});
                    }
                })); 
                /* Botão global de adicionar despesa */
                app.ui.actions.add(new app.ui.action({
                    legend : 'despesa',
                    image : 'sub',
                    click : function () {
                        app.apps.open({app : app.slug, route : '/adicionar-despesa'});
                    }
                })); 
                /* Botão global de adicionar transferencia */
                app.ui.actions.add(new app.ui.action({
                    legend : 'transferencia',
                    image : 'transfer',
                    click : function () {
                        app.apps.open({app : app.slug, route : '/adicionar-transferencia'});
                    }
                })); 

                /* Monta o filtro */
                app.ui.filter.action('filtrar');
                /* dispara o evento de filtro */
                app.ui.filter.submit(function () {
                    app.ui.actions.get()[0].href('data:application/octet-stream,');
                    app.events.trigger('filter transaction', fields);
                });

                /* listando as transações */
                for (var i in transactions) {
                    fitGroup(transactions[i]).items.add((new Item(transactions[i])).item);
                }

                /* Pegando transações que são cadastradas ao longo do uso do app */
                app.events.bind('create transaction', function (transaction) {
                    fitGroup(transaction).items.add((new Item(transaction)).item);
                });
            })
        });
    });










    var
    /**
     * Tupla data grupo
     */
    dateGroup = function (date) {
        /**
         * Verifica se o objeto deve ser exibido
         *
         * @author Rafael Erthal
         * @since  2013-01
         *
         * @return {period, accumulates, previous}
         */
        this.filter = function () {
            var i,
                dateStart = fields.dateStart.date() ? fields.dateStart.date() : null,
                dateEnd = fields.dateEnd.date() ? fields.dateEnd.date() : null,
                show = false,
                date;

            for (i in transactionItems) {
                if (transactionItems[i]) {
                    if (transactionItems[i].filter()) {
                        /* estão dentro da filtragem */
                        date = new Date(transactionItems[i].transaction().date);
                        if ((dateStart && date >= dateStart) && (dateEnd && date <= dateEnd)) {
                            /* dentro da janela de tempo */
                            show = true;
                            transactionItems[i].item().visibility('show');
                        } else {
                            /* balanço anterior */
                            transactionItems[i].item().visibility('hide');
                        }
                    } else {
                        transactionItems[i].item().visibility('hide');
                    }
                }
            }

            group.visibility(show ? 'show' : 'hide');
        }

        /**
         * Calcula o balanço inicial
         *
         * @author Rafael Erthal
         * @since  2013-01
         *
         * @return {period, accumulates, previous}
         */
        this.balance = function () {
            var i,
                dateStart = fields.dateStart.date() ? fields.dateStart.date() : null,
                dateEnd = fields.dateEnd.date() ? fields.dateEnd.date() : null,
                balance = {period : 0, previous : 0},
                date;

            for (i in transactionItems) {
                if (transactionItems[i]) {
                    if (transactionItems[i].filter()) {
                        /* estão dentro da filtragem */
                        date = new Date(transactionItems[i].transaction().date);
                        if ((dateStart && date >= dateStart) && (dateEnd && date <= dateEnd)) {
                            /* dentro da janela de tempo */
                            balance.period += transactionItems[i].transaction().type === 'credit' ? parseFloat(transactionItems[i].transaction().value) : -parseFloat(transactionItems[i].transaction().value);
                        } else {
                            /* balanço anterior */
                            if ((dateStart && date < dateStart)) {
                                balance.previous += transactionItems[i].transaction().type === 'credit' ? parseFloat(transactionItems[i].transaction().value) : -parseFloat(transactionItems[i].transaction().value);
                            }
                        }
                    }
                }
            }

            return balance;
        }
    },

    /**
     * Tupla transação item
     */
    transactionItem = function (transaction) {

        /**
         * Verifica se o objeto deve ser exibido
         *
         * @author Rafael Erthal
         * @since  2013-01
         *
         * @return Boolean
         */
        this.filter = function () {
            var debtCategoriesFilter = fields.debtCategories.value(),
                creditCategoriesFilter = fields.creditCategories.value(),
                accountsFilter = fields.accounts.value(),
                typeFilter = fields.type.value(),
                dateStart = fields.dateStart.date() ? fields.dateStart.date() : null,
                dateEnd = fields.dateEnd.date() ? fields.dateEnd.date() : null,
                queryField = fields.query.value(),
                date;

            return ((
                debtCategoriesFilter.indexOf(transaction.category) >= 0 ||
                creditCategoriesFilter.indexOf(transaction.category) >= 0 ||
                transaction.isTransfer
            ) && (
                accountsFilter.indexOf(transaction.account) >= 0
            ) && (
                queryField.length = 0 ||
                (transaction.name + ' ' + transaction.value + ' ' + transaction.noteNumber + ' ' + accounts[transaction.account].name + ' ' + (categories[transaction.category] ? categories[transaction.category].name : '')).toLowerCase().indexOf(queryField.toLowerCase()) >= 0
            ) && (
                typeFilter.indexOf(transaction.type) >= 0
            ));
        };
    };


    /**
     * Exibe os grupos, filtra os items e recalcula o balanço
     *
     * @author Mauro Ribeiro & Rafael Erthal
     * @since  2013-01
     */
    function showGroups () {
        var groups = [],
            i,
            groupBalance,
            balance = {period : 0, previous : 0},
            csv = 'data:application/octet-stream,',
            accountsFilter = fields.accounts.value(),
            count = 0;

        for (i in dateGroups) {
            groups.push(dateGroups[i]);
            dateGroups[i].filter();
        }
        for (i in accountsFilter) {
            balance.previous += accounts[accountsFilter[i]].initialBalance;
        }

        groups.sort(function (a,b) {
            var dateA = a.date() || new Date(),
                dateB = b.date() || new Date();

            if (dateA > dateB) return  1;
            if (dateA < dateB) return -1;
            return 0;
        });

        groupSet.groups.remove();
        for (i in groups) {
            groupBalance = groups[i].balance();
            balance.period += groupBalance.period;
            balance.previous += groupBalance.previous;

            groups[i].group().footer.title('Saldo: $ ' + (balance.period + balance.previous).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(\,))/g, '.') );
            groupSet.groups.add(groups[i].group());
        }

        groupSet.header.icons.remove();
        groupSet.header.icons.add([
            new app.ui.icon({
                image : balance.period >= 0 ? 'add' : 'sub',
                legend : '$ '+balance.period.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(\,))/g, '.') + ' (período)'
            }),
            new app.ui.icon({
                image : balance.previous >= 0 ? 'add' : 'sub',
                legend : '$ '+balance.previous.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(\,))/g, '.') + ' (anterior)'
            }),
            new app.ui.icon({
                image : balance.accumulated >= 0 ? 'add' : 'sub',
                legend : '$ '+(balance.period + balance.previous).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(\,))/g, '.') + ' (acumulado)'
            })
        ]);

        for (var i in groups) {
            var transactionItems = groups[i].transactionItems();
            for (var j in transactionItems) {
                count++;
                if (transactionItems[j] && !transactionItems[j].item().visibility()) {
                    var transaction = transactionItems[j].transaction();
                    if (transaction) {
                        if (categories[transaction.category]) {
                            csv += transaction.name + ' %2C' + (transaction.date.getDate() + '/' + (transaction.date.getMonth() + 1) + '/' + transaction.date.getFullYear()) + ' %2C' + (transaction.type === 'credit' ? '+' : '-') + '$' + transaction.value + ' %2C' + categories[transaction.category].name  + ' %2C' + accounts[transaction.account].name + ' %2C' + transaction.noteNumber + '%0A'
                        } else {
                            csv += transaction.name + ' %2C' + (transaction.date.getDate() + '/' + (transaction.date.getMonth() + 1) + '/' + transaction.date.getFullYear()) + ' %2C' + (transaction.type === 'credit' ? '+' : '-') + '$' + transaction.value + ' %2Ctransferencia%2C' + accounts[transaction.account].name + ' %2C' + transaction.noteNumber + '%0A'
                        }
                    }
                }
            }
        }
        app.ui.actions.get()[0].href(csv);

        app.models.helpers.noTransactions(count);
        app.models.helpers.firstTransaction(count, accounts);
        app.models.helpers.defaultCategories(categories, accounts);
        app.models.helpers.thirdTransaction(count);
        app.models.helpers.sixthTransaction(count);
    }


    /**
     * Constrói o filtro
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     */
    function filter () {
        var creditCategoriesOptions = [], debtCategoriesOptions = [], accountsOptions = [], fieldset,
            now = new Date(), monthStart, monthEnd;

        monthStart = new Date(now.getFullYear(), now.getMonth());
        monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        /* Input com as categorias */
        for (var i in categories) {
            if (categories.hasOwnProperty(i)) {
                if (categories[i].type === 'credit') {
                    creditCategoriesOptions.push(new app.ui.inputOption({
                        legend : categories[i].name,
                        value : categories[i]._id,
                        clicked : true
                    }));
                } else {
                    debtCategoriesOptions.push(new app.ui.inputOption({
                        legend : categories[i].name,
                        value : categories[i]._id,
                        clicked : true
                    }));
                }
            }
        }

        /* Input com as contas */
        for (var i in accounts) {
            if (accounts.hasOwnProperty(i)) {
                accountsOptions.push(new app.ui.inputOption({
                    legend : accounts[i].name,
                    value : accounts[i]._id,
                    clicked : true
                }));
            }
        }

        app.ui.filter.action('filtrar');

        fields.query = new app.ui.inputText({
            legend : 'Buscar',
            type : 'text',
            name : 'query',
            change : function () {
                app.ui.filter.submit()
            }
        });

        fields.dateStart = new app.ui.inputDate({
            legend : 'Data inicial',
            type : 'text',
            name : 'dateStart',
            value : parseInt(monthStart.getDate()) + '/' + parseInt(monthStart.getMonth() + 1) + '/' + monthStart.getFullYear(),
            change : function () {
                app.ui.filter.submit()
            }
        });

        fields.dateEnd = new app.ui.inputDate({
            legend : 'Data final',
            type : 'text',
            name : 'dateEnd',
            value : parseInt(monthEnd.getDate()) + '/' + parseInt(monthEnd.getMonth() + 1) + '/' + monthEnd.getFullYear(),
            change : function () {
                app.ui.filter.submit()
            }
        });

        fields.creditCategories = new app.ui.inputSelector({
            type : 'multiple',
            name : 'category',
            legend : 'Categorias de receitas',
            options : creditCategoriesOptions,
            change : function () {
                app.ui.filter.submit()
            },
            actions : true
        });

        fields.debtCategories = new app.ui.inputSelector({
            type : 'multiple',
            name : 'category',
            legend : 'Categorias de despesas',
            options : debtCategoriesOptions,
            change : function () {
                app.ui.filter.submit()
            },
            actions : true
        });

        fields.accounts = new app.ui.inputSelector({
            type : 'multiple',
            name : 'account',
            legend : 'Contas',
            options : accountsOptions,
            change : function () {
                app.ui.filter.submit()
            },
            actions : true
        });

        fields.type = new app.ui.inputSelector({
            type : 'multiple',
            name : 'type',
            legend : 'Tipo',
            options : [
                new app.ui.inputOption({legend : 'Receita', value : 'credit', clicked : true}),
                new app.ui.inputOption({legend : 'Despesa', value : 'debt', clicked : true})
            ],
            change : function () {
                app.ui.filter.submit()
            },
            actions : true
        })

        fieldset = new app.ui.fieldset({
            legend : 'Filtrar transações',
            fields : [fields.query, fields.dateStart, fields.dateEnd, fields.accounts, fields.type, fields.creditCategories, fields.debtCategories]
        });

        app.ui.filter.fieldsets.add(fieldset);

        app.ui.filter.submit(showGroups);
    }


});
