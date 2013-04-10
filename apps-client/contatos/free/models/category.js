/**
 * Model das fases de negociação
 *
 * @author Mauro Ribeiro
 * @since  2012-11
 */
app.models.category = function (params) {
    /**
     * Nome da fase
     */
    this.name = params.name;
    /**
     * Tipo da categoria (clients, suppliers, partners ou personals)
     */
    this.type = params.type;
    /**
     * Nome da cor
     */
    this.color = params.color;
    /**
     * Identificador da fase
     */
    this._id = params._id;


    /**
     * Remove a categoria
     *
     * @author Mauro Ribeiro
     * @since  2013-02
     *
     * @param  cb : callback a ser chamado após a exclusão
     */
    this.remove = function (cb) {
        app.ajax.post({
            url  : 'http://' + app.config.services.contacts.host + ':' + app.config.services.contacts.port + '/category/' + this._id + '/delete'
        }, cb);
    };

    /**
     * Cria ou atualiza a categoria
     *
     * @author Mauro Ribeiro
     * @since  2013-02
     *
     * @param  cb : callback a ser chamado após salvar
     */
    this.save = function (cb) {
        var data = {
            name : this.name,
            type : this.type,
            color : this.color
        },
        url, that;

        that = this;
        if (this._id) {
            url = 'http://' + app.config.services.contacts.host + ':' + app.config.services.contacts.port + '/category/' + this._id + '/update';
        } else {
            url = 'http://' + app.config.services.contacts.host + ':' + app.config.services.contacts.port + '/category/';
        }

        app.ajax.post({
            url  : url,
            data : data
        }, function (data) {
            if (data) {
                if (data.error) {
                    console.log(data.error);
                } else {
                    that._id = data.category._id;
                    if (cb) {
                        cb.apply(app);
                    }
                }
            }
        });
    }
}

/**
 * Listar fases de negociação
 *
 * @author Mauro Ribeiro
 * @since  2012-11
 *
 * @param  cb : callback
 */
app.models.category.list = function (cb) {
    /* Carregar etapas de negociação */
    app.ajax.post({url : 'http://' + app.config.services.contacts.host + ':' + app.config.services.contacts.port + '/company'}, function (response) {
        var categories = [],
            i;

        if (response) {
            if (response.error) {
                console.error(response.error)
            } else {
                /* Coloca os contatos no objeto */
                for (i in response.categories) {
                    if (response.categories.hasOwnProperty(i)) {
                        categories.push(new app.models.category(response.categories[i]));
                    }
                }
                cb.apply(app, [categories]);
            }
        }
    });
}


/**
 * Encontrar categoria
 *
 * @author Mauro Ribeiro
 * @since  2013-02
 *
 * @param  cb : callback
 */
app.models.category.find = function (id, cb) {
    var category;
    app.models.category.list(function (categories) {
        for (var i in categories) {
            if (categories[i]._id === id) {
                category = categories[i];
            }
        }
        if (category) {
            cb.apply(app, [category]);
        } else {
            console.log('category not found');
        }
    })
}
