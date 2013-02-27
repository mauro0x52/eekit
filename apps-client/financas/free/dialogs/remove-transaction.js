/**
 * Diálogo para remover transação
 *
 * @author Rafael Erthal
 * @since  2013-01
 *
 * @param  params.id : id da transação
 */
app.routes.dialog('/remover-transacao/:id', function (params, data) {
    var request = data ? data : {};

    app.ui.title("Remover transação");
    app.ui.form.action("Remover!");

    app.models.transaction.find(params.id, function(transaction) {
        app.ui.description("Você tem certeza que gostaria de excluir essa transação?");

        app.ui.form.submit(function() {
            transaction.remove();
            app.events.trigger('remove transaction ' + params.id);
            app.close();
        });
    });
});