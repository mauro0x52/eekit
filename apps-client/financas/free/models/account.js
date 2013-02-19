/**
 * Model de contas bancárias
 *
 * @author Rafael Erthal, Mauro Ribeiro
 * @since  2012-12
 */
app.models.account = function (params) {
    var that = this;

    /**
     * Identificador da conta
     */
    this._id = params._id;

    /**
     * Nome da conta
     */
    this.name = params.name;

    /**
     * Nome do banco
     */
    this.bank = params.bank;

    /**
     * Número da conta
     */
    this.account = params.account;

    /**
     * Número da agência
     */
    this.agency = params.agency;

    /**
     * Data inicial
     */
    this.initialDate = new Date(params.initialDate);

    /**
     * Balanço inicial
     */
    this.initialBalance = params.initialBalance;

    /**
     * Cria ou atualiza uma conta
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  cb : callback a ser executado após salvar
     */
    this.save = function (cb) {
        var url, event,
            data = {
                _id : this._id,
                name : this.name,
                bank : this.bank,
                account : this.account,
                agency : this.agency,
                initialBalance : this.initialBalance
            };

        if (this._id) {
            url = 'http://' + app.config.services.finances.host + ':' + app.config.services.finances.port + '/account/' + this._id + '/update';
        } else {
            url = 'http://' + app.config.services.finances.host + ':' + app.config.services.finances.port + '/account';
            event = 'adicionar conta';
        }

        app.ajax.post({
            url : url,
            data : data
        }, function (response) {
            if (response) {
                if (response.error) {
                    console.log(response.error)
                } else {
                    that._id = response.account._id;
                    if (cb) {
                        cb.apply(app);
                    }
                    if (event) app.tracker.event(event);
                }
            }
        });
    }

    /**
     * Chamada para excluir a conta
     *
     * @author Rafael Erthal
     * @since  2012-10
     *
     * @param cb : callback a ser chamado após a exclusão
     */
    this.remove = function (cb) {
        app.ajax.postJSON({url : 'http://' + app.config.services.finances.host + ':' + app.config.services.finances.port + '/account/' + this._id + '/delete'}, cb);
    }
}


/**
 * Encontrar transação
 *
 * @author Mauro Ribeiro
 * @since  2012-12
 *
 * @param id : id da transação
 * @param cb : callback
 */
app.models.account.find = function (id, cb) {
    app.ajax.get({url : 'http://' + app.config.services.finances.host + ':' + app.config.services.finances.port + '/account/' + id }, function (response) {
        if (response) {
            if (response.error) {
                console.log(response.error);
            } else {
                cb(new app.models.account(response.account));
            }
        }
    });
}

/**
 * Listar clientes
 *
 * @author Rafael Erthal
 * @since  2012-10
 *
 * @param cb : callback
 */
app.models.account.list = function (cb) {
    app.ajax.get({url : 'http://' + app.config.services.finances.host + ':' + app.config.services.finances.port + '/accounts'}, function (response) {
        if (response) {
            var accounts = [];
            for (var i in response.accounts) {
                accounts.push(new app.models.account(response.accounts[i]));
            }
            cb(accounts);
        }
    });
}