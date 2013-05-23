/**
 * Diálogo para criar um boleto
 *
 * @author Mauro Ribeiro
 * @since  2013-02
 */
app.routes.dialog('/adicionar-boleto', function (params, data) {
    var request = data ? data : {};

    app.event('clicar: adicionar boleto');

    /**
     * Monta o formulário
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    function form () {
        var
        /**
         * Campos do formulário
         */
        fields = {},

        /**
         * Lista de ui.option de bancos
         */
        banksOptions = {},

        /**
         * Lista de ui.option de carteiras
         */
        walletsOptions, walletsArray = [],

        /**
         * Fieldset
         */
        fieldsets = {},

        /**
         * Bancos
         */
        banks = app.models.banks;

        /* input com os bancos */
        for (var i in banks) {
            banksOptions[i] = new app.ui.inputOption({
                legend : banks[i].name,
                value : banks[i].slug
            })
        }

        fields.bankId = new app.ui.inputSelector({
            type : 'single',
            name : 'bankId',
            legend : 'Escolha um banco',
            options : [banksOptions.bb, banksOptions.bradesco, banksOptions.caixa, banksOptions.itau],
            change : function () {
                app.ui.form.action("Gerar boleto")
            }
        });

        fieldsets.bank = new app.ui.fieldset({
            legend : 'Banco'
        });

        fieldsets.bank.fields.add([fields.bankId]);

        app.ui.form.fieldsets.add(fieldsets.bank);

        /* Controle de envio do form */
        app.ui.form.submit(function() {
            var bankSlug = fields.bankId.value()[0];
            app.open({
                app : app.slug,
                route : '/boleto/'+bankSlug+'/novo'
            });
            app.close();
        });

    } // end form()

    /**
     * Monta o diálogo
     *
     * @author Mauro Ribeiro
     * @since  2013-02
     */
    app.ui.title("Gerar boleto");
    app.ui.form.action("Escolher banco");

    form();
});