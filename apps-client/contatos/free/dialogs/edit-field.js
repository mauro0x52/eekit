/**
 * Diálogo para atualização dos dados de um campo personnalizavel
 *
 * @author Rafael Erthal
 * @since  2013-01
 *
 * @param  params.id : id do campo
 */
app.routes.dialog('/editar-campo-personalizado/:id', function (params, data) {
    var request = data ? data : {};

    /**
     * Monta o formulário
     *
     * @author Rafael Erthal
     * @since  2013-01
     *
     * @param  field : campo a ser atualizado
     */
    function form (field) {
        var fields = {}, fieldset;

        /* Inputs do formulário */
        fields.name = new app.ui.inputText({
            legend : 'Nome',
            type : 'text',
            name : 'name',
            value : field.name,
            rules : [{rule:/.{3,}/, message : 'campo obrigatório'}]
        });

        fieldset = new app.ui.fieldset({
            legend : 'Campo personalizado'
        });
        fieldset.fields.add(fields.name);
        app.ui.form.fieldsets.add(fieldset);

        fields.name.focus();

        /* Controle de envio do form */
        app.ui.form.submit(function() {
            field.name = fields.name.value();
            field.save(function () {
                app.close(field);
            });
        });

    } // end form()

    /**
     * Monta a views
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     */
    app.ui.title("Editar campo personalizado");

    app.models.field.find(params.id, function(field) {
        form(field);
    });
});