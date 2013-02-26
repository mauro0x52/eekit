/**
 * Informações de uma transacao
 *
 * @author Rafael Erthal
 * @since  2013-01
 *
 * @param  params.id : id da transacao
 */
app.routes.embeddedEntity('/transacao-relacionada/:id', function (params, data) {
    var
    /**
     * Campos dos dados do usuário
     */
    fields = {},
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
        for (var i in categories) {
            if (id.toString() === categories[i]._id.toString()) {
                return categories[i].name;
            }
        }
        return '-'
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
     * @author Mauro Ribeiro
     * @since  2012-12
     */

    app.ui.title('Transação relacionada');

    app.models.account.list(function (data) {
        accounts = data;
        app.models.category.list(function (data) {
            categories = data;
            app.models.transaction.find(params.id, function (transaction) {
                app.ui.subtitle(transaction.name);

                app.ui.click(function () {
                    app.apps.open({
                        app : app.slug,
                        route : '/transacao/' + transaction._id
                    })
                });

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