/**
 * Diálogo para remover contato
 *
 * @author Mauro Ribeiro
 * @since  2012-12
 *
 * @param  params.id : id do contato
 */
app.routes.dialog('/remover-contato/:id', function (params, data) {
    var request = data ? data : {};

    app.ui.title("Remover contato");
    app.ui.form.action("Remover!");


    app.models.contact.find(params.id, function(contact) {
        app.ui.description("Ao apagar esse contato, você apagará também as tarefas relacionadas. Você tem certeza disso?");

        app.ui.form.submit(function() {
            contact.remove();
            app.events.trigger('remove contact ' + params.id);
            app.close(true);
        });
    });
});