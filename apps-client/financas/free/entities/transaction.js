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
     * Campos dos dados do usuário
     */
    fields = {},
    /**
     * Callback para quando for executada a remoção
     */
    remove = (data && data.remove) ? data.remove : function () {},
    /**
     * Callback para quando for executada a edição
     */
    edit = (data && data.edit) ? data.edit : function () {},
    /**
     * Lista de categorias do usuário
     */
    categories,
    /**
     * Lista de contas do usuário
     */
    accounts;

    /**
     * Retorna o nome da categoria
     *
     * @author Rafael Erthal
     * @since  2013-01
     *
     * @param  id : id da categoria
     */
    function categoryName (id) {
        var i;
        if (id) {
            for (var i in categories) {
                if (id.toString() === categories[i]._id.toString()) {
                    return categories[i].name;
                }
            }
        }
        return 'transferência'
    }

    /**
     * Retorna o nome da conta
     *
     * @author Rafael Erthal
     * @since  2013-01
     *
     * @param  id : id da categoria
     */
    function accountName (id) {
        var i;
        for (var i in accounts) {
            if (id.toString() === accounts[i]._id.toString()) {
                return accounts[i].name;
            }
        }
        return '-'
    }

    /**
     * Monta ferramenta
     *
     * @author Rafael Erthal
     * @since  2013-01
     */

    app.models.account.list(function (data) {
        accounts = data;
        app.models.category.list(function (data) {
            categories = data;
            app.models.transaction.find(params.id, function (transaction) {
                app.ui.title('Transação: ' + transaction.name);

                app.ui.actions.add(
                    new app.ui.action({
                        label : 'editar transação',
                        image : 'pencil',
                        click : function() {
                            edit(function (transaction) {
                                app.ui.title('Transação: ' + transaction.name);
                                fields.category.values.get()[0].value(categoryName(transaction.category));
                                fields.account.values.get()[0].value(accountName(transaction.account));
                                fields.value.values.get()[0].value('$' + parseFloat(transaction.value).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(\,))/g, '.'));
                            });
                        }
                    })
                );

                app.ui.actions.add(
                    new app.ui.action({
                        label : 'remover transação',
                        image : 'trash',
                        click : function() {
                            remove(function () {
                                app.close();
                            });
                        }
                    })
                );

                fields.category = new app.ui.data({
                    legend : 'categoria',
                    values : [new app.ui.value({value : categoryName(transaction.category)})]
                });

                fields.account = new app.ui.data({
                    legend : 'conta',
                    values : [new app.ui.value({value : accountName(transaction.account)})]
                });

                fields.value = new app.ui.data({
                    legend : 'valor',
                    values : [new app.ui.value({value : '$' + parseFloat(transaction.value).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(\,))/g, '.')})]
                });

                app.ui.datasets.add(
                    new app.ui.dataset({
                        legend : 'Detalhes',
                        fields : [fields.category, fields.account, fields.value]
                    })
                );
            });
        });
    });
});