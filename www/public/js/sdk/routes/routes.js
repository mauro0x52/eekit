/** Routes
 *
 * @autor : Rafael Erthal
 * @since : 2012-08
 *
 * @description : implementa a biblioteca de rotas do navegador
 */
sdk.modules.routes = function (app) {
    var routes = [],
        activeRoute;

    /** match
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : verifica se a url bate com a mascara
     * @param url : url a ser checada
     * @param mask : mascara da url
     */
    var match = function (url, mask) {
        var maskSlices = mask.split('/'),
            urlSlices = url.split('/');

        if (maskSlices.length === urlSlices.length) {
            for (var i = 0; i < maskSlices.length ; i++) {
                if (maskSlices[i] !== urlSlices[i] && maskSlices[i].substring(0, 1) !== ':') {
                    return false;
                }
            }
        } else {
            return false;
        }

        return true;
    };

    /** params
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : pega os parâmetros de uma mascara na url
     * @param url : url a ser checada
     * @param mask : mascara da url
     */
    var params = function (url, mask) {
        var maskSlices = mask.split('/'),
            urlSlices = url.split('/'),
            params = {};

        for (var i = 0; i < maskSlices.length ; i++) {
            if (maskSlices[i].substring(0, 1) === ':') {
                params[maskSlices[i].substring(1)] = urlSlices[i]
            }
        }

        return params;
    };

    /** route
     *
     * @autor : Rafael Erthal
     * @since : 2012-09
     *
     * @description : retorna a rota atual
     */
    this.route = function () {
        return activeRoute;
    }

    /** go
     *
     * @autor : Rafael Erthal
     * @since : 2012-09
     *
     * @description : coloca na pilha uma rota com url e callback ou redireciona para uma rota
     * @param route : rota a ser colocada
     * @param callback : função a ser chamada caso a url bata
     */
    this.go = function (route, data) {
        for (var i in routes) {
            if (match(route, routes[i].route)) {
                activeRoute = route;
                app.ui.set(routes[i].type);
                return routes[i].callback.apply(app, [params(route, routes[i].route), data]);
            }
        }
    };

    if (app.slug === 'ee') {
        /** frame
         *
         * @autor : Rafael Erthal
         * @since : 2012-11
         *
         * @description : roteia um frame
         */
        this.frame = function (route, callback) {
            routes.push({route : route, callback : callback, type : 'frame'});
        };
    }

    /** entity
     *
     * @autor : Rafael Erthal
     * @since : 2012-11
     *
     * @description : roteia uma entidade
     */
    this.entity = function (route, callback) {
        routes.push({route : route, callback : callback, type : 'entity'});
    };

    /** list
     *
     * @autor : Rafael Erthal
     * @since : 2012-11
     *
     * @description : roteia uma lista
     */
    this.list = function (route, callback) {
        routes.push({route : route, callback : callback, type : 'list'});
    };

    /** dialog
     *
     * @autor : Rafael Erthal
     * @since : 2012-11
     *
     * @description : roteia um dialogo
     */
    this.dialog = function (route, callback) {
        routes.push({route : route, callback : callback, type : 'dialog'});
    };

    /** embeddedEntity
     *
     * @autor : Rafael Erthal
     * @since : 2012-11
     *
     * @description : roteia uma entidade embedada
     */
    this.embeddedEntity = function (route, callback) {
        routes.push({route : route, callback : callback, type : 'embbed entity'});
    };

    /** embeddedList
     *
     * @autor : Rafael Erthal
     * @since : 2012-11
     *
     * @description : roteia uma lista embedada
     */
    this.embeddedList = function (route, callback) {
        routes.push({route : route, callback : callback, type : 'embbed list'});
    };

    /** redirect
     *
     * @autor : Rafael Erthal
     * @since : 2013-01
     *
     * @description : abre uma nova janela
     */
    this.redirect = function (url, data) {
        window.open(url + '?' + jsonToQuery(data));
    }
};