/**
 * Diálogo para edição de uma categoria
 *
 * @author Mauro Ribeiro
 * @since  2013-02
 */
app.routes.dialog('/editar-categoria/:id', function (params, data) {
    var request = data ? data : {};

    /**
     * Monta o formulário
     *
     * @author Mauro Ribeiro
     * @since  2013-02
     */
    function form (category) {
        var fields = {}, typesOptions = [], colorsOptions = [], fieldset, i;

        /* Input com os tipos */
        typesOptions.push(new app.ui.inputOption({
            legend : 'clientes',
            value : 'clients',
            clicked : category.type === 'clients'
        }));
        typesOptions.push(new app.ui.inputOption({
            legend : 'fornecedores',
            value : 'suppliers',
            clicked : category.type === 'suppliers'
        }));
        typesOptions.push(new app.ui.inputOption({
            legend : 'parceiros',
            value : 'partners',
            clicked : category.type === 'partners'
        }));
        typesOptions.push(new app.ui.inputOption({
            legend : 'pessoais',
            value : 'personals',
            clicked : category.type === 'personals'
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
                clicked : i === category.color
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
            rules : [{rule:/.{3,}/, message : 'campo obrigatório'}],
            value : category.name
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
            category.name = fields.name.value();
            category.type = fields.types.value()[0];
            category.color = fields.colors.value()[0];
            category.save(function () {
                app.events.trigger('update category ' + params.id, category);
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
    app.ui.form.action("Editar!");

    app.models.category.find(params.id, function(category) {
        form(category);
    });
});