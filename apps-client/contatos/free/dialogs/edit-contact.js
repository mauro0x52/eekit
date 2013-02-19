/**
 * Diálogo para atualização dos dados de um novo contato
 *
 * @author Mauro Ribeiro
 * @since  2012-12
 *
 * @param  params.id : id do contato
 */
app.routes.dialog('/editar-contato/:id', function (params, data) {
    var request = data ? data : {};

    /**
     * Retorna o valor do campo
     *
     * @author Rafael Erthal
     * @since  2013-01
     *
     * @param  field_id : id do campo
     * @param  values : vetor com os valores dos campos do contato
     */
    function fieldValue (field_id, values) {
        var i;
        for (i in values) {
            if (values[i].field.toString() === field_id.toString()) {
                return values[i].value;
            }
        }
        return '';
    }

    /**
     * Retorna o id do campo
     *
     * @author Rafael Erthal
     * @since  2013-01
     *
     * @param  field_id : id do campo
     * @param  values : vetor com os valores dos campos do contato
     */
    function fieldId (field_id, values) {
        var i;
        for (i in values) {
            if (values[i].field.toString() === field_id.toString()) {
                return values[i]._id;
            }
        }
    }

    /**
     * Monta o formulário
     *
     * @author Mauro Ribeiro
     * @since  2012-11
     *
     * @param  categories : lista de fases de negociação do usuário
     * @param  userfields : lista de campos configráveis
     * @param  contact : contato a ser atualizado
     */
    function form (categories, userfields, contact) {
        var fields = {}, categoriesOptions = [], fieldset, i;

        /* Input com as fases */
        for (var i in categories) {
            if (categories.hasOwnProperty(i)) {
                categoriesOptions.push(new app.ui.inputOption({
                    legend : categories[i].name,
                    value : categories[i]._id,
                    label : categories[i].color,
                    clicked : categories[i]._id === contact.category
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
            type : 'text',
            name : 'name',
            value : contact.name,
            rules : [{rule:/.{3,}/, message : 'campo obrigatório'}]
        });
        fields.email = new app.ui.inputText({
            legend : 'Email',
            type : 'text',
            name : 'email',
            value : contact.email
        });
        fields.phone = new app.ui.inputText({
            legend : 'Telefone',
            type : 'text',
            name : 'phone',
            value : contact.phone
        });
        fields.notes = new app.ui.inputText({
            legend : 'Notas',
            type : 'text',
            name : 'notes',
            value : contact.notes
        });
        fields.userfields = [];
        for (i in userfields) {
            fields.userfields.push(new app.ui.inputText({
                legend : userfields[i].name,
                name : userfields[i]._id,
                value : fieldValue(userfields[i]._id, contact.fieldValues)
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
            contact.name = fields.name.value();
            contact.email = fields.email.value();
            contact.category = fields.category.value()[0];
            contact.phone = fields.phone.value();
            contact.notes = fields.notes.value();
            contact.fieldValues = [];
            for (var i in fields.userfields) {
                contact.fieldValues.push({
                    field : fields.userfields[i].name(),
                    value : fields.userfields[i].value(),
                    _id   : fieldId(userfields[i]._id, contact.fieldValues)
                })
            }
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
    app.ui.title("Editar contato");

    app.models.category.list(function(categories) {
        app.models.field.list(function (fields) {
            fields.sort(function (a,b) {
                var positionA = a.position || 1,
                    positionB = b.position || 1;

                if (positionA > positionB) return  1;
                if (positionA < positionB) return -1;
                return 0
            });
            app.models.contact.find(params.id, function(contact) {
                form(categories, fields, contact);
            });
        });
    });
});