/*
 * Biblioteca de controle de aplicativos do eeKit
 *
 * @author: rafael erthal
 * @since: 2013-05
 */

var folder = '/js/apps/',
    ajax   = module.use('ajax'),
    config = module.use('config'),
    ui     = module.use('ui');

new Namespace({
    app : folder + 'app/app.js'
}, function () {

    var App = this.app;

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

        if (!params.open || params.open.constructor !== Function) {
            throw {
                source    : 'apps.js',
                method    : 'open',
                message   : 'Open callback must be a function',
                arguments : arguments
            };
        }

        ajax.get({
            url : 'http://' + config.services.apps.host + ':' + config.services.apps.port + '/app/' + params.app + '/source'
        }, function (response) {
            var newapp = new App({
                name   : response.name,
                slug   : response.slug,
                source : response.source,
                caller : app
            });

            if (newapp.type() === 'dialog') {
                ui.dialogs.add(newapp);
            } else if (newapp.type() !== 'embedList' && newapp.type() !== 'embedEntity') {
                if (!newapp.caller()) {
                    ui.apps.remove();
                }
                ui.apps.add(newapp.ui);
                if (newapp.type() === 'frame') {
                    ui.collapse(true);
                } else {
                    ui.collapse(false);
                }
            }
            params.open(newapp)

        });

    }

    module.exports(this);
});