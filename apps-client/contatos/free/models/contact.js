/**
 * Model de Contatos
 *
 * @author : Rafael Erthal, Mauro Ribeiro
 * @since  : 2012-11
 */
app.models.contact = function (params) {
    var that = this;

    /**
     * Identificador do contato
     */
    this._id = params._id;
    /**
     * Id da fase de negociação
     */
    this.category = params.category;
    /**
     * Nome do contato
     */
    this.name = params.name;
    /**
     * Email do contato
     */
    this.email = params.email;
    /**
     * Telefone do contato
     */
    this.phone = params.phone;
    /**
     * Anotações
     */
    this.notes = params.notes;
    /**
     * Prioridade do contato
     */
    this.priority = params.priority;
    /**
     * Data de criação do contato
     */
    this.dateCreated = params.dateCreated;
    /**
     * Data de criação do contato
     */
    this.fieldValues = params.fieldValues;
    /**
     * Responsável do contato
     */
    this.user = params.user;
    /**
     * Responsável do contato
     */
    this.author = params.author;

    /**
     * Remove o contato
     *
     * @author Rafael Erthal
     * @since  2012-10
     *
     * @param  cb : callback a ser chamado após a exclusão
     */
    this.remove = function (cb) {
        app.ajax.post({
            url  : 'http://' + app.config.services.contacts.host + ':' + app.config.services.contacts.port + '/contact/' + this._id + '/delete'
        }, cb);
    };

   /**
    * Drag'n drop 
    *
    * @author Rafael Erthal
    * @since  2013-02
    */
    this.changeCategory = function (category, priority) {
        this.priority = priority;
        this.category = category;
        this.save();
    };

    /**
     * Cria ou atualiza o contato
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  cb : callback a ser chamado após salvar
     */
    this.save = function (cb) {
        var data = {
            category : this.category,
            name : this.name,
            email : this.email,
            phone : this.phone,
            notes : this.notes,
            priority : this.priority,
            fieldValues : this.fieldValues,
            user : this.user
        },
        url, event;

        if (this._id) {
            url = 'http://' + app.config.services.contacts.host + ':' + app.config.services.contacts.port + '/contact/' + this._id + '/update';
            event = 'editar contato';
        } else {
            url = 'http://' + app.config.services.contacts.host + ':' + app.config.services.contacts.port + '/contact/';
            event = 'adicionar contato';
        }

        app.ajax.post({
            url  : url,
            data : data
        }, function (data) {
            if (data) {
                if (data.error) {
                    console.log(data.error);
                } else {
                    that._id = data.contact._id;
                    if (cb) {
                        cb.apply(app);
                    }
                    app.tracker.event(event);
                }
            }
        });
    }
}


/**
 * Lista contatos
 *
 * @author Rafael Erthal
 * @since  2012-10
 *
 * @param data : opções para a lista
 * @param cb : callback
 */
app.models.contact.list = function (data, cb) {
    app.ajax.get({
        url  : 'http://' + app.config.services.contacts.host + ':' + app.config.services.contacts.port + '/contacts',
        data : data
    }, function (response) {
        var contacts = [],
            i;

        if (response) {
            if (response.error) {
                console.error(response.error)
            } else {
                /* Coloca os contatos no objeto */
                for (i in response.contacts) {
                    if (response.contacts.hasOwnProperty(i)) {
                        contacts.push(new app.models.contact(response.contacts[i]));
                    }
                }
                if (cb) {
                    cb.apply(app, [contacts]);
                }
                app.tracker.event('visualizar contatos');
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
app.models.contact.find = function (id, cb) {
    app.ajax.get({
        url  : 'http://' + app.config.services.contacts.host + ':' + app.config.services.contacts.port + '/contact/' + id,
        data : {}
    }, function (response) {
        if (response) {
            if (response.error) {
                console.error(response.error)
            } else {
                if (cb) {
                    cb.apply(app, [new app.models.contact(response.contact)]);
                }
            }
        }
    });
};