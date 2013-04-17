/**
 * Diálogo para editar dados de uma transação
 *
 * @author Mauro Ribeiro
 * @since  2012-12
 *
 * @param id : id da transação a ser alterada
 */
app.routes.dialog('/editar-transacao/:id', function (params, data) {

    /**
     * Cria o formulário
     *
     * @author : Mauro Ribeiro
     * @since : 2012-12
     *
     * @param categories : lista de categorias
     * @param accounts : lista de contas
     * @param transaction : transação a ser alterada
     */
    function form (categories, accounts, transaction) {

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
         * Data da transação
         */
        date = new Date(transaction.date);

        /* Input com as categorias */
        if (!transaction.isTransfer) {
            for (var i in categories) {
                if (categories.hasOwnProperty(i) && categories[i].type === transaction.type) {
                    categoriesOptions.push(new app.ui.inputOption({
                        legend : categories[i].name,
                        value : categories[i]._id,
                        clicked : categories[i]._id === transaction.category
                    }));
                }
            }
        }

        /* Input com as contas */
        for (var i in accounts) {
            if (accounts.hasOwnProperty(i)) {
                accountsOptions.push(new app.ui.inputOption({
                    legend : accounts[i].name,
                    value : accounts[i]._id,
                    clicked : accounts[i]._id === transaction.account
                }));
            }
        }

        transaction.value = transaction.value.toString().replace(',', '.')

        /* Inputs do formulário */
        if (!transaction.isTransfer) {
            fields.name = new app.ui.inputText({
                legend : 'Nome',
                type : 'text',
                name : 'name',
                value : transaction.name,
                rules : [{rule:/.{3,}/, message : 'campo obrigatório'}]
            });
        }
        fields.value = new app.ui.inputText({
            legend : 'Valor',
            type : 'text',
            name : 'value',
            value : parseFloat(transaction.value.replace(',', '.')).toFixed(2).toString().replace('.', ','),
            rules : [{rule:/^[0-9]+([\.\,][0-9]{2})?$/, message : 'valor inválido'}]
        });
        if (!transaction.isTransfer) {
            fields.category = new app.ui.inputSelector({
                type : 'single',
                name : 'category',
                legend : 'Categoria',
                options : categoriesOptions,
                filterable : true
            });
        }
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
        fields.observation = new app.ui.inputTextarea({
            legend : 'Observações',
            type : 'text',
            value : transaction.observation,
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
        fieldset.fields.add(fields.observation);

        app.ui.form.fieldsets.add(fieldset);

        if (!transaction.isTransfer) {
            fields.name.focus();
        } else {
            fields.value.focus();
        }

        /* Controle de envio do form */
        app.ui.form.submit(function() {
            transaction.value = fields.value.value().replace(',', '.');
            transaction.account = fields.account.value()[0];
            transaction.date = fields.date.value() ? fields.date.date() : null;
            transaction.observation = fields.observation.value();

            if (!transaction.isTransfer) {
                transaction.name = fields.name.value();
                transaction.category = fields.category.value()[0];
            } else {
                transaction.category = undefined;
            }

            transaction.save(function () {
                app.events.trigger('update transaction ' + params.id, transaction);
                app.close(transaction);
            });
        });

    } // end form()

    /**
     * Monta o diálogo
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     */
    app.ui.title("Editar transação");
    app.ui.form.action("Editar!");

    app.models.category.list(function (categories) {
        app.models.account.list(function (accounts) {
            app.models.transaction.find(params.id, function (transaction) {
                form(categories, accounts, transaction);
            });
        });
    });
});