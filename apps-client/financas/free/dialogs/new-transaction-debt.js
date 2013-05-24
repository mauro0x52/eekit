/**
 * Diálogo para adicionar nova transação do tipo despesa
 *
 * @author Mauro Ribeiro
 * @since  2012-12
 *
 * @param data {date : date} data padrão
 */
app.routes.dialog('/adicionar-despesa', function (params, data) {
    var request = data ? data : {};
    app.event('clicar: adicionar transação');

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
            if (categories.hasOwnProperty(i) && categories[i].type === 'debt') {
                categoriesOptions.push(new app.ui.inputOption({
                    legend : categories[i].name,
                    value : categories[i]._id,
                    click : !selected
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
                    click : parseInt(i) === 0
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
                new app.ui.inputOption({legend : 'sem lembrete', value : 'null', click : true}),
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

        fieldsets = {
            transaction : new app.ui.fieldset({
                legend : 'Despesa',
                collapsed : false
            }),
            adittional : new app.ui.fieldset({
                legend : 'Mais informações',
                collapsed : true
            }),
        };

        fieldsets.transaction.fields.add(fields.name);
        fieldsets.transaction.fields.add(fields.value);
        fieldsets.transaction.fields.add(fields.category);
        fieldsets.transaction.fields.add(fields.account);
        fieldsets.transaction.fields.add(fields.date);

        //fieldset.fields.add(fields.reminder);
        fieldsets.adittional.fields.add(fields.repetitions);
        fieldsets.adittional.fields.add(fields.recurrence);
        fieldsets.adittional.fields.add(fields.observation);

        app.ui.form.fieldsets.add(fieldsets.transaction);
        app.ui.form.fieldsets.add(fieldsets.adittional);

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
                    type : 'debt'
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
    app.ui.title("Adicionar despesa");
    app.ui.form.action("Adicionar!");

    app.models.category.list(function(categories) {
        app.models.account.list(function(accounts) {
            var selected = false;

            for (var i in categories) {
                if (categories.hasOwnProperty(i) && categories[i].type === 'debt') {
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