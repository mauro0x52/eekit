/**
 * Informações de uma tarefa
 *
 * @author Mauro Ribeiro
 * @since  2012-12
 *
 * @param  params.id : id da tarefa
 */
app.routes.entity('/tarefa/:id', function (params, data) {

    var
    /**
     * Campos dos dados
     */
    fields = {},
    /**
     * Callback para quando for executada a remoção
     */
    remove = (data && data.remove) ? data.remove : function () {},
    /**
     * Callback para quando for executada a edição
     */
    edit = (data && data.edit) ? data.edit : function () {},
    /**
     * Callback para quando for executada uma marcação de tarefa como feita
     */
    done = (data && data.done) ? data.done : function () {},
    /**
     * Nome dos dias da semana
     */
    daysNames = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
    /**
     * Nome dos meses
     */
    monthsNames = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
    /**
     * Lista de categorias
     */
    categories;

    /**
     * Formata a data legível para o usuário
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  string : data
     */
    function dateFormat (string) {
        var date = new Date(string);
        return daysNames[date.getDay()]  + ', ' + date.getDate() + ' de ' + monthsNames[date.getMonth()] + ' de ' + date.getFullYear()
    }

    /**
     * Categoria legível para o usuário
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  category_id : id da categoria
     */
    function categoryName (category_id) {
        var i;
        for (var i in categories) {
            if (category_id.toString() === categories[i]._id.toString()) {
                return categories[i].name;
            }
        }
        return 'Geral'
    }

    /**
     * Recorrência legível para o usuário
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  recurrence : valor em dias da recorrência
     */
    function recurrence (recurrence) {
        switch (recurrence) {
            case 0 : return 'sem recorrência';
            case 1 : return 'diariamente';
            case 7 : return 'semanalmente';
            case 14 : return 'quinzenalmente';
            case 30 : return 'mensalmente';
        }
        return 'a cada' + recurrence + ' dias';
    }

    /**
     * Lembrete legível para o usuário
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  recurrence : valor em dias da recorrência
     */
    function reminder (reminder) {
        switch (reminder) {
            case 0 : return 'no dia';
            case 1 : return '1 dia antes';
            case 2 : return '2 dias antes';
            case 7 : return '1 semana antes';
        }
        return recurrence + ' dias antes';
    }

    /**
     * Monta a view
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     */
    app.models.category.list(function (data) {
        categories = data;
        app.models.task.find(params.id, function (task) {
            if (!task.done) {
                app.ui.actions.add(
                    new app.ui.action({
                        label : 'marcar tarefa como feita',
                        image : 'check',
                        click : function() {
                            task.markAsDone(function (data) {
                                done(data);
                                app.close();
                            });
                        }
                    })
                );
                app.ui.actions.add(
                    new app.ui.action({
                        label : 'editar tarefa',
                        image : 'pencil',
                        click : function() {
                            app.apps.open({
                                app : 'tarefas',
                                route : '/editar-tarefa/'+task._id,
                                close : function (data) {
                                    edit(data);
                                    app.ui.title('Tarefa: ' + data.title);
                                    app.ui.subtitle(data.title);
                                    app.ui.description(data.description);
                                    fields.dateDeadline.values.get()[0].value(dateFormat(data.dateDeadline));
                                    fields.important.values.get()[0].value(data.important ? 'sim' : 'não');
                                    fields.category.values.get()[0].value(categoryName(data.category));
                                    fields.recurrence.values.get()[0].value(data.recurrence);
                                }
                            })
                        }
                    })
                );
            }
            app.ui.actions.add(
                new app.ui.action({
                    label : 'remover tarefa',
                    image : 'trash',
                    click : function() {
                        task.remove(function (){
                            remove();
                            app.close();
                        });
                    }
                })
            );

            app.ui.title('Tarefa: ' + task.title);

            app.ui.subtitle(task.title);

            app.ui.description(task.description);


            fields.dateCreated = new app.ui.data({
                legend : 'criação',
                values : [new app.ui.value({value : dateFormat(task.dateCreated)})]
            });

            fields.dateUpdated = new app.ui.data({
                legend : task.done ? 'realização' : 'última atualização',
                values : [new app.ui.value({value : dateFormat(task.dateUpdated)})]
            });

            fields.dateDeadline = new app.ui.data({
                legend : 'prazo',
                values : [new app.ui.value({value : task.dateDeadline ? dateFormat(task.dateDeadline) : 'sem prazo'})]
            });

            fields.important = new app.ui.data({
                legend : 'importante',
                values : [new app.ui.value({value : task.important ? 'sim' : 'não'})]
            });

            fields.category = new app.ui.data({
                legend : 'categoria',
                values : [new app.ui.value({value : categoryName(task.category)})]
            });

            if (task.recurrence) {
                fields.recurrence = new app.ui.data({
                    legend : 'recorrência',
                    values : [new app.ui.value({value : recurrence(task.recurrence)})]
                });
            }

            if (task.reminder) {
                fields.reminder = new app.ui.data({
                    legend : 'lembrar-me por email',
                    values : [new app.ui.value({value : reminder(task.reminder)})]
                });
            }

            app.ui.datasets.add(
                new app.ui.dataset({
                    legend : 'Detalhes',
                    fields : [fields.category, fields.important, (task.reminder !== null) ? fields.reminder : {}]
                })
            );

            app.ui.datasets.add(
                new app.ui.dataset({
                    legend : 'Datas',
                    fields : [fields.dateDeadline ? fields.dateDeadline : {}, fields.recurrence ? fields.recurrence : {}]
                })
            );

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