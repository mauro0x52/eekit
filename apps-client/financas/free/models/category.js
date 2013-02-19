/**
 * Model de categorias das transações
 *
 * @author : Rafael Erthal, Mauro Ribeiro
 * @since  : 2012-12
 */
app.models.category = function (params) {
    var that = this;

    /**
     * Identificador da categoria
     */
    this._id = params._id;

    /**
     * Nome da categoria
     */
    this.name = params.name;

    /**
     * Tipo da categoria
     */
    this.type = params.type;

    /**
     * Permição para editar categoria
     */
    this.editable = params.editable;

    /**
     * Cria ou atualiza uma categoria
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
                type : this.type
            };

        if (this._id) {
            url = 'http://' + app.config.services.finances.host + ':' + app.config.services.finances.port + '/category/' + this._id + '/update';
        } else {
            url = 'http://' + app.config.services.finances.host + ':' + app.config.services.finances.port + '/category';
            event = 'adicionar categoria';
        }

        app.ajax.post({
            url : url,
            data : data
        }, function (response) {
            if (response) {
                if (response.error) {
                    console.log(response.error)
                } else {
                    that._id = response.category._id;
                    if (cb) {
                        cb.apply(app);
                    }
                    if (event) app.tracker.event(event);
                }
            }
        });
    }

    /**
     * Exclui a categoria
     *
     * @author Rafael Erthal
     * @since  2012-10
     *
     * @param cb : callback a ser chamado após a exclusão
     */
    this.remove = function (cb) {
        app.ajax.post({url : 'http://' + app.config.services.finances.host + ':' + app.config.services.finances.port + '/category/' + this._id + '/delete'}, cb);
    }
}


/**
 * Lista todas as categorias do usuário
 *
 * @author Rafael Erthal
 * @since  2012-10
 *
 * @param cb : callback
 */

app.models.category.list = function (cb) {
    app.ajax.get({url : 'http://' + app.config.services.finances.host + ':' + app.config.services.finances.port + '/categories'}, function (response) {
        if (response) {
            var categories = [];
            for (var i in response.categories) {
                categories.push(new app.models.category(response.categories[i]));
            }
            cb(categories);
        }
    });
}


/**
 * Pega uma categoria específica
 *
 * @author Mauro Ribeiro
 * @since  2012-12
 *
 * @param id : id da categoria
 * @param cb : callback
 */
app.models.category.find = function (id, cb) {
    app.ajax.get({url : 'http://' + app.config.services.finances.host + ':' + app.config.services.finances.port + '/category/'+id}, function (response) {
        if (response) {
            if (response.error) {
                console.log(response.error);
            }
            else {
                cb(new app.models.category(response.category));
            }
        }
    });
}
