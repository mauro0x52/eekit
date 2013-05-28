/**
 * Informações de um boleto
 *
 * @author Mauro Ribeiro
 * @since  2012-12
 *
 * @param  params.id : id do boleto
 */
app.routes.entity('/boleto/:id', function (params, data) {

    var
    /*
     * Classe que representa o boleto
     */
    Entity;

    Entity = function (data) {
        var that = this,
            billet = new app.models.billet(data),
            actions,
            fields,
            fieldsets;

        /* Conjuntos de campos */
        fieldsets = {
            company : new app.ui.dataset({legend : 'Empresa'}),
            bank  : new app.ui.dataset({legend : 'Dados bancários'}),
            date  : new app.ui.dataset({legend : 'Datas'}),
            client  : new app.ui.dataset({legend : 'Cliente'})
        };
        app.ui.datasets.add([fieldsets.company, fieldsets.bank, fieldsets.date, fieldsets.client]);


        /* Campos de dados */
        fields = {
            receiver : new app.ui.data({legend : 'Sua razão social'}),
            cpfCnpj  : new app.ui.data({legend : 'Seu CNPJ'}),
            bank  : new app.ui.data({legend : 'Banco'}),
            wallet  : new app.ui.data({legend : 'Carteira'}),
            agency  : new app.ui.data({legend : 'Agência'}),
            account  : new app.ui.data({legend : 'Conta'}),
            local  : new app.ui.data({legend : 'Local de pagamento'}),
            ourNumber  : new app.ui.data({legend : 'Nosso número'}),
            dueDate  : new app.ui.data({legend : 'Vencimento'}),
            creationDate  : new app.ui.data({legend : 'Criação'}),
            instructions  : new app.ui.data({legend : 'Instruções'}),
            value  : new app.ui.data({legend : 'Valor'}),
            clientName  : new app.ui.data({legend : 'Cliente'}),
            clientAddress  : new app.ui.data({legend : 'Endereço'}),
            clientCity  : new app.ui.data({legend : 'Cidade'}),
            clientState  : new app.ui.data({legend : 'Estado'}),
            clientZipCode  : new app.ui.data({legend : 'CEP'}),
            demonstrative  : new app.ui.data({legend : 'Demonstrativo'})
        };

        fieldsets.company.fields.add([fields.receiver, fields.cpfCnpj]);
        fieldsets.bank.fields.add([fields.bank, fields.wallet, fields.agency, fields.account, fields.ourNumber, fields.value]);
        fieldsets.date.fields.add([fields.creationDate, fields.dueDate]);
        fieldsets.client.fields.add([fields.local, fields.demonstrative, fields.instructions, fields.clientName]);

        /* Botões do item */
        actions = {
            print : new app.ui.action({
                legend : 'imprimir boleto',
                tip    : 'exibir versão impressa deste boleto',
                image  : 'download',
                href   : 'http://' + app.config.services.billets.host + ':' + app.config.services.billets.port + '/billet/'+billet._id+'/print/'+billet.ourNumber
            }),
            edit         : new app.ui.action({
                legend : 'editar boleto',
                tip    : 'editar os dados deste boleto',
                image  : 'pencil',
                click  : function() {
                    app.open({app : app.slug(), route : '/editar-boleto/' + billet._id});
                }
            }),
            remove       : new app.ui.action({
                legend : 'remover boleto',
                tip    : 'remover este boleto da minha lista',
                image  : 'trash',
                click  : function() {
                    app.open({app : app.slug(), route : '/remover-boleto/' + billet._id});
                }
            })
        };
        app.ui.actions.add([actions.print, actions.remove, actions.edit]);

        /* Imprime os valores */
        this.print = function (billet) {
            dateFormat = function (value) {
                var date = new Date(value),
                    daysNames = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
                    monthsNames = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

                return daysNames[date.getDay()]  + ', ' + date.getDate() + ' de ' + monthsNames[date.getMonth()] + ' de ' + date.getFullYear();
            };

            app.ui.title('Boleto: ' + billet.ourNumber);

            fields.bank.values.remove();
            fields.bank.values.add(new app.ui.value({value : billet.bank + ' (' + billet.bankId + ')'}));

            fields.wallet.values.remove();
            fields.wallet.values.add(new app.ui.value({value : billet.wallet}));

            fields.receiver.values.remove();
            fields.receiver.values.add(new app.ui.value({value : billet.receiver}));

            fields.cpfCnpj.values.remove();
            fields.cpfCnpj.values.add(new app.ui.value({value : billet.cpfCnpj}));

            fields.agency.values.remove();
            fields.agency.values.add(new app.ui.value({value : billet.agency}));

            fields.account.values.remove();
            fields.account.values.add(new app.ui.value({value : billet.account}));

            fields.local.values.remove();
            fields.local.values.add(new app.ui.value({value : billet.local}));

            fields.ourNumber.values.remove();
            fields.ourNumber.values.add(new app.ui.value({value : billet.ourNumber}));

            fields.dueDate.values.remove();
            fields.dueDate.values.add(new app.ui.value({value : dateFormat(billet.dueDate)}));

            fields.creationDate.values.remove();
            fields.creationDate.values.add(new app.ui.value({value : dateFormat(billet.creationDate)}));

            fields.instructions.values.remove();
            fields.instructions.values.add(new app.ui.value({value : billet.instructions}));

            fields.value.values.remove();
            fields.value.values.add(new app.ui.value({value : '$ '+ billet.value.toFixed(2).toString().replace('.',',')}));

            fields.clientName.values.remove();
            fields.clientName.values.add(new app.ui.value({value : billet.clientName}));

            fields.clientAddress.values.remove();
            fields.clientAddress.values.add(new app.ui.value({value : billet.clientAddress}));

            fields.clientCity.values.remove();
            fields.clientCity.values.add(new app.ui.value({value : billet.clientCity}));

            fields.clientState.values.remove();
            fields.clientState.values.add(new app.ui.value({value : billet.clientState}));

            fields.clientZipCode.values.remove();
            fields.clientZipCode.values.add(new app.ui.value({value : billet.clientZipCode}));

            fields.demonstrative.values.remove();
            fields.demonstrative.values.add(new app.ui.value({value : billet.demonstrative}));
        }

        /* Pegando a edição do contato */
        app.bind('update billet ' + billet._id, function (data) {
            billet = new app.models.billet(data);

            if (billet) {
                that.print(billet);
            }
        });

        /* Pegando a exclusão do boleto */
        app.bind('remove billet ' + billet._id, app.close);

        if (billet) {
            this.print(billet);
        }
    };

    /**
     * Monta a view
     *
     * @author Mauro Ribeiro
     * @since  2013-04
     */
    app.ui.title('Boleto');
    app.models.billet.find(params.id, function (billet) {
        new Entity(billet);
    });
});