/**
 * Diálogo para criar um boleto
 *
 * @author Mauro Ribeiro
 * @since  2013-02
 */
app.routes.dialog('/adicionar-boleto', function (params, data) {
    var request = data ? data : {};

    app.tracker.event('clicar: adicionar boleto');
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
                '237' : 'bradesco',
                '341' : 'itau'
            }
            if (bank === '001') {
                fields.agreement.visibility('show');
            } else {
                fields.agreement.visibility('hide');
            }

            for (var i in walletsOptions) {
                console.log(banks[bank]+'-'+i)
                if (i.indexOf(banks[bank]) === -1) {
                    console.log(i+'hide')
                    walletsOptions[i].visibility('hide');
                } else {
                    console.log(i+'show')
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
            bb : new app.ui.inputOption({ legend : 'Banco do Brasil', value : '001' }),
            bradesco : new app.ui.inputOption({ legend : 'Bradesco', value : '237' }),
            itau     : new app.ui.inputOption({ legend : 'Itaú', value : '341' })
        }

        /* input com os bancos */
        walletsOptions = {
            bb18        : new app.ui.inputOption({ legend : '18', value : '18' }),
            bradesco03  : new app.ui.inputOption({ legend : '03', value : '03' }),
            bradesco06  : new app.ui.inputOption({ legend : '06', value : '06' }),
            bradesco09  : new app.ui.inputOption({ legend : '09', value : '09' }),
            itau104     : new app.ui.inputOption({ legend : '104', value : '104' }),
            itau109     : new app.ui.inputOption({ legend : '109', value : '109' }),
            itau157     : new app.ui.inputOption({ legend : '157', value : '157' }),
            itau175     : new app.ui.inputOption({ legend : '175', value : '175' }),
            itau174     : new app.ui.inputOption({ legend : '174', value : '174' }),
            itau178     : new app.ui.inputOption({ legend : '178', value : '178' })
        }

        /* campos do recebedor */
        fields.receiver = new app.ui.inputText({
            legend : 'Sua razão social',
            name : 'receiver',
            rules : [{rule : /^.{3,}$/, message : 'campo obrigatório'}]
        });
        fields.cpfCnpj = new app.ui.inputText({
            legend : 'Seu cnpj',
            name : 'cpfCnpj',
            rules : [{rule : /^\d\d\.?\d\d\d\.?\d\d\d\/?\d\d\d\d\-?\d\d$/, message : 'ex: 12.345.678/9999-00'}]
        });

        fieldsets.receiver = new app.ui.fieldset({
            legend : 'Recebedor'
        });
        fieldsets.receiver.fields.add([
            fields.receiver,
            fields.cpfCnpj
        ]);

        /* dados bancários */
        fields.bankId = new app.ui.inputSelector({
            type : 'single',
            name : 'bankId',
            legend : 'Banco',
            options : [banksOptions.itau, banksOptions.bradesco, banksOptions.bb],
            change : function (value) {
                selectBank(fields.bankId.value()[0]);
            }
        });
        fields.agency = new app.ui.inputText({
            legend : 'Agência',
            name : 'agency',
            value : request.agency ? request.agency : '',
            rules : [{rule : /^\d{4}$/, message : 'formato inválido (ex: 1234)'}]
        });
        fields.account = new app.ui.inputText({
            legend : 'Conta corrente',
            name : 'account',
            value : request.account ? request.account : '',
            rules : [{rule : /^\d{5}(\-\d{1})?$/, message : 'formato inválido (ex: 12345-6)'}]
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
            rules : [{rule : /(^$)|(^\d{6,8}$)/, message : 'formato inválido'}]
        });
        fields.agreement.visibility('hide');
        fields.value = new app.ui.inputText({
            legend : 'Valor (R$)',
            name : 'value',
            value : request.value ? request.value : '',
            rules : [{rule:/^[0-9]{1,8}([\.\,][0-9]{2})?$/, message : 'valor inválido'}]
        });

        fieldsets.bank = new app.ui.fieldset({
            legend : 'Dados bancários'
        });
        fieldsets.bank.fields.add([
            fields.bankId,
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
            name : 'clientName'
        });
        fields.demonstrative = new app.ui.inputText({
            legend : 'Demonstrativo',
            name : 'demonstrative'
        });
        fields.instructions = new app.ui.inputText({
            legend : 'Instruções ao caixa',
            name : 'instructions',
            value : 'Não aceitar após o vencimento.'
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
            var data = {
                /* recebedor */
                receiver : fields.receiver.value(),
                cpfCnpj : fields.cpfCnpj.value(),
                /* banco */
                bankId : fields.bankId.value()[0],
                agency : fields.agency.value(),
                account : fields.account.value().split('-')[0],
                accountVD : fields.account.value().split('-')[1],
                wallet : fields.wallet.value()[0],
                agreement : fields.agreement.value(),
                value : fields.value.value(),
                /* datas */
                creationDate : fields.creationDate.date(),
                dueDate : fields.dueDate.date(),
                /* cliente */
                clientName : fields.clientName.value(),
                demonstrative : fields.demonstrative.value(),
                instructions : fields.instructions.value()
            }
            if (data.value.indexOf(',') === -1) {
                data.value += '.00';
            }
            if (!data.bankId) {
                app.ui.error('Escolha um banco');
            } else if (!data.wallet) {
                app.ui.error('Escolha uma carteira');
            } else {
                app.routes.redirect('http://' + app.config.services.billets.host + ':' + app.config.services.billets.port + '/billet', data);
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

    form();
});