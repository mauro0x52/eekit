/**
 * Diálogo para criar ou editar um boleto
 *
 * @author Mauro Ribeiro
 * @since  2013-02
 */
app.routes.dialog('/boleto/bradesco/:id', function (params, data) {
    var request = data ? data : {},
        bankId = app.models.banks.bradesco.id,
        newBillet = (params.id === 'novo') ? true : false;

    /**
     * Monta o formulário
     *
     * @author Mauro Ribeiro
     * @since  2012-11
     *
     * @param  categories : lista de categorias do usuário
     */
    function form (billet) {
        var
        /**
         * Campos do formulário
         */
        fields = {},

        /**
         * Lista de ui.option de carteiras
         */
        walletsOptions, walletsArray = [],

        /**
         * Fieldset
         */
        fieldsets = {},

        /**
         * Data atual
         */
        creationDate,

        /**
         * Data de vencimento
         */
        dueDate,

        /**
         * Dias de prazo padrão
         */
        dueDays = 3,

        /**
         * Para fugir do final de semana
         */
        sumWeekend = 0;

        billet = billet ? billet : {};

        creationDate = billet.creationDate? new Date(billet.creationDate) : new Date();

        if (request.dueDate) {
            dueDate = new Date(request.dueDate);
        } else if (billet.dueDate) {
            dueDate = new Date(billet.dueDate);
        } else {
            if ((creationDate.getDay() + dueDays)%7 === 0) sumWeekend = 1;
            else if ((creationDate.getDay() + dueDays)%7 === 6) sumWeekend = 2;
            dueDate = new Date(creationDate.getFullYear(), creationDate.getMonth(), creationDate.getDate() + 2 + sumWeekend);
        }

        /* input com os bancos */
        walletsOptions = {
            bradesco06 : new app.ui.inputOption({ legend : '06 - sem registro', value : '06', click : true })
        }

        /* campos do recebedor */
        fields.receiver = new app.ui.inputText({
            legend : 'Seu nome ou razão social',
            name : 'receiver',
            rules : [{rule : /^.{3,}$/, message : 'campo obrigatório'}],
            value : billet.receiver ? billet.receiver : ''
        });
        fields.cpfCnpj = new app.ui.inputText({
            legend : 'Seu CNPJ ou CPF',
            name : 'cpfCnpj',
            rules : [{rule : /^((\d\d\d\.?\d\d\d\.?\d\d\d\-?\d\d)|(\d\d\.?\d\d\d\.?\d\d\d\/?\d\d\d\d\-?\d\d))$/, message : 'CPF ou CNPJ inválido'}],
            value : billet.cpfCnpj ? billet.cpfCnpj : ''
        });

        fieldsets.receiver = new app.ui.fieldset({
            legend : 'Cedente'
        });

        fieldsets.receiver.fields.add([
            fields.receiver,
            fields.cpfCnpj
        ]);

        /* dados bancários */
        for (var i in walletsOptions) {
            walletsArray.push(walletsOptions[i]);
        }
        fields.wallet = new app.ui.inputSelector({
            type : 'single',
            name : 'wallet',
            legend : 'Carteira',
            filterable : true,
            options : walletsArray
        });
        fields.agency = new app.ui.inputText({
            legend : 'Agência',
            name : 'agency',
            value : request.agency ? request.agency : '',
            rules : [{rule : /^\d{4}(\-[0-9x]{1})?$/, message : 'agência inválida'}],
            value : billet.agency ? billet.agency : ''
        });
        fields.account = new app.ui.inputText({
            legend : 'Conta corrente',
            name : 'account',
            value : request.account ? request.account : '',
            rules : [{rule : /^\d{7}(\-[0-9x]{1})?$/, message : 'conta inválida'}],
            value : billet.account ? billet.account : ''
        });
        fields.value = new app.ui.inputText({
            legend : 'Valor (R$)',
            name : 'value',
            value : request.value ? request.value : '',
            rules : [{rule:/^[0-9]{1,8}([\.\,][0-9]{2})?$/, message : 'valor inválido'}],
            value : billet.value ? billet.value.toString().replace('.',',') : ''
        });

        fieldsets.bank = new app.ui.fieldset({
            legend : 'Dados bancários'
        });
        fieldsets.bank.fields.add([
            fields.wallet,
            fields.agency,
            fields.account,
            fields.value
        ]);

        /* campos de datas */
        fields.creationDate = new app.ui.inputDate({
            legend : 'Data de emissão',
            type : 'date',
            name : 'creationDate',
            value : parseInt(creationDate.getDate()) + '/' + parseInt(creationDate.getMonth() + 1) + '/' + creationDate.getFullYear()
        });
        fields.dueDate = new app.ui.inputDate({
            legend : 'Data de vencimento',
            type : 'date',
            name : 'dueDate',
            value : parseInt(dueDate.getDate()) + '/' + parseInt(dueDate.getMonth() + 1) + '/' + dueDate.getFullYear()
        });

        fieldsets.dates = new app.ui.fieldset({
            legend : 'Datas'
        });
        fieldsets.dates.fields.add([
            fields.creationDate,
            fields.dueDate
        ]);

        /* campos do cliente */
        fields.clientName = new app.ui.inputText({
            legend : 'Nome do cliente',
            name : 'clientName'
        });
        fields.demonstrative = new app.ui.inputTextarea({
            legend : 'Demonstrativo',
            name : 'demonstrative',
            value : '- Boleto emitido pelo empreendekit.com.br'
        });
        fields.instructions = new app.ui.inputTextarea({
            legend : 'Instruções ao caixa',
            name : 'instructions',
            value : '- Não aceitar após o vencimento.\n- Boleto emitido pelo empreendekit.com.br'
        });

        fieldsets.client = new app.ui.fieldset({
            legend : 'Cliente'
        });
        fieldsets.client.fields.add([
            fields.clientName,
            fields.demonstrative,
            fields.instructions
        ]);

        app.ui.form.fieldsets.add(fieldsets.receiver);
        app.ui.form.fieldsets.add(fieldsets.bank);
        app.ui.form.fieldsets.add(fieldsets.dates);
        app.ui.form.fieldsets.add(fieldsets.client);

        fields.receiver.focus();

        /* Controle de envio do form */
        app.ui.form.submit(function() {
            if (newBillet) {
                var billet = new app.models.billet({
                    /* recebedor */
                    bankId : bankId,
                    receiver : fields.receiver.value(),
                    cpfCnpj : fields.cpfCnpj.value(),
                    /* banco */
                    agency : fields.agency.value().split('-')[0],
                    account : fields.account.value().split('-')[0],
                    accountVD : fields.account.value().split('-')[1],
                    wallet : fields.wallet.value()[0],
                    value : fields.value.value().replace(',','.'),
                    /* datas */
                    creationDate : fields.creationDate.date(),
                    dueDate : fields.dueDate.date(),
                    /* cliente */
                    clientName : fields.clientName.value(),
                    demonstrative : fields.demonstrative.value(),
                    instructions : fields.instructions.value()
                });
                billet.save(function() {
                    app.trigger('create billet', billet);
                    app.routes.redirect('http://' + app.config.services.billets.host + ':' + app.config.services.billets.port + '/billet/'+billet._id+'/print/'+billet.ourNumber);
                    app.close();
                });
            } else {
                /* recebedor */
                billet.receiver = fields.receiver.value();
                billet.cpfCnpj = fields.cpfCnpj.value();
                /* banco */
                billet.bankId = fields.bankId.value()[0];
                billet.agency = fields.agency.value().split('-')[0];
                billet.account = fields.account.value().split('-')[0];
                billet.accountVD = fields.account.value().split('-')[1];
                billet.wallet = fields.wallet.value()[0];
                billet.value = fields.value.value().replace(',','.');
                /* datas */
                billet.creationDate = fields.creationDate.date();
                billet.dueDate = fields.dueDate.date();
                /* cliente */
                billet.clientName = fields.clientName.value();
                billet.demonstrative = fields.demonstrative.value();
                billet.instructions = fields.instructions.value();
                billet.save(function() {
                    app.trigger('update billet ' + billet._id, billet);
                    app.close();
                });
            }
        });

    } // end form()

    /**
     * Monta o diálogo
     *
     * @author Mauro Ribeiro
     * @since  2013-02
     */
    app.ui.title("Boleto Bradesco");

    if (newBillet) {
        form();
    } else {
        app.models.billet.find(params.id, function (billet) {
            form(billet);
        });
    }
});