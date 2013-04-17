/**
 * Diálogo para adicionar nova transação do tipo receita
 *
 * @author Mauro Ribeiro
 * @since  2012-12
 *
 * @param data {date : date} data padrão
 */
app.routes.dialog('/adicionar-receita', function (params, data) {
    var request = data ? data : {};

    /**
     * Cria o formulário
     *
     * @author : Mauro Ribeiro
     * @since : 2012-12
     *
     * @param categories : lista de categorias
     * @param accounts : lista de contas
     */
    function form (categories, accounts) {
        var
        /**
         * Campos do formulário
         */
        fields = {},

        /**
         * Lista de ui.options de categorias
         */
        categoriesOptions = [],

        /**
         * Lista de ui.options de contas
         */
        accountsOptions = [],

        /**
         * Lista de ui.options de recorrências
         */
        recurrenceOptions = [],

        /**
         * Fieldset ui.fieldset principal do formulário
         */
        fieldset,

        /**
         * Data-hora de agora
         */
        now = new Date(),

        /**
         * Data de hoje
         */
        date = request.date ? new Date(request.date) : now,

        /**
         * Diz se alguma categoria ja foi marcada
         */
        selected = false;

        /* Input com as categorias */
        for (var i in categories) {
            if (categories.hasOwnProperty(i) && categories[i].type === 'credit') {
                categoriesOptions.push(new app.ui.inputOption({
                    legend : categories[i].name,
                    value : categories[i]._id,
                    clicked : !selected
                }));
                selected = true;
            }
        }

        /* Input com as contas */
        for (var i in accounts) {
            if (accounts.hasOwnProperty(i)) {
                accountsOptions.push(new app.ui.inputOption({
                    legend : accounts[i].name,
                    value : accounts[i]._id,
                    clicked : parseInt(i) === 0
                }));
            }
        }

        /* Input com as frequencias */
        recurrenceOptions.push(new app.ui.inputOption({legend : 'diariamente', value : '1'}));
        recurrenceOptions.push(new app.ui.inputOption({legend : 'semanalmente', value : '7'}));
        recurrenceOptions.push(new app.ui.inputOption({legend : 'quinzenalmente', value : '14'}));
        recurrenceOptions.push(new app.ui.inputOption({legend : 'mensalmente', value : '30'}));

        /* Inputs do formulário */
        fields.name = new app.ui.inputText({
            legend : 'Nome',
            type : 'text',
            name : 'name',
            rules : [{rule:/.{3,}/, message : 'campo obrigatório'}]
        });
        fields.value = new app.ui.inputText({
            legend : 'Valor',
            type : 'text',
            name : 'value',
            rules : [{rule:/^[0-9]+([\.\,][0-9]{2})?$/, message : 'valor inválido'}]
        });
        fields.category = new app.ui.inputSelector({
            type : 'single',
            name : 'category',
            legend : 'Categoria',
            options : categoriesOptions,
            filterable : true
        });
        fields.account = new app.ui.inputSelector({
            type : 'single',
            name : 'account',
            legend : 'Conta',
            options : accountsOptions
        });
        fields.date = new app.ui.inputDate({
            legend : 'Data',
            type : 'date',
            name : 'date',
            value : parseInt(date.getDate()) + '/' + parseInt(date.getMonth() + 1) + '/' + date.getFullYear()
        });
        fields.recurrence = new app.ui.inputSelector({
            type : 'single',
            name : 'recurrence',
            legend : 'Recorrência',
            options : recurrenceOptions
        });
        /*fields.reminder = new app.ui.inputSelector({
            name : 'reminder',
            type : 'single',
            legend : 'Lembrete por email',
            options : [
                new app.ui.inputOption({legend : 'sem lembrete', value : 'null', clicked : true}),
                new app.ui.inputOption({legend : 'no dia', value : '0'}),
                new app.ui.inputOption({legend : '1 dia antes', value : '1'}),
                new app.ui.inputOption({legend : '2 dias antes', value : '2'}),
                new app.ui.inputOption({legend : '1 semana antes', value : '7'})
            ]
        });*/
        fields.recurrence.visibility('hide');
        fields.repetitions = new app.ui.inputText({
            legend : 'No. de parcelas',
            type : 'text',
            name : 'repetitions',
            value : '1',
            rules : [{rule:/[0-9]*/, message : 'número inválido'}],
            change : function () {
                if (fields.repetitions.value() > 1) {
                    fields.recurrence.visibility('show');
                } else {
                    fields.recurrence.visibility('hide');
                }
            }
        });
        fields.observation = new app.ui.inputTextarea({
            legend : 'Observações',
            type : 'text',
            name : 'observation'
        });

        fieldset = new app.ui.fieldset({
            legend : 'Transação'
        });
        fieldset.fields.add(fields.name);
        fieldset.fields.add(fields.value);
        fieldset.fields.add(fields.category);
        fieldset.fields.add(fields.account);
        fieldset.fields.add(fields.date);
        fieldset.fields.add(fields.reminder);
        fieldset.fields.add(fields.repetitions);
        fieldset.fields.add(fields.recurrence);
        fieldset.fields.add(fields.observation);

        app.ui.form.fieldsets.add(fieldset);

        fields.name.focus();

        /* Controle de envio do form */
        app.ui.form.submit(function() {
            var transactions = [],
                repetitions = parseInt(fields.repetitions.value()),
                recurrence = repetitions > 1 ? parseInt(fields.recurrence.value()[0]) : 0,
                saveTransaction;

            /**
             * Salva a transação e, se salvou todas, fecha
             */
            saveTransaction = function (i, repetitions) {
                transactions[i].save(function () {
                    app.events.trigger('create transaction', transactions[i]);
                    if (i === repetitions - 1) {
                        app.close(transactions);
                    }
                });
            }

            if (recurrence == 0 || !repetitions) {
                repetitions = 1;
            }
            for (var i = 0; i < repetitions; i++) {
                var data = {
                    name : fields.name.value(),
                    value : fields.value.value().replace(',', '.'),
                    category : fields.category.value()[0],
                    account : fields.account.value()[0],
                    date : fields.date.value() ? fields.date.date() : null,
                    observation : fields.observation.value(),
                    type : 'credit'
                },
                date = new Date(data.date);
                data.name = repetitions > 1 ? data.name + ' ('+(i+1)+'/'+repetitions+')' : data.name;

                if (request.title) {
                    data.subtitle = request.title;
                }

                if (request.embeddeds) {
                    data.embeddeds = request.embeddeds;
                }

                /*if (fields.reminder.value()[0] !== 'null') {
                    data.reminder = fields.reminder.value()[0];
                }*/
                if (recurrence == 30) {
                    data.date = new Date(date.getFullYear(), date.getMonth() + i, date.getDate());
                    if (data.date.getMonth() != date.getMonth() + i) {
                        data.date.setDate(0);
                    }
                } else {
                    data.date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + (i*recurrence));
                }
                transactions[i] = new app.models.transaction(data);
                saveTransaction(i, repetitions);
            }
        });

    } // end form()

    /**
     * Avisa mensagem e fecha
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     */
    function message () {
        app.ui.description('Você precisa ter categorias e contas cadastradas.');
        app.ui.form.action('Beleza, valeu!');
        app.ui.form.submit(function() {
            app.close();
        });
    }

    /**
     * Monta o diálogo
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     */
    app.ui.title("Adicionar receita");
    app.ui.form.action("Adicionar!");

    app.models.category.list(function(categories) {
        app.models.account.list(function(accounts) {
            var selected = false;

            for (var i in categories) {
                if (categories.hasOwnProperty(i) && categories[i].type === 'credit') {
                    selected = true;
                }
            }

            if (selected && accounts.length) {
                categories.sort(function (a,b) {
                    var aName = a.name || '';
                        bName = b.name || '';

                    if (aName > bName) return  1;
                    if (aName < bName) return -1;
                    return 0;
                });
                form(categories, accounts);
            } else {
                message();
            }
        });
    });
});