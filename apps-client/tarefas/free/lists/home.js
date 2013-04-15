/**
 * Lista de tarefas pendentes
 *
 * @author Rafael Erthal
 * @since  2013-01
 */
app.routes.list('/', function (params, data) {

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
     * Objeto com as datas
     */
    dates,

    /*
     * dia de hoje
     */
    now = new Date();

    /**
     * Monta data
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  inc : incremento a partir de hoje
     * @return Date
     */
    function date (inc) {
        return new Date(now.getFullYear(), now.getMonth(), now.getDate() + inc);
    }

    /* objeto das datas para criação dos grupos */
    dates = {
        today    : date(0),
        tomorrow : date(1),
        thisWeek : {
            sunday    : date(0 - now.getDay()),
            monday    : date(1 - now.getDay()),
            tuesday   : date(2 - now.getDay()),
            wednesday : date(3 - now.getDay()),
            thursday  : date(4 - now.getDay()),
            friday    : date(5 - now.getDay()),
            saturday  : date(6 - now.getDay())
        },
        nextWeek : {
            sunday    : date(7 - now.getDay()),
            monday    : date(8 - now.getDay()),
            tuesday   : date(9 - now.getDay()),
            wednesday : date(10 - now.getDay()),
            thursday  : date(11 - now.getDay()),
            friday    : date(12 - now.getDay()),
            saturday  : date(13 - now.getDay())
        },
        later    : date(14 - now.getDay()),
    };

    /**
     * Monta grupo
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  title : titulo do grupo
     * @param  date : data do grupo
     * @return ui.group
     */
    function group (title, date) {
        var group = new app.ui.group({
            header : {
                title   : title,
                actions : new app.ui.action({
                    tip : 'adicionar tarefa neste dia',
                    image : 'add',
                    click : function () {
                        app.apps.open({
                            app : app.slug,
                            route : '/adicionar-tarefa',
                            data : {date : date}
                        })
                    }
                })
            }
        });
        group.date = date;

        return group
    }

    /* montando os grupos */
    groups = {
        pending    : new app.ui.group({header : {title   : 'Pendente'}}),
        today      : group('Hoje', dates.today),
        thisWeek   : {
            thisWeek  : new app.ui.groupset({header : {title : 'Esta semana'}}),
            sunday    : group('domingo', dates.thisWeek.sunday),
            monday    : group('segunda', dates.thisWeek.monday),
            tuesday   : group('terça'  , dates.thisWeek.tuesday),
            wednesday : group('quarta' , dates.thisWeek.wednesday),
            thursday  : group('quinta' , dates.thisWeek.thursday),
            friday    : group('sexta'  , dates.thisWeek.friday),
            saturday  : group('sabado' , dates.thisWeek.saturday)
        },
        nextWeek   : {
            nextWeek  : new app.ui.groupset({header : {title : 'Próxima semana'}}),
            sunday    : group('domingo', dates.nextWeek.sunday),
            monday    : group('segunda', dates.nextWeek.monday),
            tuesday   : group('terça'  , dates.nextWeek.tuesday),
            wednesday : group('quarta' , dates.nextWeek.wednesday),
            thursday  : group('quinta' , dates.nextWeek.thursday),
            friday    : group('sexta'  , dates.nextWeek.friday),
            saturday  : group('sabado' , dates.nextWeek.saturday)
        },
        later      : group('Depois', dates.later),
        noDeadline : group('Sem prazo', null)
    };

    app.ui.groups.add([groups.pending, groups.today, groups.thisWeek.thisWeek, groups.nextWeek.nextWeek, groups.later, groups.noDeadline]);
    /* Essa semana */
    if (now < dates.thisWeek.monday)    groups.thisWeek.thisWeek.groups.add(groups.thisWeek.monday);
    if (now < dates.thisWeek.tuesday)   groups.thisWeek.thisWeek.groups.add(groups.thisWeek.tuesday);
    if (now < dates.thisWeek.wednesday) groups.thisWeek.thisWeek.groups.add(groups.thisWeek.wednesday);
    if (now < dates.thisWeek.thursday)  groups.thisWeek.thisWeek.groups.add(groups.thisWeek.thursday);
    if (now < dates.thisWeek.friday)    groups.thisWeek.thisWeek.groups.add(groups.thisWeek.friday);
    if (now < dates.thisWeek.saturday)  groups.thisWeek.thisWeek.groups.add(groups.thisWeek.saturday);
    /* Semana que vem */
    groups.nextWeek.nextWeek.groups.add([
        groups.nextWeek.sunday,
        groups.nextWeek.monday,
        groups.nextWeek.tuesday,
        groups.nextWeek.wednesday,
        groups.nextWeek.thursday,
        groups.nextWeek.friday,
        groups.nextWeek.saturday,
    ]);

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
        var taskDate;
        if (task.dateDeadline) {
            taskDate = new Date(task.dateDeadline);
            if (taskDate < dates.today) {
                return groups.pending;
            } else if (taskDate < dates.tomorrow) { /*Essa semana*/
                return groups.today;
            } else if (taskDate < dates.thisWeek.monday) {
                return groups.thisWeek.sunday;
            } else if (taskDate < dates.thisWeek.tuesday) {
                return groups.thisWeek.monday;
            } else if (taskDate < dates.thisWeek.wednesday) {
                return groups.thisWeek.tuesday;
            } else if (taskDate < dates.thisWeek.thursday) {
                return groups.thisWeek.wednesday;
            } else if (taskDate < dates.thisWeek.friday) {
                return groups.thisWeek.thursday;
            } else if (taskDate < dates.thisWeek.saturday) {
                return groups.thisWeek.friday;
            } else if (taskDate < dates.nextWeek.sunday) {
                return groups.thisWeek.saturday;
            } else if (taskDate < dates.nextWeek.monday) { /*Próxima semana*/
                return groups.nextWeek.sunday;
            } else if (taskDate < dates.nextWeek.tuesday) {
                return groups.nextWeek.monday;
            } else if (taskDate < dates.nextWeek.wednesday) {
                return groups.nextWeek.tuesday;
            } else if (taskDate < dates.nextWeek.thursday) {
                return groups.nextWeek.wednesday;
            } else if (taskDate < dates.nextWeek.friday) {
                return groups.nextWeek.thursday;
            } else if (taskDate < dates.nextWeek.saturday) {
                return groups.nextWeek.friday;
            } else if (taskDate < groups.later.date) {
                return groups.nextWeek.saturday;
            } else {
                return groups.later;
            }
        } else {
            return groups.noDeadline;
        }
    }

    /* montando os items */
    Item = function (data) {
        var that = this,
            task = new app.models.task(data),
            icons,
            actions;

        this.item = new app.ui.item({
            droppableGroups : [
                groups.today,
                groups.thisWeek.sunday,
                groups.thisWeek.monday,
                groups.thisWeek.tuesday,
                groups.thisWeek.wednesday,
                groups.thisWeek.thursday,
                groups.thisWeek.friday,
                groups.thisWeek.saturday,
                groups.nextWeek.sunday,
                groups.nextWeek.monday,
                groups.nextWeek.tuesday,
                groups.nextWeek.wednesday,
                groups.nextWeek.thursday,
                groups.nextWeek.friday,
                groups.nextWeek.saturday,
                groups.noDeadline
            ],
            drop : function (group, order) {
                task.changePriority(order, group.date);
            },
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
            drag         : new app.ui.action({
                tip : 'mover esta tarefa',
                image  : 'move',
                click  : that.item.drag
            }),
            remove       : new app.ui.action({
                tip : 'remover esta tarefa',
                image  : 'trash',
                click  : function() {
                    app.apps.open({app : app.slug, route : '/remover-tarefa/' + task._id});
                }
            })
        };
        this.item.actions.add([actions.done, actions.edit, actions.remove]);

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
            if (value === 0 || value) {
                if (value.toString() == '0') {
                    icons.reminder.legend('lembrar no dia');
                } else if (value.toString() == '1') {
                    icons.reminder.legend('lembrar 1 dia antes');
                } else if (value.toString() == '2') {
                    icons.reminder.legend('lembrar 2 dias antes');
                } else if (value.toString() == '7') {
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

            /* Verifica se deve exibir o botão de drag */
            if (fitGroup(task) !== groups.later) {
                this.item.actions.add(actions.drag);
            } else {
                this.item.actions.remove(actions.drag);
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
            var oldGroup = fitGroup(task);

            task = new app.models.task(data);

            if (oldGroup !== fitGroup(task)) {
                that.item.detach();
                fitGroup(task).items.add(that.item);
            }

            if (task) {
                that.title(task.title + (task.subtitle ? ' (' + task.subtitle + ')' : ''));
                that.description(task.description);
                that.important(task.important);
                that.recurrence(task.recurrence);
                that.reminder(task.reminder);
                that.dateDeadline(task.dateDeadline);
                that.category(task.category);
            }
            app.ui.filter.submit();
        });

        /* Pegando o drop da tarefa */
        app.events.bind('drop task ' + task._id, function (data) {
            task = new app.models.task(data);

            if (task) {
                that.dateDeadline(task.dateDeadline);
            }
        });

        /* Pegando a exclusão da tarefa */
        app.events.bind('remove task ' + task._id, this.item.detach);

        /* Pegando a marcação como feita da tarefa */
        app.events.bind('do task ' + task._id, this.item.detach);

        /* Pegando quando o filtro é acionado */
        app.events.bind('filter task', function (fields) {
            var important = fields.important.value()[0] || fields.important.value()[0] === 'true',
                users = fields.user.value();

            if (
                (
                    task.user &&
                    users.indexOf(task.user) == -1
                ) ||
                (
                    fields.categories.general.value().indexOf(that.item.label.legend()) === -1 &&
                    fields.categories.meetings.value().indexOf(that.item.label.legend()) === -1 &&
                    fields.categories.finances.value().indexOf(that.item.label.legend()) === -1 &&
                    fields.categories.sales.value().indexOf(that.item.label.legend()) === -1 &&
                    fields.categories.projects.value().indexOf(that.item.label.legend()) === -1 &&
                    fields.categories.personals.value().indexOf(that.item.label.legend()) === -1
                ) ||
                (!(icons.important.legend().replace('-', ' ').toLowerCase() === 'importante') && important) ||
                (fields.query.value().length > 1 && (that.item.title() + ' ' + that.item.description()).toLowerCase().indexOf(fields.query.value().toLowerCase()) === -1)
            ) {
                that.item.visibility('hide');
            } else {
                that.item.visibility('show');
            }
        });

        /* Montando o item */
        if (task) {
            this.title(task.title + (task.subtitle ? ' (' + task.subtitle + ')' : ''));
            this.description(task.description);
            this.important(task.important);
            this.recurrence(task.recurrence);
            this.reminder(task.reminder);
            this.dateDeadline(task.dateDeadline);
            this.category(task.category);
        }
    };

    /* autenticando usuário e pegando categorias */
    app.models.category.list(function (data) {
        var fields = {};

        /* variável global com categorias */
        categories = data;

        app.ui.title('Tarefas pendentes');
        app.tracker.event('visualizar tarefas pendentes');

        /* Botão global de adicionar tarefa */
        app.ui.actions.add(new app.ui.action({
            legend : 'adicionar tarefa',
            tip : 'adicionar nova tarefa',
            image : 'add',
            click : function () {
                app.apps.open({
                    app : app.slug,
                    route : '/adicionar-tarefa',
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
        /* filtro de categorias */
        function categoryOption(type) {
            var options = [],
                i;

            for (i in categories) {
                if (categories[i].type === type || (!categories[i].type && type === 'general')) {
                    options.push(new app.ui.inputOption({
                        legend  : categories[i].name,
                        value   : categories[i].name,
                        clicked : true,
                        label   : categories[i].color || 'blue'
                    }));
                }
            }
            return options;
        }
        /* filtro por categoria */
        fields.categories = {
            general : new app.ui.inputSelector({
                type    : 'multiple',
                name    : 'category',
                legend  : 'Geral',
                options : categoryOption('general'),
                change  : function () {
                    app.ui.filter.submit()
                },
                actions : true
            }),
            meetings : new app.ui.inputSelector({
                type    : 'multiple',
                name    : 'category',
                legend  : 'Reuniões',
                options : categoryOption('meetings'),
                change  : function () {
                    app.ui.filter.submit()
                },
                actions : true
            }),
            finances : new app.ui.inputSelector({
                type    : 'multiple',
                name    : 'category',
                legend  : 'Finanças',
                options : categoryOption('finances'),
                change  : function () {
                    app.ui.filter.submit()
                },
                actions : true
            }),
            sales : new app.ui.inputSelector({
                type    : 'multiple',
                name    : 'category',
                legend  : 'Vendas',
                options : categoryOption('sales'),
                change  : function () {
                    app.ui.filter.submit()
                },
                actions : true
            }),
            projects : new app.ui.inputSelector({
                type    : 'multiple',
                name    : 'category',
                legend  : 'Projetos',
                options : categoryOption('projects'),
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
        /* filtro de tarefas importantes */
        fields.important = new app.ui.inputSelector({
            name : 'important',
            type : 'multiple',
            options : [new app.ui.inputOption({legend : 'Importante', name : 'important', value : 'true', image : 'alert'})],
            change : app.ui.filter.submit
        });
        /* filtro de usuário responsável */
        fields.user = new app.ui.inputSelector({
            name : 'user',
            type : 'multiple',
            legend  : 'Responsável',
            options : (function () {
                var result = [];
                for (var i in app.config.users) {
                    result.push(new app.ui.inputOption({
                        legend  : app.config.users[i].name,
                        value   : app.config.users[i]._id,
                        clicked : app.config.user._id === app.config.users[i]._id
                    }));
                }
                return result;
            })(),
            change : app.ui.filter.submit,
            actions : true
        });
        /* fieldset principal */
        app.ui.filter.fieldsets.add(new app.ui.fieldset({
            legend : 'Filtrar tarefas',
            fields : [fields.query, fields.user, fields.categories.general, fields.categories.meetings, fields.categories.finances, fields.categories.sales, fields.categories.projects, fields.categories.personals, fields.important]
        }));
        /* dispara o evento de filtro */
        app.ui.filter.submit(function () {
            console.log(fields.user.value())
            app.events.trigger('filter task', fields);
        });

        /* exibe o orientador */
        app.models.task.list({}, function (tasks) {
            if (tasks.length === 0) {
                app.ui.actions.get()[0].helper.description('Adicione sua primeira tarefa');
                app.ui.actions.get()[0].helper.example('Ex: Reunião de planejamento');
            }
        });

        /* montando a listagem */
        app.models.task.list({filterByDone : false}, function (tasks) {

            /* ordenando as tarefas */
            tasks.sort(function (a,b) {
                var a_priority = a.priority || 1;
                var b_priority = b.priority || 1;

                if (a_priority < b_priority)  return -1;
                if (a_priority > b_priority)  return  1;
                return 0;
            });

            /* listando as tarefas */
            for (i in tasks) {
                fitGroup(tasks[i]).items.add((new Item(tasks[i])).item);
            }

            /* Pegando tarefas que são cadastradas ao longo do uso do app */
            app.events.bind('create task', function (task) {
                fitGroup(task).items.add((new Item(task)).item);
                app.ui.filter.submit();
            });

            app.ui.filter.submit();
        });
    });

});