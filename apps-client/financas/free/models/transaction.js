/**
 * Model das transações
 *
 * @author Rafael Erthal, Mauro Ribeiro
 * @since  2012-12
 */
app.models.transaction = function (params) {
    var that = this;

    /**
     * Identificador de uma transação
     */
    this._id = params._id;

    /**
     * Criador de uma transação
     */
    this.author = params.author;

    /**
     * Nome da transação
     */
    this.name = params.name;

    /**
     * Nome da transação
     */
    this.subtitle = params.subtitle;

    /**
     * Lista de embeddeds da tarefa
     */
    this.embeddeds = params.embeddeds;

    /**
     * Id da categoria
     */
    this.category = params.category;

    /**
     * Id da conta
     */
    this.account = params.account;

    /**
     * Id do contato
     */
    this.contact = params.contact;

    /**
     * Id da task
     */
    this.task = params.task;

    /**
     * Reminder
     */
    this.reminder = params.reminder;

    /**
     * Valor da transação
     */
    this.value = params.value;

    /**
     * Data em que foi criada, atribuída ou paga
     */
    this.date = new Date(params.date);

    /**
     * Recorrência em dias
     */
    this.recurrence = params.recurrence;

    /**
     * Número da nota
     */
    this.noteNumber = params.noteNumber;

    /**
     * Situação do pagamento ("paid", "unpaid" ou "automatic"
     */
    this.situation = 'automatic';

    /**
     * Tipo da transação ("credit", "debit")
     */
    this.type = params.type;

    /**
     * Se é uma transferência
     */
    this.isTransfer = params.isTransfer;

    /**
     * Remove a transação
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param cb : callback chamado após a exclusão
     */
    this.remove = function (cb) {
        app.ajax.post({url : 'http://' + app.config.services.finances.host + ':' + app.config.services.finances.port + '/transaction/' + this._id + '/delete'}, cb);
    }

    /**
     * Marca a transação como paga
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param cb : callback chamado após a reconciliação
     */
    this.reconcile = function (cb) {
        app.ajax.post({url : 'http://' + app.config.services.finances.host + ':' + app.config.services.finances.port + '/transaction/' + this._id + '/reconcile'}, cb);
    }

    /**
     * Cria ou atualiza a transação
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param cb : callback chamado após a exclusão
     */
    this.save = function (cb) {
        var url, event,
            data = {
                _id : this._id,
                name : this.name,
                subtitle : this.subtitle,
                category : this.category,
                account : this.account,
                value : this.value,
                embeddeds : this.embeddeds,
                date : new Date(this.date),
                recurrence : this.recurrence,
                noteNumber : this.noteNumber,
                situation : 'automatic',
                reminder : this.reminder,
                type : this.type,
                isTransfer : this.isTransfer
            };

        if (this.contact) {
            data.contact = this.contact;
        }

        if (this._id) {
            url = 'http://' + app.config.services.finances.host + ':' + app.config.services.finances.port + '/transaction/' + this._id + '/update';
            event = 'editar transação';
        } else {
            url = 'http://' + app.config.services.finances.host + ':' + app.config.services.finances.port + '/transaction';
            event = 'adicionar transação';
        }

        app.ajax.post({
            url : url,
            data : data
        }, function (response) {
            if (response) {
                if (response.error) {
                    console.log(response.error)
                } else {
                    that._id = response.transaction._id;
                    if (cb) {
                        cb.apply(app);
                    }
                    if (event) app.tracker.event(event);
                }
            }
        });
    }
}

/**
 * Lista trasações
 *
 * @author Rafael Erthal, Mauro Ribeiro
 * @since  2012-12
 *
 * @param filter : opções para a lista
 * @param cb : callback
 */
app.models.transaction.list = function (filter, cb) {
    app.ajax.get({url : 'http://' + app.config.services.finances.host + ':' + app.config.services.finances.port + '/transactions', data : filter}, function (response) {
        if (response) {
            if (response.error) {
                console.log(response.error);
            }
            else {
                var transactions = [];

                /* Montando vetor */
                for (var i in response.transactions) {
                    transactions.push(new app.models.transaction(response.transactions[i]));
                }
                cb(transactions);
                app.tracker.event('visualizar fluxo de caixa');
            }
        }
    });
}
/**
 * Procura uma transação
 *
 * @author Mauro Ribeiro
 * @since  2012-12
 *
 * @param id : id da transação
 * @param cb : callback
 */
app.models.transaction.find = function (id, cb) {
    app.ajax.get({url : 'http://' + app.config.services.finances.host + ':' + app.config.services.finances.port + '/transaction/' + id}, function (response) {
        if (response) {
            if (response.error) {
                console.log(response.error);
            }
            else {
                cb(new app.models.transaction(response.transaction));
            }
        }
    });
}
