/**
 * Diálogo para remover categoria
 *
 * @author Mauro Ribeiro
 * @since  2013-02
 *
 * @param  params.id : id da categoria
 */
app.routes.dialog('/remover-categoria/:id', function (params, data) {
    var request = data ? data : {};

    app.ui.title("Remover categoria");
    app.ui.form.action("Remover!");


    app.models.category.find(params.id, function(category) {
        app.ui.description('Ao apagar esta categoria, todos os contatos desta categoria serão categorizados como \"sem categoria\". Deseja realmente apagar \"'+category.name+'\"?');

        app.ui.form.submit(function() {
            category.remove(function () {
                app.events.trigger('remove category ' + params.id);
                app.close(true);
            });
        });
    });
});