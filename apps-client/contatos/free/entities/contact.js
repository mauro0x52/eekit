/**
 * Informações de um contato
 *
 * @author Mauro Ribeiro
 * @since  2012-12
 *
 * @param  params.id : id do contato
 */
app.routes.entity('/contato/:id', function (params, data) {

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
            details : new app.ui.dataset({legend : 'Detalhes'}),
            fields  : new app.ui.dataset({legend : 'Mais informações'})
        };
        app.ui.datasets.add([fieldsets.details]);


        /* Campos de dados */
        fields = {
            category : new app.ui.data({legend : 'categoria'}),
            email    : new app.ui.data({legend : 'email'}),
            phone    : new app.ui.data({legend : 'telefone'}),
            user     : new app.ui.data({legend : 'responsável'}),
            author   : new app.ui.data({legend : 'criado por'})
        };

        /* Botões do item */
        actions = {
            edit         : new app.ui.action({
                legend : 'editar contato',
                tip    : 'editar os dados deste contato',
                image  : 'pencil',
                click  : function() {
                    app.open({app : app.slug(), route : '/editar-contato/' + contact._id});
                }
            }),
            remove       : new app.ui.action({
                legend : 'remover contato',
                tip    : 'remover este contato da minha lista',
                image  : 'trash',
                click  : function() {
                    app.open({app : app.slug(), route : '/remover-contato/' + contact._id});
                }
            })
        };
        app.ui.actions.add([actions.remove, actions.edit]);

        /* Exibe o nome do contato */
        this.name = function (value) {
            app.ui.title('Contato: ' + value);
            app.ui.subtitle(value);
        }

        /* Exibe as notas do contato */
        this.notes = function (value) {
            app.ui.description(value || ' ');
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

        /* Exibe o autor do contato */
        this.author = function (value) {
            fields.author.values.remove();
            if (value) {
                for (var i in app.config.users) {
                    if (app.config.users[i]._id === value) {
                        fields.author.values.add(new app.ui.value({value : app.config.users[i].name}));
                        fieldsets.details.fields.add(fields.author);
                    }
                }
            } else {
                fieldsets.details.fields.remove(fields.author);
            }
        };

        /* Exibe o responsável do contato */
        this.user = function (value) {
            fields.user.values.remove();
            if (value) {
                for (var i in app.config.users) {
                    if (app.config.users[i]._id === value) {
                        fields.user.values.add(new app.ui.value({value : app.config.users[i].name}));
                        fieldsets.details.fields.add(fields.user);
                    }
                }
            } else {
                fieldsets.details.fields.remove(fields.user);
            }
        };

        /* Exibe campos personalizados do contato */
        this.fields = function (value) {
            var i, j,
                show = false;

            fieldsets.fields.fields.remove();
            for (i in value) {
                for (j in userFields) {
                    if (value[i].field && userFields[j]._id && value[i].field.toString() === userFields[j]._id.toString()) {
                        fieldsets.fields.fields.add(new app.ui.data({
                            legend : userFields[j].name,
                            values : [new app.ui.value({value : value[i].value})]
                        }));
                        show = show || value[i].value
                    }
                }
            }
            if (show) {
                app.ui.datasets.add([fieldsets.fields]);
            } else {
                app.ui.datasets.remove([fieldsets.fields]);
            }
        }

        /* Pegando a edição do contato */
        app.bind('update contact ' + contact._id, function (data) {
            contact = new app.models.contact(data);

            if (contact) {
                that.name(contact.name);
                that.notes(contact.notes);
                that.category(contact.category);
                that.email(contact.email);
                that.phone(contact.phone);
                that.fields(contact.fieldValues);
                that.author(contact.author);
                that.user(contact.user);
            }
        });

        /* Pegando o drop do contato */
        app.bind('drop contact ' + contact._id, function (data) {
            contact = new app.models.contact(data);

            if (contact) {
                that.category(contact.category);
            }
        });

        /* Pegando a exclusão do contato */
        app.bind('remove contact ' + contact._id, app.close);

        if (contact) {
            this.name(contact.name);
            this.notes(contact.notes);
            this.category(contact.category);
            this.email(contact.email);
            this.phone(contact.phone);
            this.fields(contact.fieldValues);
            this.author(contact.author);
            this.user(contact.user);
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
                new Entity(contact);

                app.open({
                    app : 'tarefas',
                    route : '/relacionadas',
                    data : {
                        embed  : ['/contatos/contato-relacionado/' + contact._id],
                        insert : {
                            title : contact.name
                        }
                    },
                    open : function (tool) {
                        app.ajax.get({
                            url : 'http://' + app.config.services.tasks.host + ':' + app.config.services.tasks.port + '/tasks',
                            data : data
                        }, function (response) {
                            var show = true;
                            if (response) {
                                for (i in response.tasks) {
                                    if (response.tasks[i].embeddeds) {
                                        show = false;
                                    }
                                }
                                if (show) {
                                    tool.groups.get()[0].header.actions.get()[0].helper.description('Adicione uma tarefa para seu contato');
                                    tool.groups.get()[0].header.actions.get()[0].helper.example('Ex: Emitir nota fiscal');
                                }
                            }
                        });
                    }
                })

                app.open({
                    app : 'financas',
                    route : '/relacionadas',
                    data : {
                        embed  : ['/contatos/contato-relacionado/' + contact._id],
                        insert : {
                            title : contact.name
                        }
                    }
                })


            });
        });
    });
});