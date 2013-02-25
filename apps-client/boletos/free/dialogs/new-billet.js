/**
 * Diálogo para criar um boleto
 *
 * @author Mauro Ribeiro
 * @since  2013-02
 */
app.routes.dialog('/adicionar-boleto', function (params, data) {
    var request = data ? data : {};
    app.tracker.event('clicar: adicionar boleto');
console.log(request)
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
        walletsOptions,

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
            itau     : new app.ui.inputOption({ legend : 'Itaú', value : '341' }),
            bradesco : new app.ui.inputOption({ legend : 'Bradesco', value : '237' })
        }

        /* input com as carteiras */
        walletsOptions = {
            itau : {
                'wallet104' : new app.ui.inputOption({ legend : '104', value : '104' }),
                'wallet109' : new app.ui.inputOption({ legend : '109', value : '109' }),
                'wallet157' : new app.ui.inputOption({ legend : '157', value : '157' }),
                'wallet174' : new app.ui.inputOption({ legend : '174', value : '174' }),
                'wallet175' : new app.ui.inputOption({ legend : '175', value : '175', clicked : true }),
                'wallet178' : new app.ui.inputOption({ legend : '178', value : '178' })
            },
            bradesco : {
                'wallet06' : new app.ui.inputOption({ legend : '06', value : '06' }),
                'wallet03' : new app.ui.inputOption({ legend : '03', value : '03' })
            }
        }

        /* campos do recebedor */
        fields.receiver = new app.ui.inputText({
            legend : 'Sua razão social',
            name : 'receiver',
            rules : [{rule : /.{3,}/, message : 'campo obrigatório'}]
        });
        fields.cpfCnpj = new app.ui.inputText({
            legend : 'Seu cnpj',
            name : 'cpfCnpj',
            rules : [{rule : /\d\d\.?\d\d\d\.?\d\d\d\/?\d\d\d\d\-?\d\d/, message : 'formato inválido (ex: 12.345.678/9999-00'}]
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
            options : [banksOptions.itau, banksOptions.bradesco]
        });
        fields.agency = new app.ui.inputText({
            legend : 'Agência',
            name : 'agency',
            value : request.agency ? request.agency : '',
            rules : [{rule : /\d{4}/, message : 'formato inválido (ex: 1234)'}]
        });
        fields.account = new app.ui.inputText({
            legend : 'Conta corrente',
            name : 'account',
            value : request.account ? request.account : '',
            rules : [{rule : /\d{5}\-\d{1}/, message : 'formato inválido (ex: 12345-6)'}]
        });
        fields.wallet = new app.ui.inputSelector({
            type : 'single',
            name : 'wallet',
            legend : 'Carteira',
            options : [
                walletsOptions.itau.wallet104,
                walletsOptions.itau.wallet109,
                walletsOptions.itau.wallet157,
                walletsOptions.itau.wallet174,
                walletsOptions.itau.wallet175,
                walletsOptions.itau.wallet178,

                walletsOptions.bradesco.wallet06,
                walletsOptions.bradesco.wallet03
            ],
            filterable : true
        });
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
                bankId : fields.bankId.value()[0],
                agency : fields.agency.value(),
                account : fields.account.value().split('-')[0],
                accountVD : fields.account.value().split('-')[1],
                wallet : fields.wallet.value()[0],
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