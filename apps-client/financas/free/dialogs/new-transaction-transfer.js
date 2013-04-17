/**
 * Diálogo para adicionar duas transações do tipo transferência
 *
 * @author Mauro Ribeiro
 * @since  2012-12
 *
 * @param data {date : date} data padrão
 */
app.routes.dialog('/adicionar-transferencia', function (params, data) {
    var request = data ? data : {};

    /**
     * Cria o formulário
     *
     * @author : Mauro Ribeiro
     * @since : 2012-12
     *
     * @param accounts : lista de contas
     */
    function form (accounts) {
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
         * Lista de contas
         */
        sourceAccountsOptions = [],

        /**
         * Lista de contas
         */
        destinyAccountsOptions = [];

        /* Input com as contas */
        for (var i in accounts) {
            if (accounts.hasOwnProperty(i)) {
                sourceAccountsOptions.push(new app.ui.inputOption({
                    legend : accounts[i].name,
                    value : accounts[i]._id,
                    clicked : parseInt(i) === 0
                }));
                destinyAccountsOptions.push(new app.ui.inputOption({
                    legend : accounts[i].name,
                    value : accounts[i]._id,
                    clicked : accounts.hasOwnProperty(1) ? parseInt(i) === 1 : parseInt(i) === 0
                }));
            }
        }

        /* Input com as frequencias */
        recurrenceOptions.push(new app.ui.inputOption({legend : 'diariamente', value : '1'}));
        recurrenceOptions.push(new app.ui.inputOption({legend : 'semanalmente', value : '7'}));
        recurrenceOptions.push(new app.ui.inputOption({legend : 'quinzenalmente', value : '14'}));
        recurrenceOptions.push(new app.ui.inputOption({legend : 'mensalmente', value : '30'}));

        /* Inputs do formulário */
        fields.value = new app.ui.inputText({
            legend : 'Valor',
            type : 'text',
            name : 'value',
            rules : [{rule:/^[0-9]+([\.\,][0-9]{2})?$/, message : 'valor inválido'}]
        });
        fields.sourceAccount = new app.ui.inputSelector({
            type : 'single',
            name : 'account',
            legend : 'De',
            options : sourceAccountsOptions
        });
        fields.destinyAccount = new app.ui.inputSelector({
            type : 'single',
            name : 'account',
            legend : 'Para',
            options : destinyAccountsOptions
        });
        fields.date = new app.ui.inputDate({
            legend : 'Data',
            type : 'date',
            name : 'date',
            value : parseInt(date.getDate()) + '/' + parseInt(date.getMonth() + 1) + '/' + date.getFullYear()
        });
        fields.observation = new app.ui.inputTextarea({
            legend : 'Observações',
            type : 'text',
            name : 'observation'
        });

        fieldset = new app.ui.fieldset({
            legend : 'Transação'
        });
        fieldset.fields.add(fields.value);
        fieldset.fields.add(fields.sourceAccount);
        fieldset.fields.add(fields.destinyAccount);
        fieldset.fields.add(fields.date);
        fieldset.fields.add(fields.observation);

        app.ui.form.fieldsets.add(fieldset);

        fields.value.focus();

        /* Controle de envio do form */
        app.ui.form.submit(function() {
            var source = new app.models.transaction({
                name : 'Transferência',
                value : fields.value.value().replace(',', '.'),
                account : fields.sourceAccount.value()[0],
                date : fields.date.value() ? fields.date.date() : null,
                observation : fields.observation.value(),
                type : 'debt',
                isTransfer : true
            });
            var destiny = new app.models.transaction({
                name : 'Transferência',
                value : fields.value.value().replace(',', '.'),
                account : fields.destinyAccount.value()[0],
                date : fields.date.value() ? fields.date.date() : null,
                observation : fields.observation.value(),
                type : 'credit',
                isTransfer : true
            });

            source.save(function () {
                destiny.save(function () {
                    app.events.trigger('create transaction', source);
                    app.events.trigger('create transaction', destiny);
                    app.close({ source : source, destiny : destiny});
                });
            });
        });

    } // end form()

    /**
     * Avisa mensagem e fecha
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     */
    function message () {
        app.ui.description('Você precisa ter contas cadastradas.');
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
    app.ui.title("Adicionar transferência");
    app.ui.form.action("Adicionar!");

    app.models.account.list(function(accounts) {
        if (accounts.length) {
            form(accounts);
        } else {
            message();
        }
    });
});