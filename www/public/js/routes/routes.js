/*
 * Biblioteca de controle de rotas do eeKit
 *
 * @author: rafael erthal
 * @since: 2013-05
 */

/* Verifica se a rota bate com o pathname
 *
 * @author: rafael erthal
 * @since: 2013-05
 */
var match = function (route) {
    var current_path = location.pathname.match(/([\/][A-Za-z0-9\-]*[^\/])/g),
        current_route = route.match(/([\/][A-Za-z0-9\-\:]*[^\/])/g);

    if (current_route === null && current_path.length === 1) {
        return true;
    }

    if (current_path.length != current_route.length + 1) {
        return false;
    }

    for (var i = 0; i < current_path.length; i++) {
        if (
            current_path[i+1] != current_route[i] &&
            current_route[i].substring(1, 2) !== ':'
        ) {
            return false;
        }
    }

    return true;
};

/* Retorna o conjunto de parametros passados pelo pahtname
 *
 * @author: rafael erthal
 * @since: 2013-05
 */
var params = function (route) {
    var current_path = location.pathname.match(/([\/][A-Za-z0-9\-]*[^\/])/g),
        current_route = route.match(/([\/][A-Za-z0-9\-\:]*[^\/])/g),
        res = {};

    if (current_route) {
        for (var i = 0; i < current_route.length; i++) {
            if (current_route[i].substring(1,2) === ':') {
                res[current_route[i].substring(2)] = current_path[i+1].substring(1);
            }
        }
    }

    return res;
}

module.exports({

    /* registra uma rota de listagem
     *
     * @author: rafael erthal
     * @since: 2013-05
     */
    list : function (route, callback, app) {

        if (!route || route.constructor !== String) {
            throw {
                source     : 'routes.js',
                method     : 'list',
                message    : 'Route must be a string',
                arguments : arguments
            };
        }

        if (!callback || callback.constructor !== Function) {
            throw {
                source     : 'routes.js',
                method     : 'list',
                message    : 'Callback must be a function',
                arguments : arguments
            };
        }

        if (match(route)) {

            app.route = function () {

                return callback;

            };

            app.type = function () {

                return 'list';

            };

            app.params = function () {

                return params(route);

            };
        }

    },

    /* registra uma rota de entidade
     *
     * @author: rafael erthal
     * @since: 2013-05
     */
    entity : function (route, callback, app) {

        if (!route || route.constructor !== String) {
            throw {
                source     : 'routes.js',
                method     : 'entity',
                message    : 'Route must be a string',
                arguments : arguments
            };
        }

        if (!callback || callback.constructor !== Function) {
            throw {
                source     : 'routes.js',
                method     : 'entity',
                message    : 'Callback must be a function',
                arguments : arguments
            };
        }

        if (match(route)) {

            app.route = function () {

                return callback;

            };

            app.type = function () {

                return 'entity';

            };

            app.params = function () {

                return params(route);

            };
        }

    },

    /* registra uma rota de listagem embedada
     *
     * @author: rafael erthal
     * @since: 2013-05
     */
    embedList : function (route, callback, app) {

        if (!route || route.constructor !== String) {
            throw {
                source     : 'routes.js',
                method     : 'embedList',
                message    : 'Route must be a string',
                arguments : arguments
            };
        }

        if (!callback || callback.constructor !== Function) {
            throw {
                source     : 'routes.js',
                method     : 'embedList',
                message    : 'Callback must be a function',
                arguments : arguments
            };
        }

        if (match(route)) {

            app.route = function () {

                return callback;

            };

            app.type = function () {

                return 'embedList';

            };

            app.params = function () {

                return params(route);

            };
        }

    },

    /* registra uma rota de entidade embedada
     *
     * @author: rafael erthal
     * @since: 2013-05
     */
    embedEntity : function (route, callback, app) {

        if (!route || route.constructor !== String) {
            throw {
                source     : 'routes.js',
                method     : 'embedEntity',
                message    : 'Route must be a string',
                arguments : arguments
            };
        }

        if (!callback || callback.constructor !== Function) {
            throw {
                source     : 'routes.js',
                method     : 'embedEntity',
                message    : 'Callback must be a function',
                arguments : arguments
            };
        }

        if (match(route)) {

            app.route = function () {

                return callback;

            };

            app.type = function () {

                return 'embedEntity';

            };

            app.params = function () {

                return params(route);

            };
        }

    },

    /* registra uma rota de dialogo
     *
     * @author: rafael erthal
     * @since: 2013-05
     */
    dialog : function (route, callback, app) {

        if (!route || route.constructor !== String) {
            throw {
                source     : 'routes.js',
                method     : 'dialog',
                message    : 'Route must be a string',
                arguments : arguments
            };
        }

        if (!callback || callback.constructor !== Function) {
            throw {
                source     : 'routes.js',
                method     : 'dialog',
                message    : 'Callback must be a function',
                arguments : arguments
            };
        }

        if (match(route)) {

            app.route = function () {

                return callback;

            };

            app.type = function () {

                return 'dialog';

            };

            app.params = function () {

                return params(route);

            };
        }

    },

    /* registra uma rota de frame
     *
     * @author: rafael erthal
     * @since: 2013-05
     */
    frame : function (route, callback, app) {

        if (!route || route.constructor !== String) {
            throw {
                source     : 'routes.js',
                method     : 'frame',
                message    : 'Route must be a string',
                arguments : arguments
            };
        }

        if (!callback || callback.constructor !== Function) {
            throw {
                source     : 'routes.js',
                method     : 'frame',
                message    : 'Callback must be a function',
                arguments : arguments
            };
        }

        if (match(route)) {

            app.route = function () {

                return callback;

            };

            app.type = function () {

                return 'frame';

            };

            app.params = function () {

                return params(route);

            };
        }

    }

});