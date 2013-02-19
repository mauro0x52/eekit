/**
 * Diálogo para criação de um novo contato
 *
 * @author Mauro Ribeiro
 * @since  2012-12
 */
app.routes.dialog('/adicionar-contato', function (params, data) {
    var request = data ? data : {};

    /**
     * Monta o formulário
     *
     * @author Mauro Ribeiro
     * @since  2012-11
     *
     * @param  categories : lista de fases de negociação do usuário
     * @param  userfields : lista de campos configuraveis
     */
    function form (categories, userfields) {
        var fields = {}, categoriesOptions = [], fieldset, i;

        /* Input com as fases */
        for (var i in categories) {
            if (categories.hasOwnProperty(i)) {
                categoriesOptions.push(new app.ui.inputOption({
                    legend : categories[i].name,
                    value : categories[i]._id,
                    label : categories[i].color,
                    clicked : request.category ? categories[i]._id === request.category : parseInt(i) === 0
                }));
            }
        }

        /* Inputs do formulário */
        fields.category = new app.ui.inputSelector({
            type : 'single',
            name : 'category',
            legend : 'Categoria',
            options : categoriesOptions,
            filterable : true
        });
        fields.name = new app.ui.inputText({
            legend : 'Nome',
            name : 'name',
            rules : [{rule:/.{3,}/, message : 'campo obrigatório'}]
        });
        fields.email = new app.ui.inputText({
            legend : 'Email',
            name : 'email'
        });
        fields.phone = new app.ui.inputText({
            legend : 'Telefone',
            name : 'phone'
        });
        fields.notes = new app.ui.inputText({
            legend : 'Notas',
            name : 'notes'
        });
        fields.userfields = [];
        for (i in userfields) {
            fields.userfields.push(new app.ui.inputText({
                legend : userfields[i].name,
                name : userfields[i]._id
            }));
        }

        fieldset = new app.ui.fieldset({
            legend : 'Contato'
        });
        fieldset.fields.add(fields.name);
        fieldset.fields.add(fields.email);
        fieldset.fields.add(fields.phone);
        fieldset.fields.add(fields.category);
        for (i in fields.userfields) {
            fieldset.fields.add(fields.userfields[i]);
        }
        fieldset.fields.add(fields.notes);

        app.ui.form.fieldsets.add(fieldset);

        fields.name.focus();

        /* Controle de envio do form */
        app.ui.form.submit(function() {
            var data = {
                name : fields.name.value(),
                email : fields.email.value(),
                category : fields.category.value()[0],
                phone : fields.phone.value(),
                notes: fields.notes.value(),
                fieldValues : []
            };
            for (var i in fields.userfields) {
                data.fieldValues.push({
                    field : fields.userfields[i].name(),
                    value : fields.userfields[i].value()
                })
            }
            console.log(data);
            var contact = new app.models.contact(data);
            contact.save(function () {
                app.close(contact);
            });
        });

    } // end form()

    /**
     * Monta a views
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     */
    app.ui.title("Adicionar contato");

    app.models.category.list(function(categories) {
        app.models.field.list(function (fields) {
            fields.sort(function (a,b) {
                var positionA = a.position || 1,
                    positionB = b.position || 1;

                if (positionA > positionB) return  1;
                if (positionA < positionB) return -1;
                return 0
            });
            form(categories, fields);
        });
    });
});