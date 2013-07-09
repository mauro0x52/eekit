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
        app.ui.description('Ao apagar esta categoria, todos as tarefas desta categoria serão apagadas. Deseja realmente apagar \"'+category.name+'\"?');

        app.ui.form.submit(function() {
            category.remove(function () {
                app.trigger('remove category ' + category._id);
                app.close();
            });
        });
    });
});