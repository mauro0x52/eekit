/**
 * Diálogo para criar nova categoria
 *
 * @author Mauro Ribeiro
 * @since  2012-12
 */
app.routes.dialog('/adicionar-categoria', function (params, data) {
    var type = data ? (data.type || 'credit') : 'credit';

    /**
     * Cria o formulário
     *
     * @author : Mauro Ribeiro
     * @since : 2012-12
     */
    function form () {
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
            name : 'name',
            rules : [{rule:/.{3,}/, message : 'campo obrigatório'}]
        });

        fields.type = new app.ui.inputSelector({
            legend : 'Tipo',
            type : 'single',
            name : 'type',
            options : [
                new app.ui.inputOption({legend : 'receita', value : 'credit', click : type === 'credit'}),
                new app.ui.inputOption({legend : 'despesa', value : 'debt', click : type === 'debt'})
            ]
        })

        fieldset = new app.ui.fieldset({
            legend : 'Categoria'
        });
        fieldset.fields.add(fields.name);
        fieldset.fields.add(fields.type);

        app.ui.form.fieldsets.add(fieldset);

        fields.name.focus();

        /* Controle de envio do form */
        app.ui.form.submit(function() {
            var data = {
                name : fields.name.value(),
                type : fields.type.value()[0]
            };
            var category = new app.models.category(data);
            category.save(function () {
                app.trigger('create category', category);
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
    app.ui.title("Adicionar categoria");
    app.ui.form.action("Adicionar!");

    form();
});