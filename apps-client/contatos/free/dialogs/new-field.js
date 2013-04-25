/**
 * Diálogo para criação de um novo campo personalizável
 *
 * @author Rafael Erthal
 * @since  2013-01
 */
app.routes.dialog('/adicionar-campo-personalizado', function (params, data) {
    var request = data ? data : {};

    /**
     * Monta o formulário
     *
     * @author Rafael Erthal
     * @since  2013-01
     */
    function form () {
        var fields = {}, fieldset;

        /* Inputs do formulário */
        fields.name = new app.ui.inputText({
            legend : 'Nome do campo',
            type : 'text',
            name : 'name',
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
            var data = {
                name : fields.name.value()
            };
            var field = new app.models.field(data);
            field.save(function () {
                app.close(field);
            });
        });

    } // end form()

    /**
     * Monta a views
     *
     * @author Rafael Erthal
     * @since  2013-01
     */
    app.ui.title("Adicionar campo personalizado");
    app.ui.form.action("Adicionar!");

    form();
});