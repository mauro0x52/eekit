/**
 * Model de Boletos
 *
 * @author Mauro Ribeiro
 * @since  2013-04
 */
app.models.billet = function (params) {
    var that = this;

    /**
     * Identificador do boleto
     */
    this._id = params._id;
    /**
     * usuário
     */
    this.company = params.company;
    this.author = params.author;
    /**
     * banco
     */
    this.bank = params.bank;
    this.bankId = params.bankId;
    this.wallet = params.wallet;
    this.currency = params.currency;
    /**
     * recebedor
     */
    this.receiver = params.receiver;
    this.cpfCnpj = params.cpfCnpj;
    this.agency = params.agency;
    this.account = params.account;
    this.accountVD = params.accountVD;
    /**
     * documento
     */
    this.local = params.local;
    this.ourNumber = params.ourNumber;
    this.documentNumber = params.documentNumber;
    this.dueDate = params.dueDate;
    this.creationDate = params.creationDate;
    this.value = params.value;
    this.instructions = params.instructions;
    /**
     * cliente
     */
    this.clientName = params.clientName;
    this.clientAddress = params.clientAddress;
    this.clientCity = params.clientCity;
    this.clientState = params.clientState;
    this.clientZipCode = params.clientZipCode;
    this.demonstrative = params.demonstrative;
    /**
     * particularidades bb
     */
    this.agreement = params.agreement;

    /**
     * Remove o boleto
     *
     * @author Rafael Erthal
     * @since  2012-10
     *
     * @param  cb : callback a ser chamado após a exclusão
     */
    this.remove = function (cb) {
        app.ajax.post({
            url  : 'http://' + app.config.services.billets.host + ':' + app.config.services.billets.port + '/billet/' + this._id + '/delete'
        }, cb);
    };

    /**
     * Cria ou atualiza o boleto
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  cb : callback a ser chamado após salvar
     */
    this.save = function (cb) {
        var data = {
            _id : this._id,
            user : this.user,
            bank : this.bank,
            bankId : this.bankId,
            wallet : this.wallet,
            currency : this.currency,
            receiver : this.receiver,
            cpfCnpj : this.cpfCnpj,
            agency : this.agency,
            account : this.account,
            accountVD : this.accountVD,
            local : this.local,
            ourNumber : this.ourNumber,
            documentNumber : this.documentNumber,
            dueDate : this.dueDate,
            creationDate : this.creationDate,
            value : this.value,
            instructions : this.instructions,
            clientName : this.clientName,
            clientAddress : this.clientAddress,
            clientCity : this.clientCity,
            clientState : this.clientState,
            clientZipCode : this.clientZipCode,
            demonstrative : this.demonstrative,
            agreement : this.agreement
        },
        url, event;

        if (this._id) {
            url = 'http://' + app.config.services.billets.host + ':' + app.config.services.billets.port + '/billet/' + this._id + '/update';
            event = 'editar boleto';
        } else {
            url = 'http://' + app.config.services.billets.host + ':' + app.config.services.billets.port + '/billet/';
            event = 'adicionar boleto';
        }

        app.ajax.post({
            url  : url,
            data : data
        }, function (data) {
            if (data) {
                if (data.error) {
                    console.log(data.error);
                } else {
                    for (var i in data.billet) {
                        that[i] = data.billet[i];
                    }
                    if (cb) {
                        cb.apply(app);
                    }
                    app.event(event);
                }
            }
        });
    }
}


/**
 * Lista boletos
 *
 * @author Mauro Ribeiro
 * @since  2013-04
 *
 * @param data : opções para a lista
 * @param cb : callback
 */
app.models.billet.list = function (data, cb) {
    app.ajax.get({
        url  : 'http://' + app.config.services.billets.host + ':' + app.config.services.billets.port + '/billets',
        data : data
    }, function (response) {
        var billets = [],
            i;

        if (response) {
            if (response.error) {
                console.error(response.error)
            } else {
                /* Coloca os boletos no objeto */
                for (var i in response.billets) {
                    if (response.billets.hasOwnProperty(i)) {
                        billets.push(new app.models.billet(response.billets[i]));
                    }
                }
                if (cb) {
                    cb.apply(app, [billets]);
                }
                app.event('visualizar boletos');
            }
        }
    });
};

/**
 * Busca um contato
 *
 * @author Rafael Erthal
 * @since  2012-10
 *
 * @param  data : id do camarada
 * @param  cb : callback
 */
app.models.billet.find = function (id, cb) {
    app.ajax.get({
        url  : 'http://' + app.config.services.billets.host + ':' + app.config.services.billets.port + '/billet/' + id,
        data : {}
    }, function (response) {
        if (response) {
            if (response.error) {
                console.error(response.error)
            } else {
                if (cb) {
                    cb.apply(app, [new app.models.billet(response.billet)]);
                }
            }
        }
    });
};