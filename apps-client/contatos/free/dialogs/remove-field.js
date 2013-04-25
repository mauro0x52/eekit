/**
 * Diálogo para remover campo personalizado
 *
 * @author Rafael Errthal
 * @since  2013-01
 *
 * @param  params.id : id do campo
 */
app.routes.dialog('/remover-campo-personalizado/:id', function (params, data) {
    var request = data ? data : {};

    app.ui.title("Remover campo personalizado");
    app.ui.form.action("Remover!");


    app.models.field.find(params.id, function(field) {
        app.ui.description("As informações dos seus contatos contidas nesse campo serão apagadas. Deseja continuar?");

        app.ui.form.submit(function() {
            field.remove(function () {});
            app.close(true);
        });
    });
});