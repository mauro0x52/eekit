/**
 * Model dos campos personalizados
 *
 * @author Rafael Erthal
 * @since  2013-01
 */
app.models.field = function (params) {
    var that = this;
    /**
     * Nome do campo
     */
    this.name = params.name;
    /**
     * Identificador do campo
     */
    this._id = params._id;
    /**
     * Posição do campo
     */
    this.position = params.position;

    /**
     * Remove o campo personalizado
     *
     * @author Rafael Erthal
     * @since  2013-01
     */
    this.remove = function (cb) {
        app.ajax.post({
            url  : 'http://' + app.config.services.contacts.host + ':' + app.config.services.contacts.port + '/field/' + this._id + '/delete'
        }, cb);
    };

   /**
    * Drag'n drop 
    *
    * @author Rafael Erthal
    * @since  2013-02
    *
    * @param  cb : callback a ser chamado após a edição
    */
    this.changePosition = function (position) {
        this.position = position;
        this.save();
    };

    /**
     * Cria ou atualiza o campo personalizado
     *
     * @author Mauro Ribeiro
     * @since  2013-01
     *
     * @param  cb : callback a ser chamado após salvar
     */
    this.save = function (cb) {
        var data = {
            name : this.name,
            position : this.position
        },
        url;

        if (this._id) {
            url = 'http://' + app.config.services.contacts.host + ':' + app.config.services.contacts.port + '/field/' + this._id + '/update';
        } else {
            url = 'http://' + app.config.services.contacts.host + ':' + app.config.services.contacts.port + '/field/';
        }

        app.ajax.post({
            url  : url,
            data : data
        }, function (data) {
            if (data) {
                if (data.error) {
                    console.log(data.error);
                } else {
                    that._id = data.field._id;
                    if (cb) {
                        cb.apply(app);
                    }
                }
            }
        });
    }
}

/**
 * Listar campos personalizados
 *
 * @author Rafael Erthal
 * @since  2013-01
 * 
 * @param  cb : callback
 */
app.models.field.list = function (cb) {
    app.ajax.post({url : 'http://' + app.config.services.contacts.host + ':' + app.config.services.contacts.port + '/company'}, function (response) {
        var fields = [],
            i;

        if (response) {
            if (response.error) {
                console.error(response.error)
            } else {
                /* Coloca os campos no objeto */
                for (i in response.fields) {
                    if (response.fields.hasOwnProperty(i)) {
                        fields.push(new app.models.field(response.fields[i]));
                    }
                }
                cb.apply(app, [fields]);
            }
        }
    });
}

/**
 * Busca um campo personalizado
 *
 * @author Rafael Erthal
 * @since  2013-01
 *
 * @param  data : id do campo
 * @param  cb : callback
 */
app.models.field.find = function (id, cb) {
    app.ajax.get({
        url  : 'http://' + app.config.services.contacts.host + ':' + app.config.services.contacts.port + '/field/' + id,
        data : {}
    }, function (response) {
        if (response) {
            if (response.error) {
                console.error(response.error)
            } else {
                if (cb) {
                    cb.apply(app, [new app.models.field(response.field)]);
                }
            }
        }
    });
};