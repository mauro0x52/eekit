/**
 * Lista das contas
 *
 * @author Mauro Ribeiro
 * @since 2012-12
 */
app.routes.list('/contas', function (params, data) {

    app.tracker.event('visualizar contas');

    var
    /**
     * Lista de duplas accountItem :
     * {account : app.models.account, item : app.ui.item}
     */
    accountsItems = {},
    /**
     * Grupo principal que contém os itens
     */
    group;

    /**
     * Constrói os botões de ação de um item
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  accountItem
     * @return [app.ui.action]
     */
    function itemActions (accountItem) {
        var actions = [];

        actions.push(new app.ui.action({
            image : 'pencil',
            legend : 'editar',
            click : function () {
                app.apps.open({
                    app : 'financas',
                    route : '/editar-conta/' + accountItem.account._id,
                    close : function (data) {
                        if (data) {
                            accountsItems[data._id].account = data;
                            accountsItems[data._id].item.title(data.name);
                            accountsItems[data._id].item.label.legend(data.name);
                            accountsItems[data._id].item.icons.remove();
                            accountsItems[data._id].item.icons.add(itemIcons(accountsItems[data._id]));
                        }
                    }
                })
            }
        }));

        return actions;
    }

    /**
     * Constrói os ícones de ação de um item
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  accountItem
     * @return [app.ui.icon]
     */
    function itemIcons (accountItem) {
        var icons = [];

        if (accountItem.account.bank) {
            icons.push(new app.ui.icon({
                image : 'wallet',
                legend : 'Banco: ' + accountItem.account.bank
            }));
        }
        if (accountItem.account.agency) {
            icons.push(new app.ui.icon({
                image : 'wallet',
                legend : 'Agência: ' + accountItem.account.agency
            }));
        }
        if (accountItem.account.account) {
            icons.push(new app.ui.icon({
                image : 'wallet',
                legend : 'Conta: ' + accountItem.account.account
            }));
        }
        if (accountItem.account.initialBalance && (accountItem.account.initialBalance*1).toFixed) {
            icons.push(new app.ui.icon({
                image : 'wallet',
                legend : 'Saldo inicial: ' + (accountItem.account.initialBalance*1).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(\,))/g, '.')
            }));
        }

        return icons;
    }

    /**
     * Constrói uma dupla account-item
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  app.model.account
     * @return accountItem
     */
    function accountItem (account) {
        accountsItems[account._id] = {
            item : new app.ui.item({
                title : account.name,
                label : {
                    legend : account.name,
                    color : 'blue'
                }
            }),
            account : account
        }

        accountsItems[account._id].item.actions.add(itemActions(accountsItems[account._id]));
        accountsItems[account._id].item.icons.add(itemIcons(accountsItems[account._id]));
        return accountsItems[account._id];
    }


    /**
     * Constrói o painel do filtro
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     */
    function filter () {
        var
        /**
         * Lista de campos do formulário de filtro
         */
        fields = {},
        /**
         * Fieldset principal do formulário
         */
        fieldset,
        /**
         * Função para filtrar resultados
         */
        filterAccounts;

        /**
         * Filtra os resultados
         *
         * @author Mauro Ribeiro
         * @since  2012-12
         */
        filterAccounts = function () {
            var queryField = fields.query.value();
            for (var i in accountsItems) {
                if (queryField.length > 1 && accountsItems[i].account.name.toLowerCase().indexOf(queryField.toLowerCase()) === -1) {
                    accountsItems[i].item.visibility('hide');
                } else {
                    accountsItems[i].item.visibility('show');
                }
            }
        }

        fields.query = new app.ui.inputText({
            legend : 'Buscar',
            type : 'text',
            name : 'query',
            change : filterAccounts
        });

        fieldset = new app.ui.fieldset({
            legend : 'Filtrar categorias',
            fields : [fields.query]
        });

        app.ui.filter.action('filtrar');

        app.ui.filter.fieldsets.add(fieldset);

        app.ui.filter.submit(filterAccounts);
    }


    app.ui.title('Contas');

    app.ui.actions.add(new app.ui.action({
        image : 'add',
        legend : 'adicionar conta',
        click : function () {
            app.apps.open({
                app : 'financas',
                route : '/adicionar-conta',
                close : function (account) {
                    console.log(account)
                    group.items.add(accountItem(account).item);
                }
            })
        }
    }))

    app.models.account.list(function (accounts) {
        accounts.sort(function (a,b) {
            var priority_a = a.name || 0,
                priority_b = b.name || 0;

            if (priority_a > priority_b) return  1;
            if (priority_a < priority_b) return -1;
            return 0
        });
        group = new app.ui.group();
        for (var i in accounts) {
            group.items.add(accountItem(accounts[i]).item);
        }
        app.ui.groups.add(group);
        filter();
        app.models.helpers.defaultAccounts(accounts);
    });

});
