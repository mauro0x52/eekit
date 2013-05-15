/*
 * Biblioteca de controle de rotas do eeKit
 *
 * @author: rafael erthal
 * @since: 2013-05
 */

module.exports({

    /* Altera o path
     *
     * @author: rafael erthal
     * @since: 2013-05
     */
    redirect : function (path) {
        history.pushState({}, 'EmpreendeKit', path);
    },

    /* Cerifica se o path é compatível com o address bar
     *
     * @author: rafael erthal
     * @since: 2013-05
     */
    match : function (path) {
        var current_path = location.pathname.match(/([\/][A-Za-z0-9\-]*[^\/])/g) || ['/'],
            current_route = path.match(/([\/][A-Za-z0-9\-\:]*[^\/])/g) || ['/'];

        if (current_path.length != current_route.length) {
            return false;
        }

        for (var i = 0; i < current_path.length; i++) {
            if (
                current_path[i] != current_route[i] &&
                current_route[i].substring(1, 2) !== ':'
            ) {
                return false;
            }
        }

        return true;
    },

    /* Retorna os paramêtros do path compatíveis com o address bar
     *
     * @author: rafael erthal
     * @since: 2013-05
     */
    params : function (path) {
        var current_path = location.pathname.match(/([\/][A-Za-z0-9\-]*[^\/])/g) || ['/'],
            current_route = path.match(/([\/][A-Za-z0-9\-\:]*[^\/])/g) || ['/'],
            res = {};

        if (current_route) {
            for (var i = 0; i < current_route.length; i++) {
                if (current_route[i].substring(1,2) === ':') {
                    res[current_route[i].substring(2)] = current_path[i].substring(1);
                }
            }
        }

        return res;
    }

});