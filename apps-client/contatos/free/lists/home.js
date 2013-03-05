/**
 * Lista de contatos
 *
 * @author Mauro Ribeiro
 * @since  2012-12
 */
app.routes.list('/', function (params, data) {

    var
    /**
     * Classe que representa um item
     */
    Item,

    /**
     * Classe que representa um grupo
     */
    Group,

    /*
     * Objeto com os grupos de grupos
     */
    groupsets,

    /*
     * Vetor com as categorias do usuário
     */
    categories;

    /* montando os gruposets */
    groupsets = {
        clients   : new app.ui.groupset({header : {title : 'Clientes'}}),
        suppliers : new app.ui.groupset({header : {title : 'Fornecedores'}}),
        partners  : new app.ui.groupset({header : {title : 'Parceiros'}}),
        personals : new app.ui.groupset({header : {title : 'Pessoais'}})
    };
    app.ui.groups.add([groupsets.clients, groupsets.suppliers, groupsets.partners, groupsets.personals])

    /**
     * Grupo que uma categoria se encaixa
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  category : category
     * @return ui.groupset
     */
    function fitGroupset (group) {
        switch (group.type) {
            case 'clients' :
                return groupsets.clients;
                break;
            case 'suppliers' :
                return groupsets.suppliers;
                break;
            case 'partners' :
                return groupsets.partners;
                break;
            case 'personals' :
                return groupsets.personals;
                break;
            default :
                return groupsets.personals;
        }
    }

    /* montando os grupos */
    Group = function (data) {
        var that = this,
            category = new app.models.category(data),
            actions;

        this.group = new app.ui.group();
        this.group.category = category._id;

        /* Botões do grupo */
        actions = {
            add : new app.ui.action({
                legend : 'adicionar contato',
                image : 'add',
                click : function () {
                    app.apps.open({
                        app   : app.slug,
                        route : '/adicionar-contato',
                        data  : {category : category._id}
                    });
                }
            })
        };
        this.group.header.actions.add([actions.add]);

        /* Exibe o nome da categoria */
        this.name = function (value) {
            this.group.header.title(value);
        };

        /* Pegando a edição da categoria */
        app.events.bind('update category ' + category._id, function (data) {
            var oldGroup = fitGroup(category);

            category = new app.models.category(data);

            if (oldGroup !== fitGroup(category)) {
                that.item.detach();
                fitGroup(category).groups.add(that.group);
            }

            if (category) {
                that.name(category.name);
            }
        });

        /* Pegando a exclusão da categoria */
        app.events.bind('remove category ' + category._id, this.group.detach);

        /* Pegando quando o filtro é acionado */
        app.events.bind('filter contact', function (fields) {
            var query = fields.categories.clients.value().concat(
                fields.categories.suppliers.value(),
                fields.categories.partners.value(),
                fields.categories.personals.value()
            );

            if (
                query.indexOf(category._id) === -1
            ) {
                that.group.visibility('hide');
            } else {
                that.group.visibility('show');
            }
        });

        if (category) {
            this.name(category.name);
        }
    }

    /**
     * Grupo que um contato se encaixa
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  contact : contact
     * @return ui.group
     */
    function fitGroup (contact) {
        var i,
            groups;

        groups = groupsets.clients.groups.get();
        for (i in groups) {
            if (groups[i].category === contact.category) {
                return groups[i];
            }
        }

        groups = groupsets.suppliers.groups.get();
        for (i in groups) {
            if (groups[i].category === contact.category) {
                return groups[i];
            }
        }

        groups = groupsets.partners.groups.get();
        for (i in groups) {
            if (groups[i].category === contact.category) {
                return groups[i];
            }
        }

        groups = groupsets.personals.groups.get();
        for (i in groups) {
            if (groups[i].category === contact.category) {
                return groups[i];
            }
        }
    }

    /* montando os items */
    Item = function (data) {
        var that = this,
            contact = new app.models.contact(data),
            icons,
            actions;

        /* Monta a lista de grupos para drop */
        function droppableGroups() {
            var i,
                groups
                res = [];

            groups = groupsets.clients.groups.get();
            for (i in groups) {
                res.push(groups[i]);
            }

            groups = groupsets.suppliers.groups.get();
            for (i in groups) {
                res.push(groups[i]);
            }

            groups = groupsets.partners.groups.get();
            for (i in groups) {
                res.push(groups[i]);
            }

            groups = groupsets.personals.groups.get();
            for (i in groups) {
                res.push(groups[i]);
            }
            return res;
        }

        this.item = new app.ui.item({
            drop : function (group, position) {
                contact.changeCategory(group.category, position);
            },
            click : function () {
                app.apps.open({app : app.slug, route : '/contato/' + contact._id})
            },
            droppableGroups : droppableGroups(),
        });

        /* Icones do item */
        icons = {
            email : new app.ui.icon({image : 'envelope'}),
            phone : new app.ui.icon({image : 'phone'})
        };

        /* Botões do item */
        actions = {
            edit         : new app.ui.action({
                legend : 'editar contato',
                image  : 'pencil',
                click  : function() {
                    app.apps.open({app : app.slug, route : '/editar-contato/' + contact._id});
                }
            }),
            drag         : new app.ui.action({
                legend : 'mover contato',
                image  : 'move',
                click  : that.item.drag
            }),
            remove       : new app.ui.action({
                legend : 'remover contato',
                image  : 'trash',
                click  : function() {
                    app.apps.open({app : app.slug, route : '/remover-contato/' + contact._id});
                }
            })
        };
        this.item.actions.add([actions.drag, actions.edit, actions.remove]);

        /* Exibe o nome do contato */
        this.name = function (value) {
            this.item.title(value);
        };

        /* Exibe as notas do contato */
        this.notes = function (value) {
            this.item.description(value);
        };

        this.category = function (value) {
            var i;

            for (i in categories) {
                if (categories[i]._id === value) {
                    this.item.label.legend(categories[i].name);
                    this.item.label.color(categories[i].color);
                }
            }
        }

        /* Exibe o email do contato */
        this.email = function (value) {
            if (value) {
                this.item.icons.add(icons.email);
                icons.email.legend(value);
            } else {
                this.item.icons.remove(icons.email);
                icons.email.legend('-');
            }
        };

        /* Exibe o telefone do contato */
        this.phone = function (value) {
            if (value) {
                this.item.icons.add(icons.phone);
                icons.phone.legend(value);
            } else {
                this.item.icons.remove(icons.phone);
                icons.phone.legend('-');
            }
        };

        /* Pegando a edição do contato */
        app.events.bind('update contact ' + contact._id, function (data) {
            var oldGroup = fitGroup(contact);

            contact = new app.models.contact(data);

            if (oldGroup !== fitGroup(contact)) {
                that.item.detach();
                fitGroup(contact).items.add(that.item);
            }

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
        app.events.bind('remove contact ' + contact._id, this.item.detach);

        /* Pegando quando o filtro é acionado */
        app.events.bind('filter contact', function (fields) {
            var query,
                queryField = fields.query.value();

            query  = contact.name;
            query += ' ' + contact.email;
            query += ' ' + contact.phone;
            query += ' ' + contact.notes;

            if (
                (queryField.length > 1) &&
                query.toLowerCase().indexOf(queryField.toLowerCase()) === -1
            ) {
                that.item.visibility('hide');
            } else {
                that.item.visibility('show');
                app.ui.actions.get()[0].href(
                    app.ui.actions.get()[0].href() +
                    contact.name  + ' %2C' +
                    contact.phone + ' %2C' +
                    contact.email + '%0A'
                );
            }
        });

        if (contact) {
            this.name(contact.name);
            this.notes(contact.notes);
            this.category(contact.category);
            this.email(contact.email);
            this.phone(contact.phone);
        }
    }

    /* autenticando usuário e pegando categorias */
    app.models.category.list(function (data) {
        /* monta a listagem */
        app.models.contact.list({}, function (contacts) {
            var fields = {},
                firstFilter = true;

            /* variável global com categorias */
            categories = data;

            app.ui.title('Contatos');

            /* Botão global de baixar dados */
            app.ui.actions.add(new app.ui.action({
                legend : 'baixar dados',
                tip : 'importar seus dados em um arquivo CSV',
                image : 'download'
            }));
            /* Botão global de adicionar campo */
            app.ui.actions.add(new app.ui.action({
                legend : 'contato',
                tip : 'adicionar contato',
                image  : 'add',
                click  : function () {
                    app.apps.open({
                        app : app.slug,
                        route : '/adicionar-contato'
                    });
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
            function categoryOption(type) {
                var options = [],
                    i;

                for (i in categories) {
                    if (categories[i].type === type) {
                        options.push(new app.ui.inputOption({
                            legend  : categories[i].name,
                            value   : categories[i]._id,
                            clicked : true,
                            label   : categories[i].color
                        }));
                    }
                }
                return options;
            }
            /* filtro por categoria */
            fields.categories = {
                clients : new app.ui.inputSelector({
                    type    : 'multiple',
                    name    : 'category',
                    legend  : 'Clientes',
                    options : categoryOption('clients'),
                    change  : function () {
                        app.ui.filter.submit()
                    },
                    actions : true
                }),
                suppliers : new app.ui.inputSelector({
                    type    : 'multiple',
                    name    : 'category',
                    legend  : 'Fornecedores',
                    options : categoryOption('suppliers'),
                    change  : function () {
                        app.ui.filter.submit()
                    },
                    actions : true
                }),
                partners : new app.ui.inputSelector({
                    type    : 'multiple',
                    name    : 'category',
                    legend  : 'Parceiros',
                    options : categoryOption('partners'),
                    change  : function () {
                        app.ui.filter.submit()
                    },
                    actions : true
                }),
                personals : new app.ui.inputSelector({
                    type    : 'multiple',
                    name    : 'category',
                    legend  : 'Pessoais',
                    options : categoryOption('personals'),
                    change  : function () {
                        app.ui.filter.submit()
                    },
                    actions : true
                })
            };
            /* fieldset principal */
            app.ui.filter.fieldsets.add(new app.ui.fieldset({
                legend : 'Filtrar contatos',
                fields : [fields.query, fields.categories.clients, fields.categories.suppliers, fields.categories.partners, fields.categories.personals]
            }));
            /* dispara o evento de filtro */
            app.ui.filter.submit(function () {
                app.ui.actions.get()[0].href('data:application/octet-stream,');

                if (firstFilter) {
                    firstFilter = false;
                } else {
                    app.models.helpers.fiveContactsAndFiltered(contacts);
                }

                app.events.trigger('filter contact', fields);
            });

            /* ordenando os contatos */
            contacts.sort(function (a,b) {
                var priority_a = a.priority || 0,
                    priority_b = b.priority || 0;

                if (priority_a > priority_b) return  1;
                if (priority_a < priority_b) return -1;
                return 0
            });

            /* listando as categorias */
            for (var i in categories) {
                fitGroupset(categories[i]).groups.add((new Group(categories[i])).group);
            }

            /* listando os contatos */
            for (var i in contacts) {
                fitGroup(contacts[i]).items.add((new Item(contacts[i])).item);
            }

            /* Pegando categorias cadastradas ao longo do uso do app */
            app.events.bind('create category', function (category) {
                fitGroupset(category).groups.add((new Group(category)).group);
            });

            /* Pegando campos que são cadastradas ao longo do uso do app */
            app.events.bind('create contact', function (contact) {
                fitGroup(contact).items.add((new Item(contact)).item);
            });

            /* exibe o orientador */
            if (contacts.length === 0) {
                app.ui.actions.get()[1].helper.description('Comece cadastrando seus principais clientes, parceiros e fornecedores e guarde suas informações principais');
                app.ui.actions.get()[1].helper.example('Dê preferência para aqueles com quem você precisará conversar em breve, seja para fazer uma venda ou pedir a nota fiscal.');
            }
            app.models.helpers.firstContact(contacts);
            app.models.helpers.noFields(contacts);
            app.models.helpers.fiveContacts(contacts);
            app.ui.filter.submit();
        });
    });
});
