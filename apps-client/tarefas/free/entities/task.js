/**
 * Informações de uma tarefa
 *
 * @author Rafael Erthal
 * @since  2013-01
 *
 * @param  params.id : id da tarefa
 */
app.routes.entity('/tarefa/:id', function (params, data) {

    var
    /**
     * Lista de categorias
     */
    categories,

    /*
     * Classe que representa os campos do usuário
     */
    Entity;

    Entity = function (data) {
        var that = this,
            task = new app.models.task(data),
            actions,
            fields,
            fieldsets;

        /* Conjuntos de campos */
        fieldsets = {
            details : new app.ui.dataset({legend : 'Detalhes'}),
            dates   : new app.ui.dataset({legend : 'Datas'})
        };
        app.ui.datasets.add([fieldsets.details, fieldsets.dates]);

        /* Campos de dados */
        fields = {
            dateDeadline : new app.ui.data({legend : 'prazo'}),
            recurrence   : new app.ui.data({legend : 'recorrência'}),
            important    : new app.ui.data({legend : 'importante'}),
            category     : new app.ui.data({legend : 'categoria'}),
            reminder     : new app.ui.data({legend : 'lembrar-me por email'})
        };

        /* Botões do item */
        actions = {
            done         : new app.ui.action({
                legend : 'marcar como feita',
                tip : 'marcar esta tarefa como feita',
                image  : 'check',
                click  : function () {
                    task.markAsDone();
                }
            }),
            edit         : new app.ui.action({
                legend : 'editar',
                tip : 'editar dados desta tarefa',
                image  : 'pencil',
                click  : function() {
                    app.apps.open({app : app.slug, route : '/editar-tarefa/' + task._id});
                }
            }),
            remove       : new app.ui.action({
                legend : 'remover',
                tip : 'apagar esta tarefa',
                image  : 'trash',
                click  : function() {
                    app.apps.open({app : app.slug, route : '/remover-tarefa/' + task._id});
                }
            })
        };
        if (!task.done) {
            app.ui.actions.add([actions.done, actions.edit]);
        }
        app.ui.actions.add(actions.remove);

        /* Exibe o titulo da tarefa */
        this.title = function (value) {
            app.ui.title('Tarefa: ' + value);
            app.ui.subtitle(value);
        }

        /* Exibe a descrição da tarefa */
        this.description = function (value) {
            app.ui.description(value);
        }

        /* Exibe o prazo da tarefa */
        this.dateDeadline = function (value) {
            var date = new Date(value),
                daysNames = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
                monthsNames = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

            fields.dateDeadline.values.remove();
            fieldsets.dates.fields.add(fields.dateDeadline);
            if (value) {
                fields.dateDeadline.values.add(new app.ui.value({
                    value : daysNames[date.getDay()]  + ', ' + date.getDate() + ' de ' + monthsNames[date.getMonth()] + ' de ' + date.getFullYear()
                }));
            } else {
                fields.dateDeadline.values.add(new app.ui.value({value : 'sem prazo'}));
            }
        };

        /* Exibe a recorrência da tarefa */
        this.recurrence = function (value) {
            fields.recurrence.values.remove();
            if (value) {
                switch (value*1) {
                    case 0  :
                        fields.recurrence.values.add(new app.ui.value({value : 'sem recorrência'}));
                        break;
                    case 1  :
                        fields.recurrence.values.add(new app.ui.value({value : 'diariamente'}));
                        break;
                    case 5  :
                        fields.recurrence.values.add(new app.ui.value({value : 'dias úteis'}));
                        break;
                    case 7  :
                        fields.recurrence.values.add(new app.ui.value({value : 'semanalmente'}));
                        break;
                    case 14 :
                        fields.recurrence.values.add(new app.ui.value({value : 'quinzenalmente'}));
                        break;
                    case 30 :
                        fields.recurrence.values.add(new app.ui.value({value : 'mensalmente'}));
                        break;
                    default :
                        fields.recurrence.values.add(new app.ui.value({value : 'a cada ' + value + ' dias'}))
                }
                fieldsets.dates.fields.add(fields.recurrence);
            } else {
                fieldsets.dates.fields.remove(fields.recurrence);
            }
        };

        /* Exibe a importância da tarefa */
        this.important = function (value) {
            fields.important.values.remove();
            fieldsets.details.fields.add(fields.important);
            if (value) {
                fields.important.values.add(new app.ui.value({value : 'sim'}));
            } else {
                fields.important.values.add(new app.ui.value({value : 'não'}));
            }
        };

        /* Exibe a categoria da tarefa */
        this.category = function (value) {
            var i;

            fields.category.values.remove();
            if (value) {
                for (i in categories) {
                    if (value.toString() === categories[i]._id.toString()) {
                        fields.category.values.add(new app.ui.value({value : categories[i].name}));
                        fieldsets.details.fields.add(fields.category);
                    }
                }
            } else {
                fieldsets.details.fields.remove(fields.category);
            }
        };

        /* Exibe o lembrete da tarefa */
        this.reminder = function (value) {
            fields.reminder.values.remove();
            if (value === 0 || value) {
                if (value.toString() == '0') {
                    fields.reminder.values.add(new app.ui.value({value : 'no dia'}));
                } else if (value.toString() == '1') {
                    fields.reminder.values.add(new app.ui.value({value : '1 dia antes'}));
                } else if (value.toString() == '2') {
                    fields.reminder.values.add(new app.ui.value({value : '2 dias antes'}));
                } else if (value.toString() == '7') {
                    fields.reminder.values.add(new app.ui.value({value : '1 semana antes'}));
                }
                fieldsets.details.fields.add(fields.reminder);
            } else {
                fieldsets.details.fields.remove(fields.reminder);
            }
        };

        /* Pegando a edição da tarefa */
        app.events.bind('update task ' + task._id, function (data) {
            task = new app.models.task(data);

            if (task) {
                that.title(task.title + (task.subtitle ? ' (' + task.subtitle + ')' : ''));
                that.description(task.description);
                that.important(task.important);
                that.recurrence(task.recurrence);
                that.reminder(task.reminder);
                that.dateDeadline(task.dateDeadline);
                that.category(task.category);
            }
        });

        /* Pegando o drop da tarefa */
        app.events.bind('drop task ' + task._id, function (data) {
            task = new app.models.task(data);

            if (task) {
                that.dateDeadline(task.dateDeadline);
            }
        });

        /* Pegando a exclusão da tarefa */
        app.events.bind('remove task ' + task._id, app.close);

        /* Pegando a marcação como feita da tarefa */
        app.events.bind('do task ' + task._id, app.close);

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

    /**
     * Monta a view
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     */
    app.models.category.list(function (data) {
        categories = data;
        app.models.task.find(params.id, function (task) {
            new Entity(task);

            if (task.embeddeds) {
                var appa = task.embeddeds[0].split('/')[1],
                    route = task.embeddeds[0].replace('/' + appa, '');

                app.apps.open({
                    app : appa,
                    route : route,
                    open : function (tool) {
                        app.ui.embbeds.add(tool);
                    }
                })
            }
        });
    });
});