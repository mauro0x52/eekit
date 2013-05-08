/**
 * Lista de tarefas relacionadas
 *
 * @author Rafael Erthal
 * @since  2013-01
 * data : {embeddeds : [], insert : {title, category}}
 */
app.routes.embedList('/relacionadas', function (params, data) {

    var
    /*
     * Classe que representa um item
     */
    Item,

    /*
     * Objeto com os grupos
     */
    groups,

    /*
     * Vetor com as categorias do usuário
     */
    categories,

    /*
     * Identificador do embbed
     */
    response = data,

    /*
     * dia de hoje
     */
    now = new Date();

    /* montando os grupos */
    groups = {
        pending : new app.ui.group({
            header : {
                title   : 'Tarefas pendentes',
                actions : new app.ui.action({
                    legend : 'adicionar tarefa',
                    legend : 'adicionar nova tarefa',
                    image : 'add',
                    click : function () {
                        app.apps.open({
                            app   : app.slug,
                            route : '/adicionar-tarefa',
                            data  : {
                                embeddeds : response.embed,
                                title     : response.insert.title,
                                category  : response.insert.category
                            }
                        })
                    }
                })
            }
        }),
        done    : new app.ui.group({header : {title   : 'Tarefas feitas'}}),
    };

    app.ui.groups.add([groups.pending, groups.done]);

    /**
     * Grupo que uma tarefa se encaixa
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  task : task
     * @return ui.group
     */
    function fitGroup (task) {
        if (task.done) {
            return groups.done
        } else {
            return groups.pending;
        }
    }

    /* montando os items */
    Item = function (data) {
        var that = this,
            task = new app.models.task(data),
            icons,
            actions;

        this.item = new app.ui.item({
            click : function () {
                app.apps.open({app : app.slug, route : '/tarefa/' + task._id});
            }
        });

        /* Icones do item */
        icons = {
            important    : new app.ui.icon({image : 'alert', legend : 'importante'}),
            recurrence   : new app.ui.icon({image : 'back',  legend : '-'}),
            reminder     : new app.ui.icon({image : 'note',  legend : '-'}),
            dateDeadline : new app.ui.icon({image : 'date',  legend : '-'})
        };

        /* Botões do item */
        actions = {
            done         : new app.ui.action({
                tip : 'marcar esta tarefa como feita',
                image  : 'check',
                click  : function () {
                    task.markAsDone();
                }
            }),
            edit         : new app.ui.action({
                tip : 'editar esta tarefa',
                image  : 'pencil',
                click  : function() {
                    app.apps.open({app : app.slug, route : '/editar-tarefa/' + task._id});
                }
            }),
            remove       : new app.ui.action({
                tip : 'remover esta tarefa',
                image  : 'trash',
                click  : function() {
                    app.apps.open({app : app.slug, route : '/remover-tarefa/' + task._id});
                }
            })
        };
        if (!task.done) {
            this.item.actions.add([actions.done, actions.edit]);
        }
        this.item.actions.add(actions.remove);

        /* Exibe o titulo da tarefa */
        this.title = function (value) {
            this.item.title(value);
        };

        /* Exibe a descrição da tarefa */
        this.description = function (value) {
            this.item.description(value);
        };

        /* Exibe a importância da tarefa */
        this.important = function (value) {
            if (value) {
                this.item.icons.add(icons.important);
                icons.important.legend('importante');
            } else {
                this.item.icons.remove(icons.important);
                icons.important.legend('-');
            }
        };

        /* Exibe a recorrência da tarefa */
        this.recurrence = function (value) {
            if (value) {
                if (value == 1) {
                    icons.recurrence.legend('diariamente');
                } else if (value == 5) {
                    icons.recurrence.legend('dias úteis');
                } else if (value == 7) {
                    icons.recurrence.legend('semanalmente');
                } else if (value == 14) {
                    icons.recurrence.legend('quinzenalmente');
                } else if (value == 30) {
                    icons.recurrence.legend('mensalmente');
                }
                this.item.icons.add(icons.recurrence);
            } else {
                icons.recurrence.legend('-');
                this.item.icons.remove(icons.recurrence);
            }
        };

        /* Exibe o lembrete da tarefa */
        this.reminder = function (value) {
            if (value) {
                if (value == 0) {
                    icons.reminder.legend('lembrar no dia');
                } else if (value == 1) {
                    icons.reminder.legend('lembrar 1 dia antes');
                } else if (value == 2) {
                    icons.reminder.legend('lembrar 2 dias antes');
                } else if (value == 7) {
                    icons.reminder.legend('lembrar 1 semana antes');
                }
                this.item.icons.add(icons.reminder);
            } else {
                icons.reminder.legend('-');
                this.item.icons.remove(icons.reminder);
            }
        };

        /* Exibe o prazo da tarefa */
        this.dateDeadline = function (value) {
            var date = new Date(value),
                months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
                days = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

            if (value) {
                icons.dateDeadline.legend(days[date.getDay()]  + ', ' + date.getDate() + '/' + months[date.getMonth()] + '/' + date.getFullYear());
                this.item.icons.add(icons.dateDeadline);
            } else {
                icons.dateDeadline.legend('-');
                this.item.icons.remove(icons.dateDeadline);
            }
        };

        /* Exibe a categoria da tarefa */
        this.category = function (value) {
            var i;

            /* Busca categoria */
            for (i in categories) {
                if (categories[i]._id === value) {
                    this.item.label.legend(categories[i].name);
                    this.item.label.color(categories[i].color || 'blue');
                }
            }
        }

        /* Pegando a edição da tarefa */
        app.events.bind('update task ' + task._id, function (data) {
            task = new app.models.task(data);

            that.item.detach();
            fitGroup(task).items.add(that.item);

            if (task) {
                that.title(task.title + (task.subtitle ? ' (' + task.subtitle + ')' : ''));
                that.description(task.description);
                that.important(task.important);
                that.recurrence(task.recurrence);
                that.reminder(task.reminder);
                if (task.done) {
                    that.dateDeadline(task.dateUpdated);
                } else {
                    that.dateDeadline(task.dateDeadline);
                }
                that.category(task.category);
            }
        });

        /* Pegando o drop da tarefa */
        app.events.bind('drop task ' + task._id, function (data) {
            task = new app.models.task(data);

            if (task) {
                if (task.done) {
                    that.dateDeadline(task.dateUpdated);
                } else {
                    that.dateDeadline(task.dateDeadline);
                }
            }
        });

        /* Pegando a exclusão da tarefa */
        app.events.bind('remove task ' + task._id, this.item.detach);

        /* Pegando a marcação como feita da tarefa */
        app.events.bind('do task ' + task._id, function (data) {
            task = new app.models.task(data);

            that.item.detach();
            fitGroup(task).items.add(that.item);

            /* Exibe o dateUpdate */
            if (task) {
                if (task.done) {
                    that.dateDeadline(task.dateUpdated);
                } else {
                    that.dateDeadline(task.dateDeadline);
                }
            }
            /* Exibe os botões */
            that.item.actions.remove();
            that.item.actions.add(actions.remove);
        });

        /* Montando o item */
        if (task) {
            this.title(task.title + (task.subtitle ? ' (' + task.subtitle + ')' : ''));
            this.description(task.description);
            this.important(task.important);
            this.recurrence(task.recurrence);
            this.reminder(task.reminder);
            if (task.done) {
                this.dateDeadline(task.dateUpdated);
            } else {
                this.dateDeadline(task.dateDeadline);
            }
            this.category(task.category);
        }
    };

    /* autenticando usuário e pegando categorias */
    app.models.category.list(function (data) {

        /* variável global com categorias */
        categories = data;

        app.ui.title('Tarefas relacionadas');

        /* montando a listagem */
        app.models.task.list({ filterByEmbeddeds : response.embed }, function (tasks) {

            /* ordenando as tarefas */
            tasks.sort(function (a,b) {
                var a_priority = a.priority || 1;
                var b_priority = b.priority || 1;

                if (a_priority < b_priority) return -1;
                if (a_priority > b_priority) return  1;
                return 0;
            });

            /* listando as tarefas */
            for (i in tasks) {
                fitGroup(tasks[i]).items.add((new Item(tasks[i])).item);
            }

            /* Pegando tarefas que são cadastradas ao longo do uso do app */
            app.events.bind('create task', function (task) {
                groups.pending.items.add((new Item(task)).item);
            });
        });
    });

});