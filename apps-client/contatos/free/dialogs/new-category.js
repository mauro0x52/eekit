/**
 * Diálogo para criação de uma categoria
 *
 * @author Mauro Ribeiro
 * @since  2012-12
 */
app.routes.dialog('/adicionar-categoria', function (params, data) {
    var request = data ? data : {};

    /**
     * Monta o formulário
     *
     * @author Mauro Ribeiro
     * @since  2013-02
     */
    function form () {
        var fields = {}, typesOptions = [], colorsOptions = [], fieldset, i;

        /* Input com os tipos */
        typesOptions.push(new app.ui.inputOption({
            legend : 'clientes',
            value : 'clients',
            click : request.type ? request.type === 'clients' : true
        }));
        typesOptions.push(new app.ui.inputOption({
            legend : 'fornecedores',
            value : 'suppliers',
            click : request.type ? request.type === 'suppliers' : false
        }));
        typesOptions.push(new app.ui.inputOption({
            legend : 'parceiros',
            value : 'partners',
            click : request.type ? request.type === 'partners' : false
        }));
        typesOptions.push(new app.ui.inputOption({
            legend : 'pessoais',
            value : 'personals',
            click : request.type ? request.type === 'personals' : false
        }));

        fields.types = new app.ui.inputSelector({
            type : 'single',
            name : 'type',
            legend : 'Tipo',
            options : typesOptions
        });

        /* input das cores */
        for (var i in app.models.colors) {
            colorsOptions.push(new app.ui.inputOption({
                legend : app.models.colors[i],
                value : i,
                label : i,
                click : i === 'navy'
            }));
        }

        fields.colors = new app.ui.inputSelector({
            type : 'single',
            name : 'color',
            legend : 'Cor',
            options : colorsOptions,
            filterable : true
        });

        /* Inputs do formulário */
        fields.name = new app.ui.inputText({
            legend : 'Nome',
            name : 'name',
            rules : [{rule:/.{3,}/, message : 'campo obrigatório'}]
        });

        fieldset = new app.ui.fieldset({
            legend : 'Categoria'
        });
        fieldset.fields.add(fields.name);
        fieldset.fields.add(fields.types);
        fieldset.fields.add(fields.colors);

        app.ui.form.fieldsets.add(fieldset);

        fields.name.focus();

        /* Controle de envio do form */
        app.ui.form.submit(function() {
            var data = {
                name : fields.name.value(),
                type : fields.types.value()[0],
                color : fields.colors.value()[0]
            };
            var category = new app.models.category(data);
            category.save(function () {
                app.close(category);
            });
        });

    } // end form()

    /**
     * Monta a views
     *
     * @author Mauro Ribeiro
     * @since  2013-02
     */
    app.ui.title("Adicionar categoria");
    app.ui.form.action("Adicionar!");

    form();
});