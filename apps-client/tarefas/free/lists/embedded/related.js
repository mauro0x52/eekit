/**
 * Lista de tarefas pendentes
 *
 * @author Mauro Ribeiro
 * @since  2012-12
 *
 * @param  data : {
 *              list : {
 *                  embeddeds : lista de urls a ser embedada
 *              },
 *              add : {
 *                  embeddeds : lista de urls a ser embedada
 *                  category : categoria pré-definida
 *                  title : informação a ser adicionada no título
 *              }
 *         }
 */
app.routes.embeddedList('/relacionadas', function (params, data) {

    var
    /**
     * Índice usado em loops
     */
    i,

    /**
     * Grupos ui.group
     */
    groups = {},

    /**
     * Lista de duplas {task : models.task, item ui.item}
     */
    tasksItems = {},

    /**
     * Lista de categorias
     */
    categories,

    /**
     * Dados enviados pela requisição
     */
    request = data ? data : {};


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
     * Atualiza as informações de uma dupla task-item após marcá-la como feita
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  taskItem : dupla task-item
     */
    function done (taskItem) {
        taskItem.task.done = true;
        groups.undone.items.remove(taskItem.item);
        groups.done.items.add(taskItem.item);
        taskItem.item.actions.remove();
        taskItem.item.actions.add(actions(taskItem));
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
        if (taskItem.task.done) {
            return groups.done;
        } else {
            return groups.undone;
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
        if (!taskItem.task.done) {
            actions.push(new app.ui.action({
                label : 'marcar tarefa como feita',
                image : 'check',
                click : function() {
                    taskItem.task.markAsDone(function () {
                        done(taskItem)
                    });
                }
            }));
        }
        /* Botão de editar */
        actions.push(new app.ui.action({
            label : 'editar tarefa',
            image : 'pencil',
            click : function() {
                app.apps.dialog({
                    app : 'tarefas',
                    route : '/editar-tarefa/'+taskItem.task._id,
                    data : {
                        embeddeds : request.embeddeds
                    },
                    close : function (data) {
                        edit(taskItem, data);
                    }
                })
            }
        }));
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

        /* cria o item */
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
                        },
                        edit : function (data) {
                            edit(tasksItems[task._id], data)
                        },
                        done : function () {
                            done(tasksItems[task._id]);
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
     * Monta ferramenta
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     */
    app.ui.title('Tarefas relacionadas');

    groups.undone = new app.ui.group({ header : { title : 'Tarefas pendentes' }});
    groups.undone.header.actions.add(new app.ui.action({
        legend : 'adicionar tarefa',
        image : 'add',
        click : function () {
            app.apps.dialog({
                app : 'tarefas',
                route : '/adicionar-tarefa',
                data : {
                    embeddeds : request.add ? request.add.embeddeds : undefined,
                    category : request.add ? request.add.category : undefined,
                    title : request.add ? request.add.title : undefined
                },
                close : function(data) {
                    item(data)
                }
            })
        }
    }));

    groups.done = new app.ui.group({ header : { title : 'Tarefas feitas' }});

    app.ui.groups.add(groups.undone);
    app.ui.groups.add(groups.done);

    /* autenticando usuário e pegando categorias */
    app.models.category.list(function (data) {
        categories = data;
        /* montando a listagem */
        app.models.task.list({ filterByEmbeddeds : request.list ? request.list.embeddeds[0] : undefined }, function (tasks) {
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
        });
    });
});