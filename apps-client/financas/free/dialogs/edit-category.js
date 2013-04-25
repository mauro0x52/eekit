/**
 * Diálogo para editar o nome de uma categoria
 *
 * @author Mauro Ribeiro
 * @since  2012-12
 *
 * @param id : id da categoria a ser alterada
 */
app.routes.dialog('/editar-categoria/:id', function (params, data) {

    /**
     * Cria o formulário
     *
     * @author : Mauro Ribeiro
     * @since : 2012-12
     *
     * @param category : categoria a ser editada
     */
    function form (category) {
        var
        /**
         * Campos do formulário
         */
        fields = {},

        /**
         * Fieldset ui.fieldset principal do formulário
         */
        fieldset;

        /* Inputs do formulário */
        fields.name = new app.ui.inputText({
            legend : 'Nome',
            type : 'text',
            name : 'name',
            value : category.name,
            rules : [{rule:/.{3,}/, message : 'campo obrigatório'}]
        });

        fieldset = new app.ui.fieldset({
            legend : 'Categoria'
        });
        fieldset.fields.add(fields.name);

        app.ui.form.fieldsets.add(fieldset);

        fields.name.focus();

        /* Controle de envio do form */
        app.ui.form.submit(function() {
            category.name = fields.name.value();
            category.save(function () {
                app.close(category);
            });
        });

    } // end form()

    /**
     * Monta o diálogo
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     */
    app.ui.title("Editar categoria");
    app.ui.form.action("Editar!");

    app.models.category.find(params.id, function (category) {
        form(category);
    })
});