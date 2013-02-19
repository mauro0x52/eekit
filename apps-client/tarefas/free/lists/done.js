/**
 * Lista de tarefas pendentes
 *
 * @author Mauro Ribeiro
 * @since  2012-12
 */
app.routes.list('/feitas', function (params, data) {

    app.tracker.event('visualizar tarefas feitas');

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
    tasksItems = [],

    /**
     * Nome dos dias
     */
    dayNames = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],

    /**
     * Lista de categorias
     */
    categories;

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

        taskDate = new Date(taskItem.task.dateUpdated);
        if (taskDate >= dates.today) {
            return groups.today;
        } else if (taskDate >= dates.thisWeek.sat) {
            return thisWeekDaysGroups[6];
        } else if (taskDate >= dates.thisWeek.fri) {
            return thisWeekDaysGroups[5];
        } else if (taskDate >= dates.thisWeek.thu) {
            return thisWeekDaysGroups[4];
        } else if (taskDate >= dates.thisWeek.wed) {
            return thisWeekDaysGroups[3];
        } else if (taskDate >= dates.thisWeek.tue) {
            return thisWeekDaysGroups[2];
        } else if (taskDate >= dates.thisWeek.mon) {
            return thisWeekDaysGroups[1];
        } else if (taskDate >= dates.lastWeek.sun) {
            return thisWeekDaysGroups[0];
        } else if (taskDate >= dates.lastWeek) {
            return groups.lastWeek;
        } else {
            return groups.before;
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
        if (task.dateUpdated || task.done) {
            date = new Date(task.dateUpdated);
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

        /* Botão de excluir */
        actions.push(new app.ui.action({
            label : 'remover tarefa',
            image : 'trash',
            click : function() {
                taskItem.task.remove(function () {
                    remove(taskItem);
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
        var i;
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
        var task = new app.models.task(data);
        var item = new app.ui.item({
            title : task.title,
            description : task.description,
            label : label(task.category),
            click : function () {
                app.apps.entity({
                    app : app.slug,
                    route : '/tarefa/' + task._id,
                    data : {
                        remove : function () {
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
    function weekDayGroups(i) {
        var dayGroup = new app.ui.group({
            header : {
                title : dayNames[i]
            }
        });
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
            var categoriesList = fields.category.value(),
                important = fields.important.value()[0] || fields.important.value()[0] === 'true',
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

        /* campo de busca */
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

        /* exibir apenas tarefa importante */
        fields.important = new app.ui.inputSelector({
            name : 'important',
            type : 'multiple',
            options : [new app.ui.inputOption({legend : 'Importante', name : 'important', value : 'true', image : 'alert'})],
            change : function () {
                app.ui.filter.submit()
            }
        });

        /* fielset */
        fieldset = new app.ui.fieldset({
            legend : 'Filtrar tarefas',
            fields : [fields.query, fields.category, fields.important]
        });

        app.ui.filter.fieldsets.add(fieldset);

        app.ui.filter.submit(filterTasks);
    }

    /**
     * Monta ferramenta
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     */
    app.ui.title('Tarefas feitas');

    /* objeto das datas para criação dos grupos */
    now = new Date();
    dates.today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    dates.yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    dates.tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    dates.thisWeek = {
        sun : new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()),
        mon : new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 1),
        tue : new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 2),
        wed : new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 3),
        thu : new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 4),
        fri : new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 5),
        sat : new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 6)
    }
    dates.lastWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() - 7);
    dates.before = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() - 14);

    /* criação dos grupos */
    groups.today = new app.ui.group({ header : { title : 'Hoje' }});

    groups.thisWeek = new app.ui.groupset({ header : { title : 'Esta semana' }});
    for (i = dates.today.getDay() - 1; i >= 0; i--) {
        thisWeekDaysGroups[i] = weekDayGroups(i);
        thisWeekDaysGroups[i].date = dates.thisWeek[i];
        groups.thisWeek.groups.add(thisWeekDaysGroups[i]);
    }

    groups.lastWeek = new app.ui.group({ header : { title : 'Semana passada' }});

    groups.before = new app.ui.group({ header : { title : 'Antes' }});

    app.ui.groups.add(groups.today);
    app.ui.groups.add(groups.thisWeek);
    app.ui.groups.add(groups.lastWeek);
    app.ui.groups.add(groups.before);

    /* autenticando usuário e pegando categorias */
    app.models.category.list(function (data) {
        categories = data;
        /* montando a listagem */
        app.models.task.list({ filterByDone : true }, function (tasks) {
            tasks.sort(function  (a,b) {
                var a_priority = a.dateUpdated || new Date();
                var b_priority = b.dateUpdated || new Date();

                if (a_priority == b_priority) return  0;
                if (a_priority < b_priority)  return  1;
                if (a_priority > b_priority)  return -1;
            });
            for (i in tasks) {
                item(tasks[i]);
            }
        });
        filter();
    });
});
