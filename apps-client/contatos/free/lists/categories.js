/**
 * Lista de categorias
 *
 * @author Mauro Ribeiro
 * @since 2013-02
 */
 app.routes.list('/categorias', function (params, data) {

    var
    /**
     * Lista das duplas category-item
     */
    categoriesItems = {},
    /**
     * Grupo principal
     */
    group = new app.ui.group(),
    /**
     * Lista dos grupos de tipo
     */
    typeGroups = {};

    /**
     * Lista das ações de um item
     *
     * @author Mauro Ribeiro
     * @since  2013-02
     *
     * @param  categoryItem
     * @return lista de ações [ui.action]
     */
    function itemActions (categoryItemData) {
        var actions = [];

        actions.push(new app.ui.action({
            legend : 'editar',
            image : 'pencil',
            click : function () {
                app.apps.dialog({
                    app : 'contatos',
                    route : '/editar-categoria/' + categoryItemData.category._id,
                    close : function (data) {
                        if (categoryItemData.category.type === data.type) {
                            categoryItemData.category.name = data.name;
                            categoryItemData.category.color = data.color;
                            categoryItemData.category.color = data.color;
                            categoryItemData.item.title(data.name);
                            categoryItemData.item.label.color(data.color);
                            categoryItemData.item.label.legend(data.name);
                        } else {
                            categoryItemData.item.detach();
                            delete categoryItemData[categoryItemData.category._id];
                            typeGroups[data.type].items.add(categoryItem(data).item);
                        }
                    }
                })
            }
        }));

        actions.push(new app.ui.action({
            legend : 'remover',
            image : 'trash',
            click : function () {
                app.apps.dialog({
                    app : 'contatos',
                    route : '/remover-categoria/'+categoryItemData.category._id,
                    close : function (data) {
                        if (data === true) {
                            categoryItemData.item.detach();
                            delete categoryItemData[categoryItemData.category._id];
                        }
                    }
                });
            }
        }));

        return actions;
    }


    /**
     * Cria uma dupla category-item
     *
     * @author Mauro Ribeiro
     * @since  2013-02
     *
     * @param  category models.category
     * @return dupla field-item
     */
    function categoryItem (category) {
        categoriesItems[category._id] = {
            item : new app.ui.item({
                title : category.name,
                label : {
                    legend : category.name,
                    color : category.color
                }
            }),
            category : category
        }

        categoriesItems[category._id].item.actions.add(itemActions(categoriesItems[category._id]));
        return categoriesItems[category._id];
    }

    /**
     * Constrói o filtro
     *
     * @author Mauro Ribeiro
     * @since  2013-02
     */
    function filter () {
        var fields = {}, fieldset;

        app.ui.filter.action('filtrar');

        /**
         * Filtra os campos
         *
         * @author Mauro Ribeiro
         * @since  2013-01
         */
        filterCategories = function () {
            var queryField = fields.query.value();
            for (var i in categoriesItems) {
                if (queryField.length > 1 && categoriesItems[i].category.name.toLowerCase().indexOf(queryField.toLowerCase()) === -1) {
                    categoriesItems[i].item.visibility('hide');
                } else {
                    categoriesItems[i].item.visibility('show');
                }
            }
        }

        fields.query = new app.ui.inputText({
            legend : 'Buscar',
            type : 'text',
            name : 'query',
            change : filterCategories
        });

        fieldset = new app.ui.fieldset({
            legend : 'Filtrar categorias',
            fields : [fields.query]
        });

        app.ui.filter.fieldsets.add(fieldset);

        app.ui.filter.submit(filterCategories);
    }

    app.ui.title('Categorias');

    app.ui.actions.add(new app.ui.action({
        image : 'add',
        legend : 'adicionar categoria',
        click : function () {
            app.apps.dialog({
                app : 'contatos',
                route : '/adicionar-categoria',
                close : function (category) {
                    if (category) {
                        typeGroups[category.type].items.add(categoryItem(category).item);
                    }
                }
            })
        }
    }));


    typeGroups.clients = new app.ui.group({
        header : {
            title : 'Clientes'
        }
    });
    typeGroups.clients.header.actions.add(new app.ui.action({
        legend : 'adicionar categoria',
        image : 'add',
        click : function () {
            app.apps.dialog({
                app : 'contatos',
                route : '/adicionar-categoria',
                data : {
                    type : 'clients'
                },
                close : function(data) {
                    typeGroups[data.type].items.add(categoryItem(data).item);
                }
            })
        }
    }));
    typeGroups.suppliers = new app.ui.group({
        header : {
            title : 'Fornecedores'
        }
    });
    typeGroups.suppliers.header.actions.add(new app.ui.action({
        legend : 'adicionar categoria',
        image : 'add',
        click : function () {
            app.apps.dialog({
                app : 'contatos',
                route : '/adicionar-categoria',
                data : {
                    type : 'suppliers'
                },
                close : function(data) {
                    typeGroups[data.type].items.add(categoryItem(data).item);
                }
            })
        }
    }));
    typeGroups.partners = new app.ui.group({
        header : {
            title : 'Parceiros'
        }
    });
    typeGroups.partners.header.actions.add(new app.ui.action({
        legend : 'adicionar categoria',
        image : 'add',
        click : function () {
            app.apps.dialog({
                app : 'contatos',
                route : '/adicionar-categoria',
                data : {
                    type : 'partners'
                },
                close : function(data) {
                    typeGroups[data.type].items.add(categoryItem(data).item);
                }
            })
        }
    }));
    typeGroups.personals = new app.ui.group({
        header : {
            title : 'Pessoais'
        }
    });
    typeGroups.personals.header.actions.add(new app.ui.action({
        legend : 'adicionar categoria',
        image : 'add',
        click : function () {
            app.apps.dialog({
                app : 'contatos',
                route : '/adicionar-categoria',
                data : {
                    type : 'personals'
                },
                close : function(data) {
                    typeGroups[data.type].items.add(categoryItem(data).item);
                }
            })
        }
    }));

    app.ui.groups.add(typeGroups.clients);
    app.ui.groups.add(typeGroups.suppliers);
    app.ui.groups.add(typeGroups.partners);
    app.ui.groups.add(typeGroups.personals);
    app.ui.groups.add(typeGroups.noCategory);

    app.models.category.list(function (categories) {
        for (var i in categories) {
            typeGroups[categories[i].type].items.add(categoryItem(categories[i]).item);
        }
        filter();
    });
 });