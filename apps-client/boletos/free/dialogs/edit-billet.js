/**
 * Diálogo para editar um boleto
 *
 * @author Mauro Ribeiro
 * @since  2013-02
 */
app.routes.dialog('/editar-boleto/:id', function (params, data) {
    var request = data ? data : {};

    /**
     * Monta o formulário
     *
     * @author Mauro Ribeiro
     * @since  2013-04
     *
     * @param  billet: boleto a ser alterado
     */
    function form (billet) {
        var
        /**
         * Campos do formulário
         */
        fields = {},

        /**
         * Lista de ui.option de bancos
         */
        banksOptions,

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

        /**
         * Coisas para se fazer quando seleciona um banco
         *
         * @author Mauro Ribeiro
         * @since  2013-02
         *
         * @param bank : id do banco
         */
        selectBank = function(bank) {
            var banks = {
                '001' : 'bb',
                '104' : 'caixa',
                '237' : 'bradesco',
                '341' : 'itau'
            }
            if (bank === '001') {
                fields.agreement.visibility('show');
            } else {
                fields.agreement.visibility('hide');
            }

            for (var i in walletsOptions) {
                if (i.indexOf(banks[bank]) === -1) {
                    walletsOptions[i].visibility('hide');
                } else {
                    walletsOptions[i].visibility('show');
                }
            }
        }

        creationDate = new Date();

        if (request.dueDate) {
            dueDate = new Date(request.dueDate);
        } else {
            if ((creationDate.getDay() + dueDays)%7 === 0) sumWeekend = 1;
            else if ((creationDate.getDay() + dueDays)%7 === 6) sumWeekend = 2;
            dueDate = new Date(creationDate.getFullYear(), creationDate.getMonth(), creationDate.getDate() + 2 + sumWeekend);
        }

        /* input com os bancos */
        banksOptions = {
            bb : new app.ui.inputOption({ legend : 'Banco do Brasil', value : '001', click : billet.bankId === '001' }),
            bradesco : new app.ui.inputOption({ legend : 'Bradesco', value : '237', click : billet.bankId === '247' }),
            caixa : new app.ui.inputOption({ legend : 'Caixa', value : '104' , click : billet.bankId === '104' }),
            itau     : new app.ui.inputOption({ legend : 'Itaú', value : '341', click : billet.bankId === '341' })
        }

        /* input com os bancos */
        walletsOptions = {
            bb18        : new app.ui.inputOption({ legend : '18', value : '18', click : billet.wallet === '18' }),
            bradesco06  : new app.ui.inputOption({ legend : '06', value : '06', click : billet.wallet === '06' }),
            caixaSIGCB  : new app.ui.inputOption({ legend : 'SIGCB - sem registro', value : 'sigcb', click : billet.wallet === 'sigcb' }),
            itau175     : new app.ui.inputOption({ legend : '175', value : '175', click : billet.wallet === '175' })
        }

        /* campos do recebedor */
        fields.receiver = new app.ui.inputText({
            legend : 'Sua razão social',
            name : 'receiver',
            rules : [{rule : /^.{3,}$/, message : 'campo obrigatório'}],
            value : billet.receiver
        });
        fields.cpfCnpj = new app.ui.inputText({
            legend : 'Seu cnpj',
            name : 'cpfCnpj',
            rules : [{rule : /^\d\d\.?\d\d\d\.?\d\d\d\/?\d\d\d\d\-?\d\d$/, message : 'ex: 12.345.678/9999-00'}],
            value : billet.cpfCnpj
        });
        fields.bankId = new app.ui.inputSelector({
            type : 'single',
            name : 'bankId',
            legend : 'Banco',
            filterable : true,
            options : [banksOptions.bb, banksOptions.bradesco, banksOptions.caixa, banksOptions.itau],
            change : function (value) {
                selectBank(fields.bankId.value()[0]);
            }
        });

        fieldsets.receiver = new app.ui.fieldset({
            legend : 'Recebedor'
        });
        fieldsets.receiver.fields.add([
            fields.receiver,
            fields.cpfCnpj,
            fields.bankId
        ]);

        /* dados bancários */
        fields.agency = new app.ui.inputText({
            legend : 'Agência',
            name : 'agency',
            value : request.agency ? request.agency : '',
            rules : [{rule : /^\d{4}(\-[0-9x]{1})?$/, message : 'agência inválida'}],
            value : billet.agency
        });
        fields.account = new app.ui.inputText({
            legend : 'Conta corrente',
            name : 'account',
            value : request.account ? request.account : '',
            rules : [{rule : /^\d{5,8}(\-[0-9x]{1})?$/, message : 'conta inválida'}],
            value : billet.account
        });
        for (var i in walletsOptions) {
            walletsOptions[i].visibility('hide');
            walletsArray.push(walletsOptions[i]);
        }
        fields.wallet = new app.ui.inputSelector({
            type : 'single',
            name : 'wallet',
            legend : 'Carteira',
            filterable : true,
            options : walletsArray
        });
        fields.agreement = new app.ui.inputText({
            name : 'agreement',
            legend : 'Convênio (com 0`s)',
            rules : [{rule : /(^$)|(^\d{6,8}$)/, message : 'formato inválido'}],
            value : billet.agreement
        });

        fields.value = new app.ui.inputText({
            legend : 'Valor (R$)',
            name : 'value',
            rules : [{rule:/^[0-9]{1,8}([\.\,][0-9]{2})?$/, message : 'valor inválido'}],
            value : billet.value
        });

        fieldsets.bank = new app.ui.fieldset({
            legend : 'Dados bancários'
        });
        fieldsets.bank.fields.add([
            fields.agency,
            fields.account,
            fields.wallet,
            fields.agreement,
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
            name : 'clientName',
            value : billet.clientName
        });
        fields.demonstrative = new app.ui.inputTextarea({
            legend : 'Demonstrativo',
            name : 'demonstrative',
            value : billet.demonstrative
        });
        fields.instructions = new app.ui.inputTextarea({
            legend : 'Instruções ao caixa',
            name : 'instructions',
            value : billet.instructions
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
            /* recebedor */
            billet.receiver = fields.receiver.value();
            billet.cpfCnpj = fields.cpfCnpj.value();
            /* banco */
            billet.bankId = fields.bankId.value()[0];
            billet.agency = fields.agency.value().split('-')[0];
            billet.account = fields.account.value().split('-')[0];
            billet.accountVD = fields.account.value().split('-')[1];
            billet.wallet = fields.wallet.value()[0];
            billet.agreement = fields.agreement.value();
            billet.value = fields.value.value().replace(',','.');
            /* datas */
            billet.creationDate = fields.creationDate.date();
            billet.dueDate = fields.dueDate.date();
            /* cliente */
            billet.clientName = fields.clientName.value();
            billet.demonstrative = fields.demonstrative.value();
            billet.instructions = fields.instructions.value();
            if (billet.value.indexOf('.') === -1) {
                billet.value += '.00';
            }
            if (!billet.bankId) {
                app.ui.error('Escolha um banco');
            } else if (!billet.wallet) {
                app.ui.error('Escolha uma carteira');
            } else {
                billet.save(function() {
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
    app.ui.title("Gerar boleto");

    app.models.billet.find(params.id, function (billet) {
        form(billet);
    });
});