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
     * @description : coloca o token correto na requisição
     */
    tokenize : function (path, cb) {
        if (!path) {
            path = {};
        }

        if (!path.url) {
            path.url = '';
        }

        if (!path.data) {
            path.data = {};
        }

        var host = path.url.match(/(http\:\/\/)?([a-zA-Z0-9\.\-]+)(\:([0-9]+))?/)[2],
            port = path.url.match(/(http\:\/\/)?([a-zA-Z0-9\.\-]+)(\:([0-9]+))?/)[4],
            i,j;

        if (!path.data.token && empreendemia.config && empreendemia.config.services) {
            for (i in empreendemia.config.services) {
                if (
                    empreendemia.config.services[i].host.toString() === host &&
                    empreendemia.config.services[i].port.toString() === port
                ) {
                    if (i === 'auth') {
                        path.data.secret = empreendemia.config.services.www.secret;
                        cb(path);
                    } else if (empreendemia.config.services[i].token) {
                        path.data.token = empreendemia.config.services[i].token;
                        cb(path);
                    } else {
                        empreendemia.user.serviceLogin(i, function (token) {
                            path.data.token = token;
                            cb(path);
                        });
                    }
                }
            }
        } else {
            cb(path);
        }
    },

    /** get
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : realiza chamada CORS com método GET
     */
    get : function (path, cb) {
        this.tokenize(path, function (path) {
            ajaxRequest(path.url, 'GET', path.data, function (data) {
                cb(empreendemia.ajax.parseJSON(data));
            });
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
        this.tokenize(path, function (path) {
            ajaxRequest(path.url, 'POST', path.data, function (data) {
                cb(empreendemia.ajax.parseJSON(data));
            });
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
        this.tokenize(path, function (path) {
            ajaxRequest(path.url, 'PUT', path.data, function (data) {
                cb(empreendemia.ajax.parseJSON(data));
            });
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
        this.tokenize(path, function (path) {
            ajaxRequest(path.url, 'DELETE', path.data, function (data) {
                cb(empreendemia.ajax.parseJSON(data));
            });
        });
    }
}