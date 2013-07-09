/**
 * Diálogo para criar uma tarefa
 *
 * @author Mauro Ribeiro
 * @since  2012-12
 *
 * @param data : {
 *              embeddeds : url a ser embedada
 *              category : categoria pré-definida
 *              title : informação a ser adicionada no título
 *          }
 */
app.routes.dialog('/adicionar-tarefa', function (params, data) {
    var request = data ? data : {};
    app.event('clicar: adicionar tarefa');

    /**
     * Pega o id de uma categoria a partir do nome
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  categories : lista de categorias
     * @param  name : nome da categoria
     */
    function categoryId (categories, name) {
        for (var i in categories) {
            if (categories[i].name === name) {
                return categories[i]._id
            }
        }
        return categories[0]._id;
    }

    /**
     * Monta o formulário
     *
     * @author Mauro Ribeiro
     * @since  2012-11
     *
     * @param  categories : lista de categorias do usuário
     */
    function form (categories) {
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

        date = request.date ? new Date(request.date) : null;

        /* Input com as fases */
        for (var i in categories) {
            if (categories.hasOwnProperty(i)) {
                categoriesOptions.push(new app.ui.inputOption({
                    legend : categories[i].name,
                    value : categories[i]._id,
                    label : categories[i].color || 'blue',
                    click : request.category ? categories[i]._id === request.category : parseInt(i) === 0
                }));
            }
        }

        /* Input com as frequencias */
        recurrenceOptions.push(new app.ui.inputOption({legend : 'sem recorrência', value : '0', click : true}));
        recurrenceOptions.push(new app.ui.inputOption({legend : 'diariamente', value : '1'}));
        recurrenceOptions.push(new app.ui.inputOption({legend : 'dias úteis', value : '5'}));
        recurrenceOptions.push(new app.ui.inputOption({legend : 'semanalmente', value : '7'}));
        recurrenceOptions.push(new app.ui.inputOption({legend : 'quinzenalmente', value : '14'}));
        recurrenceOptions.push(new app.ui.inputOption({legend : 'mensalmente', value : '30'}));

        /* Input com os lembretes */
        reminderOptions.push(new app.ui.inputOption({legend : 'sem lembrete', value : 'null', click : true}));
        reminderOptions.push(new app.ui.inputOption({legend : 'no dia', value : '0'}));
        reminderOptions.push(new app.ui.inputOption({legend : '1 dia antes', value : '1'}));
        reminderOptions.push(new app.ui.inputOption({legend : '2 dias antes', value : '2'}));
        reminderOptions.push(new app.ui.inputOption({legend : '1 semana antes', value : '7'}));

        /* Input com os usuários */
        for (var i in app.config.users) {
            if (app.config.users.hasOwnProperty(i)) {
                userOptions.push(new app.ui.inputOption({
                    legend  : app.config.users[i].name,
                    value   : app.config.users[i]._id,
                    click : app.config.user._id === app.config.users[i]._id
                }));
            }
        }

        /* Inputs do formulário */
        /* título da tarefa */
        fields.title = new app.ui.inputText({
            legend : 'Título',
            type : 'text',
            name : 'title',
            rules : [{rule:/.{3,}/, message : 'campo obrigatório'}]
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
            options : [new app.ui.inputOption({label : '', name : 'important', value : 'important'})]
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
            name : 'description'
        });

        /* responsavel */
        fields.user = new app.ui.inputSelector({
            name : 'user',
            type : 'single',
            legend  : 'Responsável',
            options : userOptions,
            filterable : true
        });

        /* fieldset */
        fieldsets = {
            task : new app.ui.fieldset({
                legend : 'Tarefa',
                collapsed : false
            }),
            adittional : new app.ui.fieldset({
                legend : 'Mais informações',
                collapsed : true
            }),
        };

        /* adiciona os campos no fieldset */
        fieldsets.task.fields.add(fields.title);
        fieldsets.task.fields.add(fields.date);

        if (!request.category) {
            fieldsets.adittional.fields.add(fields.category);
        }
        fieldsets.adittional.fields.add(fields.important);
        fieldsets.adittional.fields.add(fields.reminder);
        fieldsets.adittional.fields.add(fields.recurrence);
        fieldsets.adittional.fields.add(fields.description);
        fieldsets.adittional.fields.add(fields.user);
        app.ui.form.fieldsets.add(fieldsets.task);
        app.ui.form.fieldsets.add(fieldsets.adittional);

        fields.title.focus();

        /* Controle de envio do form */
        app.ui.form.submit(function() {
            var data = {
                title : fields.title.value(),
                dateDeadline : fields.date.value() ? fields.date.date() : null,
                important : fields.important.value()[0] === 'important',
                recurrence : fields.recurrence.value()[0],
                description : fields.description.value(),
                user : fields.user.value()[0]
            };
            if (fields.reminder.value()[0] !== 'null') {
                data.reminder = fields.reminder.value()[0];
            }
            if (request.category) {
                data.category = categoryId(categories, request.category);
            } else {
                data.category = fields.category.value()[0];
            }
            if (request.title) {
                data.subtitle = request.title;
            }
            var task = new app.models.task(data);
            if (request.embeddeds) task.embeddeds = request.embeddeds;
            task.save(function (task) {
                app.trigger('create task', task);
                app.close();
            });
        });

    } // end form()

    /**
     * Monta o diálogo
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     */
    app.ui.title("Adicionar tarefa");
    app.ui.form.action("Adicionar!");

    app.models.category.list(function(categories) {
        form(categories);
    });
});