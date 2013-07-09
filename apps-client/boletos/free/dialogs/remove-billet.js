/**
 * Diálogo para remover boleto
 *
 * @author Mauro Ribeiro
 * @since  2013-04
 *
 * @param  params.id : id do boleto
 */
app.routes.dialog('/remover-boleto/:id', function (params, data) {
    var request = data ? data : {};

    app.ui.title("Remover boleto");
    app.ui.form.action("Remover!");


    app.models.billet.find(params.id, function(billet) {
        app.ui.description("Você realmente deseja apagar este boleto para sempre?");

        app.ui.form.submit(function() {
            billet.remove(function () {
                app.trigger('remove billet ' + billet._id);
                app.close();
            });
        });
    });
});