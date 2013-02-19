/**
 * Lista de tarefas pendentes
 *
 * @author Mauro Ribeiro
 * @since  2012-12
 */
app.routes.list('/', function (params, data) {

    app.tracker.event('visualizar tarefas pendentes');

    var
    /**
     * Índice usado em loops
     */
    i,

    /**
     * Grupos ui.group relativos aos dias desta semana
     */
    thisWeekDaysGroups = [],

    /**
     * Grupos ui.group relativos aos dias da proxima semana
     */
    nextWeekDaysGroups = [],

    /**
     * Grupos ui.group
     */
    groups = {},

    /**
     * Lista de datas
     */
    dates = {},

    /**
     * Agora
     */
    now,

    /**
     * Lista de duplas {task : models.task, item ui.item}
     */
    tasksItems = {},

    /**
     * Nome dos dias
     */
    dayNames = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],

    /**
     * Lista de categorias
     */
    categories;

    /**
     * Atualiza as informações de uma dupla task-item após edição
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  taskItem : dupla task-item
     * @param  data : models.task recém atualizada
     */
    function edit (taskItem, data) {
        var newLabel = label(data.category);
        if (taskItem.task.dateDeadline === data.dateDeadline) {
            taskItem.item.title(data.title);
            taskItem.item.description(data.description);
            taskItem.item.icons.remove();
            taskItem.item.icons.add(icons(data));
            taskItem.item.label.color(newLabel.color);
            taskItem.item.label.legend(newLabel.legend);
            taskItem.task.title = data.title;
            taskItem.task.description = data.description;
        } else {
            fitGroup(taskItem).items.remove(taskItem.item);
            delete taskItem;
            item(data);
        }
    }

    /**
     * Atualiza as informações de uma dupla task-item após exclusão
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  taskItem : dupla task-item
     */
    function remove (taskItem) {
        fitGroup(taskItem).items.remove(taskItem.item);
        delete taskItem;
    }

    /**
     * Grupo que uma tarefa se encaixa
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  taskItem : dupla task-item
     * @return ui.group
     */
    function fitGroup (taskItem) {
        var taskDate;
        if (taskItem.task.dateDeadline) {
            taskDate = new Date(taskItem.task.dateDeadline);
            if (taskDate < dates.today) {
                groups.pending.visibility('show');
                return groups.pending;
            } else if (taskDate < dates.tomorrow) { /*Essa semana*/
                return groups.today;
            } else if (taskDate < dates.thisWeek[1]) {
                return thisWeekDaysGroups[0];
            } else if (taskDate < dates.thisWeek[2]) {
                return thisWeekDaysGroups[1];
            } else if (taskDate < dates.thisWeek[3]) {
                return thisWeekDaysGroups[2];
            } else if (taskDate < dates.thisWeek[4]) {
                return thisWeekDaysGroups[3];
            } else if (taskDate < dates.thisWeek[5]) {
                return thisWeekDaysGroups[4];
            } else if (taskDate < dates.thisWeek[6]) {
                return thisWeekDaysGroups[5];
            } else if (taskDate < dates.nextWeek[0]) {
                return thisWeekDaysGroups[6];
            } else if (taskDate < dates.nextWeek[1]) { /*Essa semana*/
                return nextWeekDaysGroups[0];
            } else if (taskDate < dates.nextWeek[2]) {
                return nextWeekDaysGroups[1];
            } else if (taskDate < dates.nextWeek[3]) {
                return nextWeekDaysGroups[2];
            } else if (taskDate < dates.nextWeek[4]) {
                return nextWeekDaysGroups[3];
            } else if (taskDate < dates.nextWeek[5]) {
                return nextWeekDaysGroups[4];
            } else if (taskDate < dates.nextWeek[6]) {
                return nextWeekDaysGroups[5];
            } else if (taskDate < groups.later.date) {
                return nextWeekDaysGroups[6];
            } else {
                return groups.later;
            }
        } else {
            return groups.noDeadline;
        }
    }

    /**
     * Cor de uma categoria
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  name : nome da categoria
     * @return nome da cor
     */
    function categoryColor (name) {
        var color;
        switch (name) {
            case 'Geral' : color = 'blue'; break;
            case 'Reuniões' : color = 'brown'; break;
            case 'Finanças' : color = 'green'; break;
            case 'Vendas' : color = 'olive'; break;
            case 'Projetos' : color = 'cyan'; break;
        }
        return color;
    }

    /**
     * Ícones de uma tarefa
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  task : tarefa models.task
     * @return [ui.icon]
     */
    function icons (task) {
        var icons = [], date,
            months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
            days = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

        /* Exibir icone de calendario */
        if (task.dateDeadline || task.done) {
            date = task.done ? new Date(task.dateUpdated) : new Date(task.dateDeadline);
            icons.push(new app.ui.icon({image : 'date', legend : days[date.getDay()]  + ', ' + date.getDate() + '/' + months[date.getMonth()] + '/' + date.getFullYear()}));
        }
        /* Exibir icone de importante */
        if (task.important && task.important == true) {
            icons.push(new app.ui.icon({image : 'alert', legend : 'importante'}));
        }
        /* Exibir icone de recorrente */
        if (task.recurrence && task.recurrence > 0) {
            if (task.recurrence == 1) {
                icons.push(new app.ui.icon({image : 'back', legend : 'diariamente'}));
            } else if (task.recurrence == 7) {
                icons.push(new app.ui.icon({image : 'back', legend : 'semanalmente'}));
            } else if (task.recurrence == 14) {
                icons.push(new app.ui.icon({image : 'back', legend : 'quinzenalmente'}));
            } else if (task.recurrence == 30) {
                icons.push(new app.ui.icon({image : 'back', legend : 'mensalmente'}));
            }
        }
        /* Exibir icone de lembrete */
        if (task.reminder !== null) {
            if (task.reminder == 0) {
                icons.push(new app.ui.icon({image : 'note', legend : 'lembrar-me por e-mail no dia'}));
            } else if (task.reminder == 1) {
                icons.push(new app.ui.icon({image : 'note', legend : 'lembrar-me por e-mail 1 dia antes'}));
            } else if (task.reminder == 2) {
                icons.push(new app.ui.icon({image : 'note', legend : 'lembrar-me por e-mail 2 dias antes'}));
            } else if (task.reminder == 7) {
                icons.push(new app.ui.icon({image : 'note', legend : 'lembrar-me por e-mail 1 semana antes'}));
            }
        }

        return icons
    }

    /**
     * Ações de uma tarefa
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  taskItem : dupla task-item
     * @return [ui.action]
     */
    function actions (taskItem) {
        var actions = [], i;

        /* Botão de marcar como feita */
        actions.push(new app.ui.action({
            label : 'marcar tarefa como feita',
            image : 'check',
            click : function() {
                taskItem.task.markAsDone(function () {
                    fitGroup(taskItem).items.remove(taskItem.item);
                    delete taskItem;
                });
            }
        }));
        /* Botão de editar */
        actions.push(new app.ui.action({
            label : 'editar tarefa',
            image : 'pencil',
            click : function() {
                app.apps.dialog({
                    app : 'tarefas',
                    route : '/editar-tarefa/'+taskItem.task._id,
                    close : function (data) {
                        edit(taskItem, data);
                    }
                })
            }
        }));
        /* Botão de drag'n drop */
        if (fitGroup(taskItem) !== groups.later) {
            actions.push(new app.ui.action({
                label : 'mover tarefa',
                image : 'move',
                click : function () {
                    taskItem.item.drag();
                }
            }));
        }
        /* Botão de excluir */
        actions.push(new app.ui.action({
            label : 'remover tarefa',
            image : 'trash',
            click : function() {
                app.apps.dialog({
                    app : 'tarefas',
                    route : '/remover-tarefa/'+taskItem.task._id,
                    close : function (data) {
                        remove(taskItem);
                    }
                });
            }
        }));

        return actions
    }

    /**
     * Label de uma categoria
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  category_id : id da categoria
     * @return {legend, color}
     */
    function label (category_id) {
        for (var i in categories) {
            if (category_id.toString() === categories[i]._id.toString()) {
                return {legend : categories[i].name, color : categoryColor(categories[i].name)}
            }
        }
        return {legend : 'Geral', color : 'blue'}
    }

    /**
     * Cria o item de uma tarefa
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  data : dados da tarefa
     * @return ui.item
     */
    function item (data) {
        var task = new app.models.task(data),
            droppableGroups = [];

        /* grupos que posso arrastar as tarefas */
        droppableGroups.push(groups.today);
        for (var i in thisWeekDaysGroups) {
            droppableGroups.push(thisWeekDaysGroups[i]);
        }
        for (var i in nextWeekDaysGroups) {
            droppableGroups.push(nextWeekDaysGroups[i]);
        }
        
        droppableGroups.push(groups.noDeadline);

        /* cria o item */
        var item = new app.ui.item({
            title : task.title,
            description : task.description,
            label : label(task.category),
            droppableGroups : droppableGroups,
            drop : function (group, order) {
                task.priority = order;
                task.dateDeadline = group.date;
                item.icons.remove();
                item.icons.add(icons(task));
                console.log(task);
                task.save(function(task) {});
            },
            click : function () {
                app.apps.entity({
                    app : app.slug,
                    route : '/tarefa/' + task._id,
                    data : {
                        remove : function () {
                            remove(tasksItems[task._id])
                        },
                        edit : function (data) {
                            edit(tasksItems[task._id], data)
                        },
                        done : function (data) {
                            remove(tasksItems[task._id])
                        }
                    }
                })
            }
        });

        /* adiciona na lista de itens e tarefas */
        tasksItems[task._id] = {
            task : task,
            item : item
        };

        item.icons.add(icons(task));
        item.actions.add(actions(tasksItems[task._id]));

        fitGroup(tasksItems[task._id]).items.add(tasksItems[task._id].item);

        return item;
    }

    /**
     * Monda os grupos desta semana
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  i : índice do dia da semana
     * @return ui.group
     */
    function weekDayGroups(i, nextweek) {
        var dayGroup = new app.ui.group({
            header : {
                title : dayNames[i]
            }
        });
        dayGroup.header.actions.add(new app.ui.action({
            legend : 'adicionar tarefa',
            image : 'add',
            click : function () {
                app.apps.dialog({
                    app : 'tarefas',
                    route : '/adicionar-tarefa',
                    data : {
                        date : new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + i + (nextweek ? 7 : 0))
                    },
                    close : function(data) {
                        item(data)
                    }
                })
            }
        }));
        return dayGroup;
    }

    /**
     * Monta o formulário de filtragem
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     */
    function filter () {
        var
        /**
         * Campos do formulário
         */
        fields = {},

        /**
         * Lista de opções de categorias
         */
        categoriesOptions = [],

        /**
         * Lista de opções de recorrência
         */
        recurrenceOptions = [],

        /**
         * Fieldset principal
         */
        fieldset,

        /**
         * Função para filtrar tarefas
         */
        filterTasks;

        /**
         * Filtrar tarefas
         *
         * @author Mauro Ribeiro
         * @since  2012-12
         */
        filterTasks = function () {
            var
            /**
             * Categorias selecionadas
             */
            categoriesList = fields.category.value(),

            /**
             * Opção de tarefas importantes
             */
            important = fields.important.value()[0] || fields.important.value()[0] === 'true',

            /**
             * Campo de busca
             */
            queryField = fields.query.value();

            for (var i in tasksItems) {
                if (
                    categoriesList.indexOf(tasksItems[i].task.category) === -1 ||
                    (!tasksItems[i].task.important && important) ||
                    (queryField.length > 1 && (tasksItems[i].task.title + ' ' + tasksItems[i].task.description).toLowerCase().indexOf(queryField.toLowerCase()) === -1)
                ) {
                    tasksItems[i].item.visibility('hide');
                } else {
                    tasksItems[i].item.visibility('show');
                }
            }
        }

        /* Input com as categorias */
        for (var i in categories) {
            if (categories.hasOwnProperty(i)) {
                categoriesOptions.push(new app.ui.inputOption({
                    legend : categories[i].name,
                    value : categories[i]._id,
                    clicked : true,
                    label : categoryColor(categories[i].name)
                }));
            }
        }

        /* Input com as frequencias */
        recurrenceOptions.push(new app.ui.inputOption({legend : 'sem recorrência', value : '0', clicked : true}));
        recurrenceOptions.push(new app.ui.inputOption({legend : 'diariamente', value : '1', clicked : true}));
        recurrenceOptions.push(new app.ui.inputOption({legend : 'semanalmente', value : '7', clicked : true}));
        recurrenceOptions.push(new app.ui.inputOption({legend : 'quinzenalmente', value : '14', clicked : true}));
        recurrenceOptions.push(new app.ui.inputOption({legend : 'mensalmente', value : '30', clicked : true}));

        app.ui.filter.action('filtrar');

        /* busca */
        fields.query = new app.ui.inputText({
            legend : 'Buscar',
            type : 'text',
            name : 'query',
            change : function () {
                app.ui.filter.submit()
            }
        });

        /* lista de categorias */
        fields.category = new app.ui.inputSelector({
            type : 'multiple',
            name : 'category',
            legend : 'Categorias',
            options : categoriesOptions,
            change : function () {
                app.ui.filter.submit()
            },
            actions : true
        });

        /* tarefas importantes */
        fields.important = new app.ui.inputSelector({
            name : 'important',
            type : 'multiple',
            options : [new app.ui.inputOption({legend : 'Importante', name : 'important', value : 'true', image : 'alert'})],
            change : function () {
                app.ui.filter.submit()
            }
        });

        /* fieldset principal */
        fieldset = new app.ui.fieldset({
            legend : 'Filtrar tarefas',
            fields : [fields.query, fields.category, fields.important]
        });

        app.ui.filter.fieldsets.add(fieldset);

        app.ui.filter.submit(filterTasks);
    }

    /**
     * Ações globais
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     */
    function globalActions () {
        app.ui.actions.add(
            new app.ui.action({
                legend : 'adicionar tarefa',
                image : 'add',
                click : function () {
                    app.apps.dialog({
                        app : 'tarefas',
                        route : '/adicionar-tarefa',
                        close : function(data) {
                            item(data)
                        }
                    })
                }
            })
        );
    }

    /**
     * Monta ferramenta
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     */

    app.ui.title('Tarefas pendentes');

    /* objeto das datas para criação dos grupos */
    now = new Date();
    dates.today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    dates.tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    dates.thisWeek = [
        new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()),
        new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 1),
        new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 2),
        new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 3),
        new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 4),
        new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 5),
        new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 6)
    ]
    dates.nextWeek = [
        new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 7),
        new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 8),
        new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 9),
        new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 10),
        new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 11),
        new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 12),
        new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 13)
    ]
    dates.later = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 14);

    /* criação dos grupos */
    groups.pending = new app.ui.group({ header : { title : 'Pendente'}});
    groups.pending.visibility('hide');

    groups.today = new app.ui.group({ header : { title : 'Hoje' }});
    groups.today.date = dates.today;
    groups.today.header.actions.add(new app.ui.action({
        legend : 'adicionar tarefa',
        image : 'add',
        click : function () {
            app.apps.dialog({
                app : 'tarefas',
                route : '/adicionar-tarefa',
                data : {
                    date : dates.today
                },
                close : function(data) {
                    item(data)
                }
            })
        }
    }));

    groups.thisWeek = new app.ui.groupset({ header : { title : 'Esta semana' }});
    for (i = dates.today.getDay() + 1; i < 7; i++) {
        thisWeekDaysGroups[i] = weekDayGroups(i);
        thisWeekDaysGroups[i].date = dates.thisWeek[i];
        groups.thisWeek.groups.add(thisWeekDaysGroups[i]);
    }

    groups.nextWeek = new app.ui.groupset({ header : { title : 'Próxima semana' }});
    for (i = dates.nextWeek[0].getDay(); i < 7; i++) {
        nextWeekDaysGroups[i] = weekDayGroups(i, true);
        nextWeekDaysGroups[i].date = dates.nextWeek[i];
        groups.nextWeek.groups.add(nextWeekDaysGroups[i]);
    }

    groups.later = new app.ui.group({ header : { title : 'Depois' }});
    groups.later.date = dates.later;
    groups.later.header.actions.add(new app.ui.action({
        legend : 'adicionar tarefa',
        image : 'add',
        click : function () {
            app.apps.dialog({
                app : 'tarefas',
                route : '/adicionar-tarefa',
                data : {
                    date : dates.later
                },
                close : function(data) {
                    item(data)
                }
            })
        }
    }));

    groups.noDeadline = new app.ui.group({ header : { title : 'Sem prazo' }});
    groups.noDeadline.date = null;
    groups.noDeadline.header.actions.add(new app.ui.action({
        legend : 'adicionar tarefa',
        image : 'add',
        click : function () {
            app.apps.dialog({
                app : 'tarefas',
                route : '/adicionar-tarefa',
                close : function(data) {
                    item(data)
                }
            })
        }
    }));

    globalActions();

    /* autenticando usuário e pegando categorias */
    app.models.category.list(function (data) {
        categories = data;
        /* exibe o orientador */
        app.models.task.list({}, function (tasks) {
            if (tasks.length === 0) {
                app.ui.actions.get()[0].helper.description('Comece registrando o que você ainda precisa fazer hoje até o fim do dia');
                app.ui.actions.get()[0].helper.example('Ex.: "Reunião com João", "Revisar proposta comercial da Cliente S.A", "Mandar relatório para o contador", etc.');
            }
        });
        /* montando a listagem */
        app.models.task.list({ filterByDone : false }, function (tasks) {
            tasks.sort(function (a,b) {
                var a_priority = a.priority || 1;
                var b_priority = b.priority || 1;

                if (a_priority < b_priority)  return -1;
                if (a_priority > b_priority)  return  1;
                return 0;
            });
            for (i in tasks) {
                item(tasks[i]);
            }
            /* adiciona grupos na interface */
            app.ui.groups.add(groups.pending);
            app.ui.groups.add(groups.today);
            app.ui.groups.add(groups.thisWeek);
            app.ui.groups.add(groups.nextWeek);
            app.ui.groups.add(groups.later);
            app.ui.groups.add(groups.noDeadline);
        });
        filter();
    });
});
