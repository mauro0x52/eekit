/**
 * Model das categorias
 *
 * @author Mauro Ribeiro
 * @since  2012-11
 */
app.models.category = function (params) {
    /**
     * Identificador da categoria
     */
    this._id = params._id;

    /**
     * Nome da categoria
     */
    this.name = params.name;

    /**
     * Subcategorias
     */
    this.childs = params.childs;
}

/**
 * Listar categorias
 *
 * @author Mauro Ribeiro
 * @since  2012-11
 *
 * @param  cb : callback a ser chamado após a listagem
 */
app.models.category.list = function (cb) {
    app.ajax.post({
        url : 'http://' + app.config.services.tasks.host + ':' + app.config.services.tasks.port + '/user'
    }, function (response) {
        if (response) {
            if (response.error) {
                console.log(response.error)
            } else {
                var i, categories = [];
                for (i in response.categories) {
                    if (response.categories.hasOwnProperty(i)) {
                        categories.push(new app.models.category(response.categories[i]));
                    }
                }
                cb.apply(app, [categories]);
            };
        }
    });
}