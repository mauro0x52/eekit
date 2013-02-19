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
     * Campos dos dados do usuário
     */
    fields = {},
    /**
     * Callback chamado quando executada a remoção
     */
    remove = (data && data.remove) ? data.remove : function () {},
    /**
     * Callback chamado quando executada a edição
     */
    edit = (data && data.edit) ? data.edit : function () {},
    /**
     * Nome dos dias da semana
     */
    daysNames = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
    /**
     * Nome dos meses
     */
    monthsNames = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
    /**
     * Lista de fases de negociação do usuário
     */
    categories,
    /**
     * Lista de campos configuráveis
     */
    userfields;

    /**
     * Formata a data de forma legível para o usuário
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  string : data a ser formatada
     */
    function dateFormat (string) {
        var date = new Date(string);
        return daysNames[date.getDay()]  + ', ' + date.getDate() + ' de ' + monthsNames[date.getMonth()] + ' de ' + date.getFullYear()
    }

    /**
     * Retorna o nome da fase de negociação
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  category_id : id da fase de negociação
     */
    function categoryName (category_id) {
        var i;
        for (i in categories) {
            if (category_id.toString() === categories[i]._id.toString()) {
                return categories[i].name;
            }
        }
        return 'Não-cliente'
    }

    /**
     * Retorna o nome do campo configurável
     *
     * @author Rafael Erthal
     * @since  2013-01
     *
     * @param  field_id : id do campo
     */
    function fieldName (field_id) {
        var i;
        for (i in userfields) {
            if (field_id.toString() === userfields[i]._id.toString()) {
                return userfields[i].name;
            }
        }
        return ''
    }

    /**
     * Monta ferramenta
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     */

    /* autenticando usuário e pegando categorias */
    app.models.category.list(function (data) {
        categories = data;
        app.models.field.list(function (data) {
            userfields = data;
            app.models.contact.find(params.id, function (contact) {
                var i;

                app.ui.actions.add(
                    new app.ui.action({
                        label : 'editar contato',
                        image : 'pencil',
                        click : function() {
                            app.apps.dialog({
                                app : 'contatos',
                                route : '/editar-contato/'+contact._id,
                                close : function (data) {
                                    if (data) {
                                        app.ui.title('Contato: ' + data.name);
                                        app.ui.subtitle(data.name);
                                        app.ui.description(data.notes);
                                        fields.phone.values.get()[0].value(data.phone || '-');
                                        fields.email.values.get()[0].value(data.email || '-');
                                        fields.category.values.get()[0].value(categoryName(data.category));
                                        edit(data);
                                    }
                                }
                            })
                        }
                    })
                );
                app.ui.actions.add(
                    new app.ui.action({
                        label : 'remover contato',
                        image : 'trash',
                        click : function() {
                            app.apps.dialog({
                                app : 'contatos',
                                route : '/remover-contato/'+contact._id,
                                close : function (data) {
                                    if (data) {
                                        remove();
                                        app.close();
                                    }
                                }
                            })
                        }
                    })
                );

                app.ui.title('Contato: ' + contact.name);

                app.ui.subtitle(contact.name);

                app.ui.description(contact.notes);


                fields.category = new app.ui.data({
                    legend : 'categoria',
                    values : [new app.ui.value({value : categoryName(contact.category)})]
                });

                fields.email = new app.ui.data({
                    legend : 'email',
                    values : [new app.ui.value({value : contact.email || '-' })]
                });

                fields.phone = new app.ui.data({
                    legend : 'telefone',
                    values : [new app.ui.value({value : contact.phone || '-'})]
                });

                fields.userfields = []

                for (i in contact.fieldValues) {
                    if(fieldName(contact.fieldValues[i].field)) {
                        fields.userfields.push(new app.ui.data({
                            legend : fieldName(contact.fieldValues[i].field),
                            values : [new app.ui.value({value : contact.fieldValues[i].value || '-'})]
                        }));
                    }
                }

                app.ui.datasets.add(
                    new app.ui.dataset({
                        legend : 'Detalhes',
                        fields : [fields.category, fields.email, fields.phone]
                    })
                );

                app.ui.datasets.add(
                    new app.ui.dataset({
                        legend : 'Mais informações',
                        fields : fields.userfields
                    })
                );

                app.apps.embeddedList({
                    app : 'tarefas',
                    route : '/relacionadas',
                    data : {
                        add : {
                            embeddeds : ['/contatos/contato-relacionado/' + contact._id],
                            category : 'Vendas',
                            title : contact.name
                        },
                        list : {
                            embeddeds : ['/contatos/contato-relacionado/' + contact._id]
                        }
                    },
                    open : function (tool) {
                            setTimeout(function() {
                                if (tool.groups.get()[0].items.get().length + tool.groups.get()[1].items.get().length === 0) {
                                    tool.groups.get()[0].header.actions.get()[0].helper.description('Adicione tarefas para o seu contato e mantenha seu relacionamento em dia');
                                    tool.groups.get()[0].header.actions.get()[0].helper.example('Ex.: "Enviar proposta", "Reunião", "Pedir relatório", "emitir nota fiscal" etc.');
                                }
                            }, 2000)
                        app.ui.embbeds.add(tool);
                    }
                })
            });
        });
    });
});