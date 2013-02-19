/**
 * Lista das categorias
 *
 * @author Mauro Ribeiro
 * @since 2012-12
 */
app.routes.list('/categorias', function (params, data) {

    app.tracker.event('visualizar categorias');

    var
    /**
     * Lista das duplas category-item
     */
    categoriesItems = {},

    /**
     * Grupo de credito
     */
    creditGroup,

    /**
     * Grupo de debito
     */
    debtGroup;

    /**
     * Lista das ações de um item
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  categoryItem
     * @return lista de ações [ui.action]
     */
    function itemActions (categoryItem) {
        var actions = [];

        actions.push(new app.ui.action({
            image : 'pencil',
            legend : 'editar',
            click : function () {
                app.apps.dialog({
                    app : 'financas',
                    route : '/editar-categoria/' + categoryItem.category._id,
                    close : function (data) {
                        categoriesItems[data._id].category.name = data.name;
                        categoriesItems[data._id].item.title(data.name);
                        categoriesItems[data._id].item.label.legend(data.name);
                        categoriesItems[data._id].item.label.color('blue');
                    }
                })
            }
        }));

        actions.push(new app.ui.action({
            legend : 'remover',
            image : 'trash',
            click : function () {
                app.apps.dialog({
                    app : 'financas',
                    route : '/remover-categoria/' + categoryItem.category._id,
                    close : function (data) {
                        if (data) {
                            categoryItem.item.detach();
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
     * @since  2012-12
     *
     * @param  category models.category
     * @return dupla category-item
     */
    function categoryItem (category) {
        categoriesItems[category._id] = {
            item : new app.ui.item({
                title : category.name,
                label : {
                    legend : category.name,
                    color : 'blue'
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
     * @since  2012-12
     */
    function filter () {
        var fields = {}, fieldset, filterCategories;

        app.ui.filter.action('filtrar');


        /**
         * Filtra as categorias
         *
         * @author Mauro Ribeiro
         * @since  2012-12
         */
        filterCategories = function () {
            var queryField = fields.query.value();
            console.log(fields.type.value())

            if (fields.type.value().indexOf('credit') !== -1) {
                creditGroup.visibility('show');
            } else {
                creditGroup.visibility('hide');
            }

            if (fields.type.value().indexOf('debt') !== -1) {
                debtGroup.visibility('show');
            } else {
                debtGroup.visibility('hide');
            }

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

        fields.type = new app.ui.inputSelector({
            legend : 'Tipo',
            type : 'multiple',
            name : 'type',
            options : [
                new app.ui.inputOption({legend : 'receita', value : 'credit', clicked : true}),
                new app.ui.inputOption({legend : 'despesa', value : 'debt', clicked : true})
            ],
            change : filterCategories
        });


        fieldset = new app.ui.fieldset({
            legend : 'Filtrar categorias',
            fields : [fields.query, fields.type]
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
                app : 'financas',
                route : '/adicionar-categoria',
                close : function (category) {
                    if (category) {
                        if (category.type === 'credit') {
                            creditGroup.items.add(categoryItem(category).item);
                        } else {
                            debtGroup.items.add(categoryItem(category).item);
                        }
                    }
                }
            })
        }
    }));

    app.models.category.list(function (categories) {
        categories.sort(function (a,b) {
            var priority_a = a.name || 0,
                priority_b = b.name || 0;

            if (priority_a > priority_b) return  1;
            if (priority_a < priority_b) return -1;
            return 0
        });

        creditGroup = new app.ui.group({
            header : {
                title : 'Categorias de receitas',
                actions : [
                    new app.ui.action({
                        image : 'add',
                        legend : 'adicionar categoria',
                        click : function () {
                            app.apps.dialog({
                                app : 'financas',
                                route : '/adicionar-categoria',
                                data : {
                                    type : 'credit'
                                },
                                close : function (category) {
                                    if (category) {
                                        if (category.type === 'credit') {
                                            creditGroup.items.add(categoryItem(category).item);
                                        } else {
                                            debtGroup.items.add(categoryItem(category).item);
                                        }
                                    }
                                }
                            })
                        }
                    })
                ]
            }
        });

        debtGroup = new app.ui.group({
            header : {
                title : 'Categorias de despesas',
                actions : [
                    new app.ui.action({
                        image : 'add',
                        legend : 'adicionar categoria',
                        click : function () {
                            app.apps.dialog({
                                app : 'financas',
                                route : '/adicionar-categoria',
                                data : {
                                    type : 'debt'
                                },
                                close : function (category) {
                                    if (category) {
                                        if (category.type === 'credit') {
                                            creditGroup.items.add(categoryItem(category).item);
                                        } else {
                                            debtGroup.items.add(categoryItem(category).item);
                                        }
                                    }
                                }
                            })
                        }
                    })
                ]
            }
        });

        for (var i in categories) {
            if (categories[i].type === 'credit') {
                creditGroup.items.add(categoryItem(categories[i]).item);
            } else {
                debtGroup.items.add(categoryItem(categories[i]).item);
            }
        }
        app.ui.groups.add([creditGroup, debtGroup]);
        filter();
        app.models.helpers.defaultCategoriesB(categories);
    });

});
