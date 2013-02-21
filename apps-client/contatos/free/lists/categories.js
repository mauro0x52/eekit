/**
 * Lista de categorias
 *
 * @author Mauro Ribeiro
 * @since 2013-02
 */
 app.routes.list('/categorias', function (params, data) {

    var
    /**
     * Classe que representa um item
     */
    Item,

    /**
     * Objeto com os grupos
     */
    groups;

    /**
     * Monta grupo
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  title : titulo do grupo
     * @param  type : tipo do grupo
     * @return ui.group
     */
    function group (title, type) {
        return new app.ui.group({
            header : {
                title   : title,
                actions : new app.ui.action({
                    image : 'add',
                    legend : 'adicionar categoria',
                    click : function () {
                        app.apps.open({
                            app : 'contatos',
                            route : '/adicionar-categoria',
                            data : {type : type}
                        })
                    }
                })
            }
        });
    }

    /* montando os grupos */
    groups = {
        clients   : group('Clientes', 'clients'),
        suppliers : group('Fornecedores', 'suppliers'),
        partners  : group('Parceiros', 'partners'),
        personals : group('Pessoais', 'personals')
    };
    
    app.ui.groups.add([groups.clients, groups.suppliers, groups.partners, groups.personals]);

    /**
     * Grupo que uma categoria se encaixa
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  category : category
     * @return ui.group
     */
    function fitGroup (category) {
        switch (category.type) {
            case 'clients' : 
                return groups.clients;
                break;
            case 'suppliers' : 
                return groups.suppliers;
                break;
            case 'partners' : 
                return groups.partners;
                break;
            case 'personals' : 
                return groups.personals;
                break;
            default : 
                return groups.personals;
        }
    }

    /* montando os items */
    Item = function (data) {
        var that = this,
            category = new app.models.category(data),
            actions;

        this.item = new app.ui.item();

        /* Botões do item */
        actions = {
            edit         : new app.ui.action({
                legend : 'editar categoria',
                image  : 'pencil',
                click  : function() {
                    app.apps.open({app : app.slug, route : '/editar-categoria/' + category._id});
                }
            }),
            remove       : new app.ui.action({
                legend : 'remover categoria',
                image  : 'trash',
                click  : function() {
                    app.apps.open({app : app.slug, route : '/remover-categoria/' + category._id});
                }
            })
        };
        this.item.actions.add([actions.edit, actions.remove]);

        /* Exibe o titulo da categoria */
        this.name = function (value) {
            this.item.title(value);
            this.item.label.legend(value);
        };

        /* Exibe a cor da categoria */
        this.color = function (value) {
            this.item.label.color(value);
        };

        /* Pegando a edição da categoria */
        app.events.bind('update category ' + category._id, function (data) {
            var oldGroup = fitGroup(category);

            category = new app.models.category(data);

            if (oldGroup !== fitGroup(category)) {
                that.item.detach();
                fitGroup(category).items.add(that.item);
            }

            if (category) {
                that.name(category.name);
                that.color(category.color);
            }
        });

        /* Pegando a exclusão da categoria */
        app.events.bind('remove category ' + category._id, this.item.detach);

        /* Pegando quando o filtro é acionado */
        app.events.bind('filter category', function (fields) {
            var queryField = fields.query.value();
            if (
                queryField.length > 1 && category.name.toLowerCase().indexOf(queryField.toLowerCase()) === -1
            ) {
                that.item.visibility('hide');
            } else {
                that.item.visibility('show');
            }
        });

        if (category) {
            this.name(category.name);
            this.color(category.color);
        }
    }

    /* autenticando usuário e pegando categorias */
    app.models.category.list(function (categories) {
        var fields = {}
        
        app.ui.title('Categorias');

        /* Botão global de adicionar categoria */
        app.ui.actions.add(new app.ui.action({
            image : 'add',
            legend : 'adicionar categoria',
            click : function () {
                app.apps.open({
                    app : 'contatos',
                    route : '/adicionar-categoria',
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
            legend : 'Filtrar categorias',
            fields : [fields.query]
        }));
        /* dispara o evento de filtro */
        app.ui.filter.submit(function () {
            app.events.trigger('filter category', fields);
        });

        /* listando os campos */
        for (var i in categories) {
            fitGroup(categories[i]).items.add((new Item(categories[i])).item);
        }

        /* Pegando categorias que são cadastradas ao longo do uso do app */
        app.events.bind('create category', function (category) {
            fitGroup(category).items.add((new Item(category)).item);
        });
    });
 });