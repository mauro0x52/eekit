/**
 * Model de usuário
 *
 * @author Mauro Ribeiro
 * @since  2012-12
 */
app.models.user = function (params) {

}

/**
 * Autentica um usuário
 *
 * @author Mauro Ribeiro
 * @since  2012-12
 *
 * @param cb : callback a ser chamado após a autenticação
 */
app.models.user.auth = function (cb) {
    app.ajax.post({url : 'http://' + app.config.services.finances.host + ':' + app.config.services.finances.port + '/user'}, cb);
}