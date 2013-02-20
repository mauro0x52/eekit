/**
 * Balanço de caixa
 *
 * @author Mauro Ribeiro
 * @since 2012-12
 */
app.routes.list('/', function (params, data) {

    var
    /**
     * Tupla data grupo
     */
    dateGroup = function (date) {
        var that = this,
            group = new app.ui.group({}),
            transactionItems = {};

        /**
         * Ações de um grupo
         *
         * @author Mauro Ribeiro & Rafael Erthal
         * @since  2013-01
         */
        this.actions = function () {
            group.header.actions.remove();

            group.header.actions.add(new app.ui.action({
                legend : 'receita',
                image : 'add',
                click : function () {
                    app.apps.open({
                        app : 'financas',
                        route : '/adicionar-receita',
                        close : function (data) {
                            var i;
                            if (data) {
                                for (i in data) {
                                    new transactionItem(data[i]);
                                }
                                showGroups();
                            }
                        },
                        data : {
                            date : date
                        }
                    })
                }
            }));

            group.header.actions.add(new app.ui.action({
                legend : 'despesa',
                image : 'sub',
                click : function () {
                    app.apps.open({
                        app : 'financas',
                        route : '/adicionar-despesa',
                        close : function (data) {
                            if (data) {
                                for (i in data) {
                                    new transactionItem(data[i]);
                                }
                                showGroups();
                            }
                        },
                        data : {
                            date : date
                        }
                    })
                }
            }));

            group.header.actions.add(new app.ui.action({
                legend : 'transferencia',
                image : 'transfer',
                click : function () {
                    app.apps.open({
                        app : 'financas',
                        route : '/adicionar-transferencia',
                        close : function (data) {
                            if (data) {
                                if (data.source) {
                                    new transactionItem(data.source);
                                }
                                if (data.destiny) {
                                    new transactionItem(data.source);
                                }
                                showGroups();
                            }
                        },
                        data : {
                            date : date
                        }
                    })
                }
            }));
        }

        /**
         * Remove um transactionItem do grupo
         *
         * @author Rafael Erthal
         * @since  2013-01
         *
         * @param  transactionItem: item a ser removido
         */
        this.remove = function (transactionItem) {
            transactionItems[transactionItem.transaction()._id] = null;
            group.items.remove(transactionItem.item());
            if (group.items.get().length === 0) {
                group.detach();
                delete dateGroups[date.toString()];
            }
        };

        /**
         * Adiciona um transactionItem ao grupo
         *
         * @author Rafael Erthal
         * @since  2013-01
         *
         * @param  transactionItem: item a ser inserido
         */
        this.add = function (transactionItem) {
            transactionItems[transactionItem.transaction()._id] = transactionItem;
            group.items.add(transactionItem.item());
        };

        /**
         * Grupo
         *
         * @author Rafael Erthal
         * @since  2013-01
         *
         * @return grupo
         */
        this.group = function () {
            return group;
        }

        /**
         * Retorna os transaction items
         *
         * @author Rafael Erthal
         * @since  2013-01
         *
         * @return [TransactionItem]
         */
         this.transactionItems = function () {
            return transactionItems;
         }

        /**
         * Data
         *
         * @author Rafael Erthal
         * @since  2013-01
         *
         * @return data
         */
        this.date = function () {
            return date;
        }

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

        if (date.toString() === today.toString()) {
            group.header.title('Hoje ('+today.getDate() + '/' + monthsNames[today.getMonth()] + '/' + today.getFullYear() + ' - ' + daysNames[today.getDay()] + ')');
        } else {
            group.header.title(date.getDate() + '/' + monthsNames[date.getMonth()] + '/' + date.getFullYear() + ' - ' + daysNames[date.getDay()]);
        }

        this.actions();
        dateGroups[date.toString()] = this;
    },

    /**
     * Tupla transação item
     */
    transactionItem = function (transaction) {
        var that = this,
            item = new app.ui.item({
                title : transaction.name,
                click : function () {
                    app.apps.open({
                        app : app.slug,
                        route : '/transacao/' + transaction._id,
                        data : {
                            remove : that.remove,
                            edit : that.update
                        }
                    })
                }
            });

        /**
         * Coloca o item no grupo correto
         *
         * @author Mauro Ribeiro & Rafael Erthal
         * @since  2013-01
         *
         * @return objeto dateGroup
         */
        this.group = function () {
            var date = new Date(transaction.date);

            if (!dateGroups[date.toString()]) {
                return new dateGroup(date);
            }
            return dateGroups[date.toString()];
        };

        /**
         * Edita uma transação
         *
         * @author Mauro Ribeiro & Rafael Erthal
         * @since  2013-01
         *
         * @param  cb: callback após edição
         */
        this.update = function (cb) {
            app.apps.open({
                app : 'financas',
                route : '/editar-transacao/' + transaction._id,
                close : function (data) {
                    if (data) {
                        oldGroup = that.group();
                        /* Altera os dados da transação */
                        transaction = data;
                        /* Insere o item no grupo novo */
                        if (oldGroup !== that.group()) {
                            oldGroup.remove(that);
                            that.group().add(that);
                            showGroups();
                        }
                        /* Altera os dados do item */
                        item.title(data.name);
                        that.label();
                        that.icons();
                        if (cb) {
                            cb(transaction);
                        }
                    }
                }
            });
        };

        /**
         * Exclui uma transação
         *
         * @author Mauro Ribeiro & Rafael Erthal
         * @since  2013-01
         *
         * @param  cb: callback após edição
         */
        this.remove = function (cb) {
            transaction.remove(function () {
                that.group().remove(that);
                showGroups();
                if (cb) {
                    cb();
                }
            });
        };

        /**
         * Lista das ações de um item
         *
         * @author Mauro Ribeiro & Rafael Erthal
         * @since  2013-01
         */
        this.actions = function () {
            item.actions.remove();

            item.actions.add(new app.ui.action({
                legend : 'editar',
                image : 'pencil',
                click : that.update
            }));

            item.actions.add(new app.ui.action({
                legend : 'remover',
                image : 'trash',
                click : that.remove
            }));
        };

        /**
         * Label de uma transação
         *
         * @author Mauro Ribeiro & Rafael Erthal
         * @since  2013-01
         */
        this.label = function () {
            if (transaction.isTransfer) {
                item.label.color('cyan');
                item.label.legend('Transferência');
            } else {
                item.label.color(transaction.type === 'credit' ? 'green' : 'red');
                if (categories[transaction.category]) {
                    item.label.legend(categories[transaction.category].name);
                } else {
                    item.label.legend('transferência');
                }
            }
        };

        /**
         * Lista de ícones
         *
         * @author Mauro Ribeiro & Rafael Erthal
         * @since  2013-01
         */
        this.icons = function () {
            item.icons.remove();

            item.icons.add(new app.ui.icon({
                image : transaction.type === 'credit' ? 'add' : 'sub',
                legend : parseFloat(transaction.value).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(\,))/g, '.')
            }));

            item.icons.add(new app.ui.icon({
                image : 'wallet',
                legend : accounts[transaction.account] ? accounts[transaction.account].name : ''
            }));
        };

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

        /**
         * Transação
         *
         * @author Rafael Erthal
         * @since  2013-01
         *
         * @return transação
         */
        this.transaction = function () {
            return transaction;
        };

        /**
         * Item
         *
         * @author Rafael Erthal
         * @since  2013-01
         *
         * @return item
         */
        this.item = function () {
            return item;
        };

        this.actions();
        this.label();
        this.icons();

        this.group().add(this);
    },

    /**
     * Lista de categorias
     */
    categories = {},

    /**
     * Lista de contas
     */
    accounts = {},

    /**
     * Lista de dupla dates-groups
     * {date : date, group : ui.group
     */
    dateGroups = {},

    /**
     * Data atual
     */
    now = new Date(),

    /**
     * Data de hoje sem horário
     */
    today = new Date(now.getFullYear(), now.getMonth(), now.getDate()),

    /**
     * Grupo de grupos ui.groupset
     */
    groupSet = new app.ui.groupset({
        header : {
            title : 'Transações'
        }
    }),

    /**
     * Nome dos meses
     */
    monthsNames = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],

    /**
     * Nome dos dias
     */
    daysNames = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],

    /**
     * Campos do filtro
     */
    fields = {};

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

    /**
     * Monta a ferramenta
     *
     * @author Mauro Ribeiro & Rafael Erthal
     * @since  2013-01
     */
    app.ui.title('Fluxo de Caixa');
    app.ui.groups.add(groupSet);
    app.ui.actions.add([
        new app.ui.action({
            legend : 'baixar dados',
            image : 'download'
        }),
        new app.ui.action({
            legend : 'receita',
            image : 'add',
            click : function () {
                app.apps.open({
                    app : 'financas',
                    route : '/adicionar-receita',
                    close : function (data) {
                        if (data) {
                            for (var i in data) {
                                new transactionItem(data[i]);
                            }
                            showGroups();
                        }
                    }
                })
            }
        }),
        new app.ui.action({
            legend : 'despesa',
            image : 'sub',
            click : function () {
                app.apps.open({
                    app : 'financas',
                    route : '/adicionar-despesa',
                    close : function (data) {
                        if (data) {
                            for (var i in data) {
                                new transactionItem(data[i]);
                            }
                            showGroups();
                        }
                    }
                })
            }
        }),
        new app.ui.action({
            legend : 'transferencia',
            image : 'transfer',
            click : function () {
                app.apps.open({
                    app : 'financas',
                    route : '/adicionar-transferencia',
                    close : function (data) {
                        if (data) {
                            if (data.source) {
                                new transactionItem(data.source);
                            }
                            if (data.destiny) {
                                new transactionItem(data.destiny);
                            }
                            showGroups();
                        }
                    }
                })
            }
        })
    ]);

    app.models.user.auth(function () {
        app.models.category.list(function (categoriesArray) {
            var i;
            categoriesArray.sort(function (a,b) {
                var aposition = a.name || '',
                    bposition = b.name || '';
                if (aposition > bposition) return  1;
                if (aposition < bposition) return -1;
                return 0;
            })
            for (i in categoriesArray) {
                categories[categoriesArray[i]._id] = categoriesArray[i]
            }
            app.models.account.list(function (accountsArray) {
                var i;
                for (i in accountsArray) {
                    accounts[accountsArray[i]._id] = accountsArray[i]
                }
                app.models.transaction.list({}, function (transactions) {
                    for (var i in transactions) {
                        if (transactions[i].hasOwnProperty('_id')) {
                            new transactionItem(transactions[i]);
                        }
                    }
                    filter();
                    showGroups();
                });
            });
        });
    });

});
