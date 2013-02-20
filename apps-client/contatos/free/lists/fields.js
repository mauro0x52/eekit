/**
 * Lista de campos configuráveis
 *
 * @author Rafael Erthal
 * @since 2013-01
 */
 app.routes.list('/campos-personalizados', function (params, data) {

    var
    /**
     * Lista das duplas campo-item
     */
    fieldsItems = {},

    /**
     * Grupo principal
     */
    group = new app.ui.group();;

    /**
     * Lista das ações de um item
     *
     * @author Rafael Erthal
     * @since  2013-01
     *
     * @param  fieldItem
     * @return lista de ações [ui.action]
     */
    function itemActions (fieldItem) {
        var actions = [];

        actions.push(new app.ui.action({
            legend : 'editar',
            image : 'pencil',
            click : function () {
                app.apps.open({
                    app : 'contatos',
                    route : '/editar-campo-personalizado/' + fieldItem.field._id,
                    close : function (data) {
                        fieldsItems[data._id].field.name = data.name;
                        fieldsItems[data._id].item.title(data.name);
                        fieldsItems[data._id].item.label.legend(data.name);
                        fieldsItems[data._id].item.label.color('blue');
                    }
                })
            }
        }));

        actions.push(new app.ui.action({
            legend : 'mover',
            image : 'move',
            click : function () {
                fieldItem.item.drag();
            }
        }));

        actions.push(new app.ui.action({
            legend : 'remover',
            image : 'trash',
            click : function () {
                app.apps.open({
                    app : 'contatos',
                    route : '/remover-campo-personalizado/'+fieldItem.field._id,
                    close : function (data) {
                        if (data === true) {
                            fieldItem.item.detach();
                            delete fieldsItems[fieldItem.field._id];
                        }
                    }
                });
            }
        }));

        return actions;
    }

    /**
     * Cria uma dupla field-item
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  field models.field
     * @return dupla field-item
     */
    function fieldItem (field) {
        fieldsItems[field._id] = {
            item : new app.ui.item({
                title : field.name,
                drop : function (group, position) {
                    field.position = position;
                    field.save();
                },
                droppableGroups : [group],
                label : {
                    legend : field.name,
                    color : 'blue'
                }
            }),
            field : field
        }

        fieldsItems[field._id].item.actions.add(itemActions(fieldsItems[field._id]));
        return fieldsItems[field._id];
    }

    /**
     * Constrói o filtro
     *
     * @author Rafael Erthal
     * @since  2013-01
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
        filterFields = function () {
            var queryField = fields.query.value();
            for (var i in fieldsItems) {
                if (queryField.length > 1 && fieldsItems[i].field.name.toLowerCase().indexOf(queryField.toLowerCase()) === -1) {
                    fieldsItems[i].item.visibility('hide');
                } else {
                    fieldsItems[i].item.visibility('show');
                }
            }
        }

        fields.query = new app.ui.inputText({
            legend : 'Buscar',
            type : 'text',
            name : 'query',
            change : filterFields
        });

        fieldset = new app.ui.fieldset({
            legend : 'Filtrar campos personalizados',
            fields : [fields.query]
        });

        app.ui.filter.fieldsets.add(fieldset);

        app.ui.filter.submit(filterFields);
    }

    app.ui.title('Campos Personalizados');

    app.ui.actions.add(new app.ui.action({
        image : 'add',
        legend : 'adicionar campo personalizado',
        click : function () {
            app.apps.open({
                app : 'contatos',
                route : '/adicionar-campo-personalizado',
                close : function (field) {
                    if (field) {
                        group.items.add(fieldItem(field).item);
                    }
                }
            })
        }
    }));

    app.models.field.list(function (fields) {
        fields.sort(function (a,b) {
            var positionA = a.position || 1,
                positionB = b.position || 1;

            if (positionA > positionB) return  1;
            if (positionA < positionB) return -1;
            return 0
        });
        for (var i in fields) {
            group.items.add(fieldItem(fields[i]).item);
        }
        app.ui.groups.add(group);
        filter();
    });
 });