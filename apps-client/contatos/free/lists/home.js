/**
 * Lista de contatos
 *
 * @author Mauro Ribeiro
 * @since  2012-12
 */
app.routes.list('/', function (params, data) {

    var
    /**
     * Lista de ui.group de fases de negociação
     */
    categoriesGroups = {},
    /**
     * Lista de { contact : models.contact, item : ui.item }
     */
    contactsItems = {},
    /**
     * Lista dos grupos de tipo
     */
    typeGroups = {},
    /**
     * Variável de controle para uma primeira filtragem
     */
    firstFilter = true;

    /**
     * Atualiza as informações de uma dupla contact-item após edição
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  contactItem : dupla contact-item
     * @param  data : models.contact recém atualizada
     */
    function edit (contactItem, data) {
        var newLabel;
        contactItem.item.title(data.name);
        contactItem.item.description(data.notes);
        contactItem.contact.name = data.name;
        contactItem.contact.phone = data.phone;
        contactItem.contact.email = data.email;
        contactItem.contact.notes = data.notes;
        if (contactItem.item.category !== data.category) {
            categoriesGroups[contactItem.contact.category].group.items.remove(contactItem.item);
            contactItem.contact.category = data.category;
            categoriesGroups[contactItem.contact.category].group.items.add(contactItem.item);

            contactItem.item.icons.remove();
            contactItem.item.icons.add(itemIcons(contactItem));

            newLabel = label(data.category);
            contactItem.item.label.color(newLabel.color);
            contactItem.item.label.legend(newLabel.legend);
        }
    }

    /**
     * Atualiza as informações de uma dupla contact-item após exclusão
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  contactItem : dupla contact-item
     */
    function remove (contactItem) {
        contactItem.item.detach();
        delete contactsItems[contactItem.contact._id];
    }

    /**
     * Ações de um item
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  contactItem : dupla contact-item
     * @return [ui.action]
     */
    function itemActions (contactItem) {
        var actions = [];

        actions.push(new app.ui.action({
            legend : 'editar',
            image : 'pencil',
            click : function () {
                app.apps.open({
                    app : 'contatos',
                    route : '/editar-contato/'+contactItem.contact._id,
                    close : function (data) {
                        edit(contactItem, data);
                    }
                })
            }
        }));

        actions.push(new app.ui.action({
            legend : 'mover',
            image : 'move',
            click : function () {
                contactItem.item.drag();
            }
        }));

        actions.push(new app.ui.action({
            legend : 'excluir',
            image : 'trash',
            click : function () {
                app.apps.open({
                    app : 'contatos',
                    route : '/remover-contato/'+contactItem.contact._id,
                    close : function (data) {
                        if (data === true) {
                            remove(contactItem);
                        }
                    }
                })
            }
        }));

        return actions;
    }

    /**
     * Ícones de um item
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  contactItem : dupla contact-item
     * @return [ui.icon]
     */
    function itemIcons (contactItem) {
        var icons = [];

        if (contactItem.contact.email) {
            icons.push(new app.ui.icon({
                image : 'envelope',
                legend : contactItem.contact.email
            }))
        }

        if (contactItem.contact.phone) {
            icons.push(new app.ui.icon({
                image : 'phone',
                legend : contactItem.contact.phone
            }))
        }

        return icons;
    }

    /**
     * Cria uma dupla contact-item
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  contact : contato models.contact
     * @return {contact, item}
     */
    function contactItem (contact) {
        contactsItems[contact._id] = {
            item : new app.ui.item({
                title : contact.name,
                label : label(contact.category),
                description : contact.notes,
                drop : function (group, position) {
                    var newLabel = label(group.category);
                    contactsItems[contact._id].contact.priority = position;
                    contactsItems[contact._id].contact.category = group.category;
                    contactsItems[contact._id].item.label.color(newLabel.color);
                    contactsItems[contact._id].item.label.legend(newLabel.legend);
                    contactsItems[contact._id].contact.save();
                },
                droppableGroups : (function () {
                    var response = [];
                    for (var i in categoriesGroups) {
                        response.push(categoriesGroups[i].group);
                    }
                    return response;
                })(),
                click : function () {
                    app.apps.open({
                        app : 'contatos',
                        route : '/contato/' + contact._id,
                        data : {
                            remove : function (data) {
                                remove(contactsItems[contact._id]);
                            },
                            edit : function (data) {
                                edit(contactsItems[contact._id], data);
                            }
                        }
                    })
                }
            }),
            contact : contact
        }
        contactsItems[contact._id].item.actions.add(itemActions(contactsItems[contact._id]));
        contactsItems[contact._id].item.icons.add(itemIcons(contactsItems[contact._id]));

        return contactsItems[contact._id];
    }

    /**
     * Ações de um grupo
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  categoryGroup : dupla category-group
     * @return [ui.action]
     */
    function groupActions (categoryGroup) {
        var actions = [];

        actions.push(new app.ui.action({
            legend : 'adicionar contato',
            image : 'add',
            click : function () {
                app.apps.open({
                    app : 'contatos',
                    route : '/adicionar-contato',
                    data : {
                        category : categoryGroup.category._id
                    },
                    close : function (data) {
                        categoriesGroups[data.category].group.items.add(contactItem(data).item);
                        app.models.helpers.firstContact(contactsItems);
                        app.models.helpers.noFields(contactsItems);
                        app.models.helpers.fiveContacts(contactsItems);
                    }
                })
            }
        }));

        return actions;
    }

    /**
     * Cria label de uma fase de negociação
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  category_id : id da fase de negociação
     * @return {lagend, color}
     */
    function label (category_id) {
        var category;

        if (category_id) {
            category = categoriesGroups[category_id].category;
        } else {
            category = { name : 'sem categoria', color : 'black'}
        }
        return {legend : category.name, color : category.color}
    }

    /**
     * Constrói o formulário de filtragem
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     */
    function filter () {
        var
        /**
         * Campos do formulário
         */
        fields = {},
        /**
         * Fases de negociação
         */
        categoriesOptions = {
            clients : [],
            suppliers : [],
            partners : [],
            personals : []
        },
        /**
         * Fieldset
         */
        fieldset,
        /**
         * Função de filtrar
         */
        filterCategories;


        /**
         * Filtra os contatos
         *
         * @author Mauro Ribeiro
         * @since  2012-12
         */
        filterCategories = function () {
            var categoriesList,
                queryField = fields.query.value(),
                query,
                csv = 'data:application/octet-stream,';

            categoriesList = fields.categories.clients.value().concat(fields.categories.suppliers.value(),fields.categories.partners.value(),fields.categories.personals.value());
            for (var i in categoriesGroups) {
                if (categoriesList.indexOf(categoriesGroups[i].category._id) === -1) {
                    categoriesGroups[i].group.visibility('hide');
                } else {
                    categoriesGroups[i].group.visibility('show');
                }
            }

            if (fields.categories.clients.value().length) {
                typeGroups.clients.visibility('show');
            } else {
                typeGroups.clients.visibility('hide');
            }

            if (fields.categories.suppliers.value().length) {
                typeGroups.suppliers.visibility('show');
            } else {
                typeGroups.suppliers.visibility('hide');
            }

            if (fields.categories.partners.value().length) {
                typeGroups.partners.visibility('show');
            } else {
                typeGroups.partners.visibility('hide');
            }

            if (fields.categories.personals.value().length) {
                typeGroups.personals.visibility('show');
            } else {
                typeGroups.personals.visibility('hide');
            }

            for (var i in contactsItems) {
                query  = contactsItems[i].contact.name;
                query += ' ' + contactsItems[i].contact.email;
                query += ' ' + contactsItems[i].contact.phone;
                query += ' ' + contactsItems[i].contact.notes;

                for (var j in contactsItems[i].contact.fieldValues) {
                    query += ' ' + contactsItems[i].contact.fieldValues[j].value;
                }

                if (
                    (queryField.length > 1) &&
                    query.toLowerCase().indexOf(queryField.toLowerCase()) === -1
                ) {
                    contactsItems[i].item.visibility('hide');
                } else {
                    csv += contactsItems[i].contact.name + ' %2C' + contactsItems[i].contact.phone + ' %2C' + contactsItems[i].contact.email + '%0A'
                    contactsItems[i].item.visibility('show');
                }
            }
            app.ui.actions.get()[0].href(csv);
            if (firstFilter) {
                firstFilter = false;
            } else {
                app.models.helpers.fiveContactsAndFiltered(contactsItems);
            }
        }

        /* Input com as categorias */
        for (var i in categoriesGroups) {
            if (categoriesGroups.hasOwnProperty(i)) {
                categoriesOptions[categoriesGroups[i].category.type].push(new app.ui.inputOption({
                    legend : categoriesGroups[i].category.name,
                    value : categoriesGroups[i].category._id,
                    clicked : true,
                    label : label(categoriesGroups[i].category._id).color
                }));
            }
        }

        app.ui.filter.action('filtrar');

        /* busca */
        fields.query = new app.ui.inputText({
            legend : 'Buscar',
            type : 'text',
            name : 'query',
            change : function () {
                app.ui.filter.submit()
            }
        });

        /* fases de negociação */
        fields.categories = {};

        fields.categories.clients = new app.ui.inputSelector({
            type : 'multiple',
            name : 'category',
            legend : 'Clientes',
            options : categoriesOptions.clients,
            change : function () {
                app.ui.filter.submit()
            },
            actions : true
        });
        fields.categories.suppliers = new app.ui.inputSelector({
            type : 'multiple',
            name : 'category',
            legend : 'Fornecedores',
            options : categoriesOptions.suppliers,
            change : function () {
                app.ui.filter.submit()
            },
            actions : true
        });
        fields.categories.partners = new app.ui.inputSelector({
            type : 'multiple',
            name : 'category',
            legend : 'Parceiros',
            options : categoriesOptions.partners,
            change : function () {
                app.ui.filter.submit()
            },
            actions : true
        });
        fields.categories.personals = new app.ui.inputSelector({
            type : 'multiple',
            name : 'category',
            legend : 'Pessoais',
            options : categoriesOptions.personals,
            change : function () {
                app.ui.filter.submit()
            },
            actions : true
        });

        /* fieldset */
        fieldset = new app.ui.fieldset({
            legend : 'Filtrar contatos',
            fields : [fields.query, fields.categories.clients, fields.categories.suppliers, fields.categories.partners, fields.categories.personals]
        });

        app.ui.filter.fieldsets.add(fieldset);

        app.ui.filter.submit(filterCategories);
        filterCategories();
    }

    /**
     * Ações globais
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     */
    function globalActions () {
        app.ui.actions.add([
            new app.ui.action({
                legend : 'baixar dados',
                image : 'download'
            }),
            new app.ui.action({
                legend : 'adicionar contato',
                image : 'add',
                click : function () {
                    app.apps.open({
                        app : 'contatos',
                        route : '/adicionar-contato',
                        close : function (data) {
                            categoriesGroups[data.category].group.items.add(contactItem(data).item);
                            app.models.helpers.firstContact(contactsItems);
                            app.models.helpers.noFields(contactsItems);
                            app.models.helpers.fiveContacts(contactsItems);
                        }
                    })
                }
            })
        ]);
    }

    /**
     * Monta a view
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     */
    app.ui.title('Contatos');

    globalActions();

    typeGroups.clients = new app.ui.groupset({
        header : {
            title : 'Clientes'
        }
    });
    typeGroups.suppliers = new app.ui.groupset({
        header : {
            title : 'Fornecedores'
        }
    });
    typeGroups.partners = new app.ui.groupset({
        header : {
            title : 'Parceiros'
        }
    });
    typeGroups.personals = new app.ui.groupset({
        header : {
            title : 'Pessoais'
        }
    });
    typeGroups.noCategory = new app.ui.group({
        header : {
            title : 'Sem categoria'
        }
    });

    app.ui.groups.add(typeGroups.clients);
    app.ui.groups.add(typeGroups.suppliers);
    app.ui.groups.add(typeGroups.partners);
    app.ui.groups.add(typeGroups.personals);
    app.ui.groups.add(typeGroups.noCategory);

    app.models.category.list(function (categories) {

        for (var i in categories) {
            categoriesGroups[categories[i]._id] = {
                group : new app.ui.group({
                    header : {
                        title : categories[i].name
                    }
                }),
                category : categories[i]
            }
            categoriesGroups[categories[i]._id].group.header.actions.add(groupActions(categoriesGroups[categories[i]._id]));
            categoriesGroups[categories[i]._id].group.category = categories[i]._id;
            if (typeGroups.hasOwnProperty(categories[i].type)) {
                typeGroups[categories[i].type].groups.add(categoriesGroups[categories[i]._id].group);
            } else {

            }
        }

        app.models.contact.list({}, function (contacts) {
            if (contacts.length === 0) {
                app.ui.actions.get()[1].helper.description('Comece cadastrando seus principais clientes, parceiros e fornecedores e guarde suas informações principais');
                app.ui.actions.get()[1].helper.example('Dê preferência para aqueles com quem você precisará conversar em breve, seja para fazer uma venda ou pedir a nota fiscal.');
            }
            contacts.sort(function (a,b) {
                var priority_a = a.priority || 0,
                    priority_b = b.priority || 0;

                if (priority_a > priority_b) return  1;
                if (priority_a < priority_b) return -1;
                return 0
            });
            for (var i in contacts) {
                if (contacts[i].category) {
                    categoriesGroups[contacts[i].category].group.items.add(contactItem(contacts[i]).item);
                } else {
                    typeGroups.noCategory.items.add(contactItem(contacts[i]).item);
                }
            }
            if (typeGroups.noCategory.items.get().length === 0) {
                typeGroups.noCategory.visibility('hide');
            }
            filter();
            app.models.helpers.firstContact(contactsItems);
            app.models.helpers.noFields(contactsItems);
            app.models.helpers.fiveContacts(contactsItems);
        });

    });

});
