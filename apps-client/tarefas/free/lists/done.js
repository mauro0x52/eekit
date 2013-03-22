/**
 * Lista de tarefas feitas
 *
 * @author Rafael Erthal
 * @since  2013-01
 */
app.routes.list('/feitas', function (params, data) {

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
        yesterday: date(-1),
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
        lastWeek : date(0 - now.getDay() - 7),
        before   : date(0 - now.getDay() - 14)
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
        return new app.ui.group({
            header : {
                title   : title
            }
        });
    }

    /* montando os grupos */
    groups = {
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
        lastWeek   : group('Semana passada', dates.later),
        before     : group('Antes', null)
    };

    app.ui.groups.add([groups.today, groups.thisWeek.thisWeek, groups.lastWeek, groups.before]);
    /* Essa semana */

    if (now > dates.thisWeek.saturday)  groups.thisWeek.thisWeek.groups.add(groups.thisWeek.friday);
    if (now > dates.thisWeek.friday)    groups.thisWeek.thisWeek.groups.add(groups.thisWeek.thursday);
    if (now > dates.thisWeek.thursday)  groups.thisWeek.thisWeek.groups.add(groups.thisWeek.wednesday);
    if (now > dates.thisWeek.wednesday) groups.thisWeek.thisWeek.groups.add(groups.thisWeek.tuesday);
    if (now > dates.thisWeek.tuesday)   groups.thisWeek.thisWeek.groups.add(groups.thisWeek.monday);
    if (now > dates.thisWeek.monday)    groups.thisWeek.thisWeek.groups.add(groups.thisWeek.sunday);

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
        if (task.dateUpdated) {
            taskDate = new Date(task.dateUpdated);
            if (taskDate >= dates.today) {
                return groups.today;
            } else if (taskDate >= dates.thisWeek.saturday) {
                return groups.thisWeek.saturday;
            } else if (taskDate >= dates.thisWeek.friday) {
                return groups.thisWeek.friday;
            } else if (taskDate >= dates.thisWeek.thursday) {
                return groups.thisWeek.thursday;
            } else if (taskDate >= dates.thisWeek.wednesday) {
                return groups.thisWeek.wednesday;
            } else if (taskDate >= dates.thisWeek.tuesday) {
                return groups.thisWeek.tuesday;
            } else if (taskDate >= dates.thisWeek.monday) {
                return groups.thisWeek.monday;
            } else if (taskDate >= dates.thisWeek.sunday) {
                return groups.thisWeek.sunday;
            } else if (taskDate >= dates.lastWeek) {
                return groups.lastWeek;
            } else {
                return groups.before;
            }
        } else {
            return groups.before;
        }
    }

    /* montando os items */
    Item = function (data) {
        var that = this,
            task = new app.models.task(data),
            icons,
            actions;

        this.item = new app.ui.item({
            droppableGroups : [],
            click : function () {
                app.apps.open({app : app.slug, route : '/tarefa/' + task._id});
            }
        });

        /* Icones do item */
        icons = {
            important    : new app.ui.icon({image : 'alert', legend : 'importante'}),
            recurrence   : new app.ui.icon({image : 'back',  legend : '-'}),
            reminder     : new app.ui.icon({image : 'note',  legend : '-'}),
            dateUpdated  : new app.ui.icon({image : 'date',  legend : '-'})
        };

        /* Botões do item */
        actions = {
            remove       : new app.ui.action({
                tip : 'remover esta tarefa',
                image  : 'trash',
                click  : function() {
                    app.apps.open({app : app.slug, route : '/remover-tarefa/' + task._id});
                }
            })
        };
        this.item.actions.add([actions.remove]);

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
        this.dateUpdated = function (value) {
            var date = new Date(value),
                months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
                days = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

            if (value) {
                icons.dateUpdated.legend(days[date.getDay()]  + ', ' + date.getDate() + '/' + months[date.getMonth()] + '/' + date.getFullYear());
                this.item.icons.add(icons.dateUpdated);
            } else {
                icons.dateUpdated.legend('-');
                this.item.icons.remove(icons.dateUpdated);
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

        /* Pegando a exclusão da tarefa */
        app.events.bind('remove task ' + task._id, this.item.detach);

        /* Pegando quando o filtro é acionado */
        app.events.bind('filter task', function (fields) {
            var important = fields.important.value()[0] || fields.important.value()[0] === 'true';

            if (
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
            this.title(task.title);
            this.description(task.description);
            this.important(task.important);
            this.recurrence(task.recurrence);
            this.reminder(task.reminder);
            this.dateUpdated(task.dateUpdated);
            this.category(task.category);
        }
    };

    /* autenticando usuário e pegando categorias */
    app.models.category.list(function (data) {
        var fields = {};

        /* variável global com categorias */
        categories = data;

        app.ui.title('Tarefas feitas');
        app.tracker.event('visualizar tarefas feitas');

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
        /* filtro de categorias */
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
        /* fieldset principal */
        app.ui.filter.fieldsets.add(new app.ui.fieldset({
            legend : 'Filtrar tarefas',
            fields : [fields.query, fields.categories.general, fields.categories.meetings, fields.categories.finances, fields.categories.sales, fields.categories.projects, fields.categories.personals, fields.important]
        }));
        /* dispara o evento de filtro */
        app.ui.filter.submit(function () {
            app.events.trigger('filter task', fields);
        });

        /* montando a listagem */
        app.models.task.list({filterByDone : true}, function (tasks) {

            /* ordenando as tarefas */
            tasks.sort(function (a,b) {
                var a_priority = a.dateUpdated || new Date();
                var b_priority = b.dateUpdated || new Date();

                if (a_priority < b_priority)  return -1;
                if (a_priority > b_priority)  return  1;
                return 0;
            });

            /* listando as tarefas */
            for (i in tasks) {
                fitGroup(tasks[i]).items.add((new Item(tasks[i])).item);
            }
        });
    });

});