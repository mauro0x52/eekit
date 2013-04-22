/**
 * Diálogo para editar dados de uma conta
 *
 * @author Mauro Ribeiro
 * @since  2012-12
 *
 * @param id : id da conta a ser alterada
 */
app.routes.dialog('/editar-conta/:id', function (params, data) {

    /**
     * Cria o formulário
     *
     * @author : Mauro Ribeiro
     * @since : 2012-12
     */
    function form (account) {
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
        now = new Date(),

        /**
         * Data inicial
         */
        initialDate = new Date(account.initialDate);

        /* Inputs do formulário */
        fields.name = new app.ui.inputText({
            legend : 'Nome',
            type : 'text',
            name : 'name',
            value : account.name,
            rules : [{rule:/.{3,}/, message : 'campo obrigatório'}]
        });
        fields.bank = new app.ui.inputText({
            legend : 'Banco',
            type : 'text',
            name : 'bank',
            value : account.bank
        });
        fields.agency = new app.ui.inputText({
            legend : 'Número da agência',
            type : 'text',
            name : 'agency',
            value : account.agency,
            rules : [{rule:/[0-9\s\.\-]*/, message : 'formato inválido'}]
        });
        fields.account = new app.ui.inputText({
            legend : 'Número da conta',
            type : 'text',
            name : 'account',
            value : account.account,
            rules : [{rule:/[0-9\s\.\-]*/, message : 'formato inválido'}]
        });
        fields.initialBalance = new app.ui.inputText({
            legend : 'Balanço inicial',
            type : 'text',
            name : 'initialBalance',
            value : account.initialBalance.toString().replace('.', ','),
            rules : [{rule:/^\-?[0-9]+([\.\,][0-9]{2})?$/, message : 'valor inválido'}]
        });

        fieldset = new app.ui.fieldset({
            legend : 'Conta'
        });
        fieldset.fields.add([fields.name, fields.bank, fields.agency, fields.account, fields.initialDate, fields.initialBalance]);

        fields.name.focus();

        app.ui.form.fieldsets.add(fieldset);

        /* Controle de envio do form */
        app.ui.form.submit(function() {
            account.name = fields.name.value();
            account.bank = fields.bank.value();
            account.agency = fields.agency.value();
            account.account = fields.account.value();
            account.initialBalance = fields.initialBalance.value().replace(',', '.');
            account.save(function () {
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
    app.ui.title("Editar conta");
    app.ui.form.action("Editar!");

    app.models.account.find(params.id, function (account) {
        form(account);
    })
});