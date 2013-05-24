/**
 * Diálogo para remover tarefa
 *
 * @author Rafael Errthal
 * @since  2013-01
 *
 * @param  params.id : id da tarefa
 */
app.routes.dialog('/remover-tarefa/:id', function (params, data) {
    var request = data ? data : {};

    app.ui.title("Remover tarefa");
    app.ui.form.action("Remover!");


    app.models.task.find(params.id, function(task) {
        app.ui.description("Você tem certeza que gostaria de excluir essa tarefa?");

        app.ui.form.submit(function() {
            task.remove(function () {});
            app.close();
        });
    });
});