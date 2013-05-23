/**
 * Diálogo para editar uma tarefa
 *
 * @author Mauro Ribeiro
 * @since  2012-12
 *
 * @param  params.id : id da tarefa
 * @param  data.embedded : url relacionada
 */
app.routes.dialog('/editar-tarefa/:id', function (params, data) {
    var request = data ? data : {};

    /**
     * Monta o formulário
     *
     * @author Mauro Ribeiro
     * @since  2012-11
     *
     * @param  categories : lista de categorias do usuário
     * @param  task : tarefa
     */
    function form (categories, task) {
        var
        /**
         * Campos do formulário
         */
        fields = {},

        /**
         * Lista de ui.option de categorias
         */
        categoriesOptions = [],

        /**
         * Lista de ui.option de recorrência
         */
        recurrenceOptions = [],

        /**
         * Lista de ui.option de lembretes
         */
        reminderOptions = [],

        /**
         * Lista de ui.option de usuários
         */
        userOptions = [],

        /**
         * Fieldset
         */
        fieldset,

        /**
         * Data da tarefa
         */
        date;

        if (!task.done) {
            date = task.dateDeadline ? new Date(task.dateDeadline) : null;
        }

        /* Input com as fases */
        for (var i in categories) {
            if (categories.hasOwnProperty(i)) {
                categoriesOptions.push(new app.ui.inputOption({
                    legend : categories[i].name,
                    value : categories[i]._id,
                    label : categories[i].color || 'blue',
                    clicked : categories[i]._id === task.category
                }));
            }
        }

        /* Input com os usuários */
        for (var i in app.config.users) {
            if (app.config.users.hasOwnProperty(i)) {
                userOptions.push(new app.ui.inputOption({
                    legend  : app.config.users[i].name,
                    value   : app.config.users[i]._id,
                    clicked : task.user === app.config.users[i]._id
                }));
            }
        }

        /* Input com as frequencias */
        recurrenceOptions.push(new app.ui.inputOption({legend : 'sem recorrência', value : '0', clicked : task.recurrence.toString() === '0'}));
        recurrenceOptions.push(new app.ui.inputOption({legend : 'diariamente', value : '1', clicked : task.recurrence.toString() === '1'}));
        recurrenceOptions.push(new app.ui.inputOption({legend : 'dias úteis', value : '5', clicked : task.recurrence.toString() === '5'}));
        recurrenceOptions.push(new app.ui.inputOption({legend : 'semanalmente', value : '7', clicked : task.recurrence.toString() === '7'}));
        recurrenceOptions.push(new app.ui.inputOption({legend : 'quinzenalmente', value : '14', clicked : task.recurrence.toString() === '14'}));
        recurrenceOptions.push(new app.ui.inputOption({legend : 'mensalmente', value : '30', clicked : task.recurrence.toString() === '30'}));

        /* Input com os lembretes */
        reminderOptions.push(new app.ui.inputOption({legend : 'sem lembrete', value : 'null', clicked : !task.reminder && task.reminder !== 0}));
        reminderOptions.push(new app.ui.inputOption({legend : 'no dia', value : '0', clicked : (task.reminder === 0) ? true : false}));
        reminderOptions.push(new app.ui.inputOption({legend : '1 dia antes', value : '1', clicked : (task.reminder === 1) ? true : false}));
        reminderOptions.push(new app.ui.inputOption({legend : '2 dias antes', value : '2', clicked : (task.reminder === 2) ? true : false}));
        reminderOptions.push(new app.ui.inputOption({legend : '1 semana antes', value : '7', clicked : (task.reminder === 7) ? true : false}));

        /* Inputs do formulário */
        /* título da tarefa */
        fields.title = new app.ui.inputText({
            legend : 'Título',
            type : 'text',
            name : 'title',
            rules : [{rule:/.{3,}/, message:'campo obrigatório'}],
            value : task.title
        });

        /* data da tarefa */
        fields.date = new app.ui.inputDate({
            legend : 'Data',
            type : 'date',
            name : 'date',
            value : date ? parseInt(date.getDate()) + '/' + parseInt(date.getMonth() + 1) + '/' + date.getFullYear() : '',
            change : function () {
                if (fields.date.value()) {
                    fields.reminder.visibility('show');
                } else {
                    fields.reminder.visibility('hide');
                }
            }
        });

        /* recorrência */
        fields.recurrence = new app.ui.inputSelector({
            type : 'single',
            name : 'recurrence',
            legend : 'Recorrência',
            options : recurrenceOptions
        });

        /* categoria */
        fields.category = new app.ui.inputSelector({
            type : 'single',
            name : 'category',
            legend : 'Categoria',
            options : categoriesOptions,
            filterable : true
        });

        /* se é importante */
        fields.important = new app.ui.inputSelector({
            name : 'important',
            type : 'multiple',
            legend : 'Importante',
            options : [new app.ui.inputOption({label : '', name : 'important', value : 'important', clicked : task.important})]
        });

        /* lembrete */
        fields.reminder = new app.ui.inputSelector({
            name : 'reminder',
            type : 'single',
            legend : 'Lembrete por email',
            options : reminderOptions,
            change : function () {
                app.event('clicar: adicionar lembrete');
            }
        });
        if (fields.date.value()) {
            fields.reminder.visibility('show');
        } else {
            fields.reminder.visibility('hide');
        }

        /* descrição */
        fields.description = new app.ui.inputTextarea({
            legend : 'Observações',
            name : 'description',
            value : task.description
        });

        /* responsável */
        fields.user = new app.ui.inputSelector({
            name : 'user',
            type : 'single',
            legend  : 'Responsável',
            options : userOptions,
            filterable : true
        });

        /* fieldset */
        fieldset = new app.ui.fieldset({
            legend : 'Tarefa'
        });

        /* adiciona os campos no fieldset */
        fieldset.fields.add(fields.title);
        fieldset.fields.add(fields.category);
        if (!task.done) {
            fieldset.fields.add(fields.date);
        }
        fieldset.fields.add(fields.important);
        fieldset.fields.add(fields.reminder);
        fieldset.fields.add(fields.recurrence);
        fieldset.fields.add(fields.description);
        fieldset.fields.add(fields.user);
        app.ui.form.fieldsets.add(fieldset);

        fields.title.focus();

        /* Controle de envio do form */
        app.ui.form.submit(function() {
            var data = {
                title : fields.title.value(),
                subtitle : task.subtitle,
                category : fields.category.value()[0],
                important : fields.important.value()[0] === 'important',
                recurrence : fields.recurrence.value()[0],
                description : fields.description.value(),
                user : fields.user.value()[0]
            };

            if (task.done) {
                data.dateUpdated  = task.dateUpdated;
            } else {
                data.dateDeadline = fields.date.value() ? fields.date.date() : null;
            }

            if (fields.reminder.value()[0] !== 'null') {
                data.reminder = fields.reminder.value()[0];
            } else {
                data.reminder = null;
            }
            var editTask = new app.models.task(data);
            if (request.embedded) task.embeddeds = [request.embedded];
            editTask._id = task._id;
            editTask.save(function (task) {
                app.close(task);
            });
        });

    } // end form()

    /**
     * Monta o diálogo
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     */
    app.ui.title("Editar tarefa");
    app.ui.form.action("Editar!");

    app.models.task.find(params.id, function(task) {
        app.models.category.list(function(categories) {
            form(categories, task);
        });
    })
});