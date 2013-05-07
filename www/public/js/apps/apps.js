/*
 * Biblioteca de controle de aplicativos do eeKit
 *
 * @author: rafael erthal
 * @since: 2013-05
 */

var folder = '/js/apps/'

new Namespace({
    app : folder + 'app/app.js'
}, function () {

    /* abre um aplicativo
     *
     * @author: rafael erthal
     * @since: 2013-05
     */
    this.open = function (params, app) {

        if (!params) {
            throw {
                source     : 'apps.js',
                method     : 'open',
                message    : 'Params must be especified',
                arguments : arguments
            };
        }

        if (!params.app || params.app.constructor !== String) {
            throw {
                source     : 'apps.js',
                method     : 'open',
                message    : 'App must be a string',
                arguments : arguments
            };
        }

        if (!params.route || params.route.constructor !== String) {
            throw {
                source     : 'apps.js',
                method     : 'open',
                message    : 'Route must be a string',
                arguments : arguments
            };
        }

    }

    module.exports(this);
});