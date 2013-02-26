/**
 * Diálogo para adicionar nova conta
 *
 * @author Mauro Ribeiro
 * @since  2012-12
 */
app.routes.dialog('/adicionar-conta', function (params, data) {

    /**
     * Cria o formulário
     *
     * @author : Mauro Ribeiro
     * @since : 2012-12
     */
    function form () {
        var
        /**
         * Campos do formulário
         */
        fields = {},

        /**
         * Fieldset ui.fieldset principal do formulário
         */
        fieldset,

        /**
         * Agora
         */
        now = new Date();

        /* Inputs do formulário */
        fields.name = new app.ui.inputText({
            legend : 'Nome',
            type : 'text',
            name : 'name',
            rules : [{rule:/.{3,}/, message : 'campo obrigatório'}]
        });
        fields.bank = new app.ui.inputText({
            legend : 'Banco',
            type : 'text',
            name : 'bank'
        });
        fields.agency = new app.ui.inputText({
            legend : 'Número da agência',
            type : 'text',
            name : 'agency',
            rules : [{rule:/[0-9\s\.\-]*/, message : 'formato inválido'}]
        });
        fields.account = new app.ui.inputText({
            legend : 'Número da conta',
            type : 'text',
            name : 'bank',
            rules : [{rule:/[0-9\s\.\-]*/, message : 'formato inválido'}]
        });
        fields.initialBalance = new app.ui.inputText({
            legend : 'Saldo inicial',
            type : 'text',
            name : 'initialBalance',
            rules : [{rule:/^\-?[0-9]+([\,][0-9]{2})?$/, message : 'valor inválido'}]
        });

        fieldset = new app.ui.fieldset({
            legend : 'Conta'
        });
        fieldset.fields.add([fields.name, fields.bank, fields.agency, fields.account, fields.initialBalance]);

        app.ui.form.fieldsets.add(fieldset);

        fields.name.focus();

        /* Controle de envio do form */
        app.ui.form.submit(function() {
            var data = {
                name : fields.name.value(),
                bank : fields.bank.value(),
                agency : fields.agency.value(),
                account : fields.account.value(),
                initialBalance : fields.initialBalance.value().replace(',', '.')
            };
            var account = new app.models.account(data);
            account.save(function () {
                app.events.trigger('create account', account);
                app.close(account);
            });
        });

    } // end form()

    /**
     * Monta o diálogo
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     */
    app.ui.title("Adicionar conta");
    app.ui.form.action("Adicionar!");

    form();
});