/**
 * Informações de um contato
 *
 * @author Mauro Ribeiro
 * @since  2012-12
 *
 * @param  params.id : id do contato
 */
app.routes.embeddedEntity('/contato-relacionado/:id', function (params, data) {

    var
    /**
     * Lista de categorias
     */
    categories,

    /**
     * Lista de campos personalizados
     */
    userFields,

    /*
     * Classe que representa os campos do usuário
     */
    Entity;

    Entity = function (data) {
        var that = this,
            contact = new app.models.contact(data),
            actions,
            fields,
            fieldsets;

        /* Conjuntos de campos */
        fieldsets = {
            details : new app.ui.dataset({legend : 'Detalhes'})
        };
        app.ui.datasets.add([fieldsets.details]);


        /* Campos de dados */
        fields = {
            category : new app.ui.data({legend : 'categoria'}),
            email    : new app.ui.data({legend : 'email'}),
            phone    : new app.ui.data({legend : 'telefone'})
        };

        /* Exibe o nome do contato */
        this.name = function (value) {
            app.ui.title('Contato: ' + value);
            app.ui.subtitle(value);
        }

        /* Exibe as notas do contato */
        this.notes = function (value) {
            app.ui.description(value);
        }

        /* Exibe o email do contato */
        this.email = function (value) {
            fields.email.values.remove();
            if (value) {
                fields.email.values.add(new app.ui.value({value : value}));
                fieldsets.details.fields.add(fields.email);
            } else {
                fieldsets.details.fields.remove(fields.email);
            }
        };

        /* Exibe o telefone do contato */
        this.phone = function (value) {
            fields.phone.values.remove();
            if (value) {
                fields.phone.values.add(new app.ui.value({value : value}));
                fieldsets.details.fields.add(fields.phone);
            } else {
                fieldsets.details.fields.remove(fields.phone);
            }
        };

        /* Exibe a categoria do contato */
        this.category = function (value) {
            var i;

            fields.category.values.remove();
            if (value) {
                for (i in categories) {
                    if (value.toString() === categories[i]._id.toString()) {
                        fields.category.values.add(new app.ui.value({value : categories[i].name}));
                        fieldsets.details.fields.add(fields.category);
                    }
                }
            } else {
                fieldsets.details.fields.remove(fields.category);
            }
        };

        /* Pegando a edição do contato */
        app.events.bind('update contact ' + contact._id, function (data) {
            contact = new app.models.contact(data);

            if (contact) {
                that.name(contact.name);
                that.notes(contact.notes);
                that.category(contact.category);
                that.email(contact.email);
                that.phone(contact.phone);
            }
        });

        /* Pegando o drop do contato */
        app.events.bind('drop contact ' + contact._id, function (data) {
            contact = new app.models.contact(data);

            if (contact) {
                that.category(contact.category);
            }
        });

        /* Pegando a exclusão do contato */
        app.events.bind('remove contact ' + contact._id, app.close);

        if (contact) {
            this.name(contact.name);
            this.notes(contact.notes);
            this.category(contact.category);
            this.email(contact.email);
            this.phone(contact.phone);
        }
    };

    /**
     * Monta a view
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     */
    app.models.category.list(function (data) {
        categories = data;
        app.models.field.list(function (data) {
            userFields = data;
            app.models.contact.find(params.id, function (contact) {
                app.ui.click(function () {
                    app.apps.open({app : app.slug, route : '/contato/' + contact._id})
                });
                new Entity(contact);
            });
        });
    });
});