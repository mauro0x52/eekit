/**
 * Diálogo para remover categoria
 *
 * @author Rafael Erthal
 * @since  2013-01
 *
 * @param  params.id : id da categoria
 */
app.routes.dialog('/remover-categoria/:id', function (params, data) {
    var request = data ? data : {};

    app.ui.title("Remover categoria");
    app.ui.form.action("Remover!");

    app.models.category.find(params.id, function(category) {
        app.ui.description("Ao excluir essa categoria, as transações relacionadas a ela serão excluidas. Tem certeza que quer fazer isso?");

        app.ui.form.submit(function() {
            category.remove();
            app.events.trigger('remove category ' + params.id);
            app.close(true);
        });
    });
});