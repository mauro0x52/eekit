/**
 * Lista das contas
 *
 * @author Mauro Ribeiro
 * @since 2012-12
 */
app.routes.list('/contas', function (params, data) {

    var
    /**
     * Classe que representa um item
     */
    Item,

    /**
     * Objeto com os grupos
     */
    groups;

    /* montando os grupos */
    groups = {
        group : new app.ui.group()
    };

    app.ui.groups.add([groups.group]);

    /**
     * Grupo que uma categoria se encaixa
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  category : category
     * @return ui.group
     */
    function fitGroup (category) {
        return groups.group;
    }

    /* montando os items */
    Item = function (data) {
        var that = this,
            account = new app.models.account(data),
            icons,
            actions;

        this.item = new app.ui.item();

        /* Icones do item */
        icons = {
            bank           : new app.ui.icon({image : 'wallet', legend : '-'}),
            agency         : new app.ui.icon({image : 'wallet', legend : '-'}),
            account        : new app.ui.icon({image : 'wallet', legend : '-'}),
            initialBalance : new app.ui.icon({image : 'wallet', legend : '-'})
        };

        /* Botões do item */
        actions = {
            edit         : new app.ui.action({
                tip : 'editar dados desta conta',
                image  : 'pencil',
                click  : function() {
                    app.open({app : app.slug(), route : '/editar-conta/' + account._id});
                }
            })
        };
        this.item.actions.add([actions.edit]);

        /* Exibe o nome da conta */
        this.name = function (value) {
            this.item.title(value);
            this.item.label.legend(value);
        };

        /* Exibe a cor da conta */
        this.color = function (value) {
            //Ja vou deixar esse método aqui caso no futuro usuário possa escolher cor
            this.item.label.color('blue');
        };

        /* Exibe o banco da conta */
        this.bank = function (value) {
            if (value) {
                this.item.icons.add(icons.bank);
                icons.bank.legend('Banco: ' + value);
            } else {
                this.item.icons.remove(icons.bank);
                icons.bank.legend('-');
            }
        };

        /* Exibe a agencia da conta */
        this.agency = function (value) {
            if (value) {
                this.item.icons.add(icons.agency);
                icons.agency.legend('Agência: ' + value);
            } else {
                this.item.icons.remove(icons.agency);
                icons.agency.legend('-');
            }
        };

        /* Exibe a conta da conta */
        this.account = function (value) {
            if (value) {
                this.item.icons.add(icons.account);
                icons.account.legend('Conta: ' + value);
            } else {
                this.item.icons.remove(icons.account);
                icons.account.legend('-');
            }
        };

        /* Exibe o balanço inicial da conta */
        this.initialBalance = function (value) {
            if (value) {
                this.item.icons.add(icons.initialBalance);
                icons.initialBalance.legend('Saldo inicial: ' + (value*1).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(\,))/g, '.'));
            } else {
                this.item.icons.remove(icons.initialBalance);
                icons.initialBalance.legend('-');
            }
        };

        /* Pegando a edição da categoria */
        app.bind('update account ' + account._id, function (data) {
            account = new app.models.account(data);

            if (account) {
                that.name(account.name);
                that.color(account.color);
                that.bank(account.bank);
                that.agency(account.agency);
                that.account(account.account);
                that.initialBalance(account.initialBalance);
            }
        });

        /* Pegando a exclusão da categoria */
        app.bind('remove account ' + account._id, this.item.detach);

        /* Pegando quando o filtro é acionado */
        app.bind('filter account', function (fields) {
            var queryField = fields.query.value();
            if (
                queryField.length > 1 && account.name.toLowerCase().indexOf(queryField.toLowerCase()) === -1
            ) {
                that.item.visibility('hide');
            } else {
                that.item.visibility('show');
            }
        });

        if (account) {
            this.name(account.name);
            this.color(account.color);
            this.bank(account.bank);
            this.agency(account.agency);
            this.account(account.account);
            this.initialBalance(account.initialBalance);
        }
    }

    /* autenticando usuário e pegando contas */
    app.models.user.auth(function () {
        app.models.account.list(function (accounts) {
            var fields = {}

            app.ui.title('Contas');
            app.event('visualizar contas');

            /* Botão global de adicionar categoria */
            app.ui.actions.add(new app.ui.action({
                image : 'add',
                legend : 'adicionar conta',
                tip : 'adicionar nova conta',
                click : function () {
                    app.open({
                        app : app.slug(),
                        route : '/adicionar-conta'
                    })
                }
            }));

            /* Monta o filtro */
            app.ui.filter.action('filtrar');
            /* filtro por texto */
            fields.query = new app.ui.inputText({
                legend : 'Buscar',
                type : 'text',
                name : 'query',
                change : app.ui.filter.submit
            });
            /* fieldset principal */
            app.ui.filter.fieldsets.add(new app.ui.fieldset({
                legend : 'Filtrar contas',
                fields : [fields.query]
            }));
            /* dispara o evento de filtro */
            app.ui.filter.submit(function () {
                app.trigger('filter account', fields);
            });

            /* ordenando as contas */
            accounts.sort(function (a,b) {
                var priority_a = a.name || 0,
                    priority_b = b.name || 0;

                if (priority_a > priority_b) return  1;
                if (priority_a < priority_b) return -1;
                return 0
            });

            /* listando as contas */
            for (var i in accounts) {
                fitGroup(accounts[i]).items.add((new Item(accounts[i])).item);
            }

            /* Pegando contas que são cadastradas ao longo do uso do app */
            app.bind('create account', function (account) {
                fitGroup(account).items.add((new Item(account)).item);
            });
        });
    });
});
