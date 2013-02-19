/** Ajax
 *
 * @autor : Rafael Erthal
 * @since : 2012-08
 *
 * @description : implementa a biblioteca de ajax do usuário
 */
empreendemia.ajax = {
    /** validate
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : verifica se ocorreu um erro na validação
     */
    parseJSON : function (data) {
        if (data) {
            var response = eval('(' + data + ')');

            return response;
        }
    },

    /** tokenize
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : coloca o token no data
     */
    tokenize : function (data) {
        if (!data  ) {
            data = {};
        }
        if (!data.token) {
            data.token = empreendemia.user.token;
        }
        return data;
    },

    /** get
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : realiza chamada CORS com método GET
     */
    get : function (path, cb) {
        ajaxRequest(path.url, 'GET', this.tokenize(path.data), function (data) {
            cb(empreendemia.ajax.parseJSON(data));
        });
    },

    /** post
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : realiza chamada CORS com método POST
     */
    post : function (path, cb) {
        ajaxRequest(path.url, 'POST', this.tokenize(path.data), function (data) {
            cb(empreendemia.ajax.parseJSON(data));
        });
    },

    /** put
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : realiza chamada CORS com método PUT
     */
    put : function (path, cb) {
        ajaxRequest(path.url, 'PUT', this.tokenize(path.data), function (data) {
            cb(empreendemia.ajax.parseJSON(data));
        });
    },

    /** del
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : realiza chamada CORS com método DELETE
     */
    del : function (path, cb) {
        ajaxRequest(path.url, 'DELETE', this.tokenize(path.data), function (data) {
            cb(empreendemia.ajax.parseJSON(data));
        });
    }
}