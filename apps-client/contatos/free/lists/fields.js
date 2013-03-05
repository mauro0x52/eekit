/**
 * Lista de campos configuráveis
 *
 * @author Rafael Erthal
 * @since 2013-01
 */
 app.routes.list('/campos-personalizados', function (params, data) {

    var
    /**
     * Classe que representa um item
     */
    Item,

    /**
     * Objeto com os grupos
     */
    groups;

    /* montando os grupos */
    groups = {
        group : new app.ui.group()
    };

    app.ui.groups.add([groups.group]);

    /**
     * Grupo que um campo se encaixa
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  field : field
     * @return ui.group
     */
    function fitGroup (field) {
        //Esse método só esta sendo criado caso no futuro mais grupos sejam adicionados a essa listagem devemos apenas adicionar as regras aqui
        return groups.group
    }

    /* montando os items */
    Item = function (data) {
        var that = this,
            field = new app.models.field(data),
            actions;

        this.item = new app.ui.item({
            drop : function (group, position) {
                field.changePosition(position);
            },
            droppableGroups : [groups.group],
        });

        /* Botões do item */
        actions = {
            edit         : new app.ui.action({
                legend : 'editar campo',
                image  : 'pencil',
                click  : function() {
                    app.apps.open({app : app.slug, route : '/editar-campo-personalizado/' + field._id});
                }
            }),
            drag         : new app.ui.action({
                legend : 'mover campo',
                image  : 'move',
                click  : that.item.drag
            }),
            remove       : new app.ui.action({
                legend : 'remover campo',
                image  : 'trash',
                click  : function() {
                    app.apps.open({app : app.slug, route : '/remover-campo-personalizado/' + field._id});
                }
            })
        };
        this.item.actions.add([actions.drag, actions.edit, actions.remove]);

        /* Exibe o titulo do campo */
        this.name = function (value) {
            this.item.title(value);
            this.item.label.legend(value);
            this.item.label.color('blue');
        };

        /* Pegando a edição do campo */
        app.events.bind('update field ' + field._id, function (data) {
            var oldGroup = fitGroup(field);

            field = new app.models.field(data);

            if (oldGroup !== fitGroup(field)) {
                that.item.detach();
                fitGroup(field).items.add(that.item);
            }

            if (field) {
                that.name(field.name);
            }
        });

        /* Pegando o drop do tarefa */
        app.events.bind('drop field ' + field._id, function (data) {
            field = new app.models.field(data);
        });

        /* Pegando a exclusão do campo */
        app.events.bind('remove field ' + field._id, this.item.detach);

        /* Pegando quando o filtro é acionado */
        app.events.bind('filter field', function (fields) {
            var queryField = fields.query.value();
            if (
                queryField.length > 1 && field.name.toLowerCase().indexOf(queryField.toLowerCase()) === -1
            ) {
                that.item.visibility('hide');
            } else {
                that.item.visibility('show');
            }
        });

        if (field) {
            this.name(field.name);
        }
    }

    /* autenticando usuário e pegando campos */
    app.models.field.list(function (userFields) {
        var fields = {}

        app.ui.title('Campos Personalizados');

        /* Botão global de adicionar campo */
        app.ui.actions.add(new app.ui.action({
            image : 'add',
            legend : 'adicionar campo personalizado',
            tip : 'adicionar campo personalizado',
            click : function () {
                app.apps.open({
                    app : app.slug,
                    route : '/adicionar-campo-personalizado'
                })
            }
        }));

        /* Monta o filtro */
        app.ui.filter.action('filtrar');
        /* filtro por texto */
        fields.query = new app.ui.inputText({
            legend : 'Buscar',
            type : 'text',
            name : 'query',
            change : app.ui.filter.submit
        });
        /* fieldset principal */
        app.ui.filter.fieldsets.add(new app.ui.fieldset({
            legend : 'Filtrar campos personalizados',
            fields : [fields.query]
        }));
        /* dispara o evento de filtro */
        app.ui.filter.submit(function () {
            app.events.trigger('filter field', fields);
        });

        /* ordenando os campos */
        userFields.sort(function (a,b) {
            var positionA = a.position || 1,
                positionB = b.position || 1;

            if (positionA > positionB) return  1;
            if (positionA < positionB) return -1;
            return 0
        });

        /* listando os campos */
        for (var i in userFields) {
            fitGroup(userFields[i]).items.add((new Item(userFields[i])).item);
        }

        /* Pegando campos que são cadastradas ao longo do uso do app */
        app.events.bind('create field', function (field) {
            fitGroup(field).items.add((new Item(field)).item);
        });
    });
 });