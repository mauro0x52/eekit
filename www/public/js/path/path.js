/*
 * Biblioteca de controle de rotas do eeKit
 *
 * @author Rafael Erthal
 * @since  2013-05
 */

var ajax   = module.use('ajax'),
    auth   = module.use('auth'),
    config = module.use('config'),
    ui     = module.use('ui'),
    App    = module.use('app');

module.exports({

    /* Altera o path
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    redirect : function (path, params) {

        if (!path) {
            throw new Error({
                source     : 'path.js',
                method     : 'redirect',
                message    : 'Path must be especified',
                arguments  : arguments
            });
        }

        path = '/' + path;
        params = params || {};

        var app = path.match(/^\/([^\/]+)/) || [],
            route = path.match(/^\/[^\/]+(.*)/) || [];

        /* Verifico se o app ja não esta aberto */
        var apps = ui.apps.get();
        for (var i in apps) {
            if (apps[i].context().route() === path) {
                apps[i].click();
                return;
            }
        }

        /* Abro o app */
        ajax.get({
            url : 'http://' + config.services.apps.host + ':' + config.services.apps.port + '/app/' + app[1] + '/source'
        }, function (response) {
            auth.company.users(function (users) {
                var newapp = new App({
                    name   : response.name,
                    slug   : response.slug,
                    source : response.source,
                    route  : path,
                    caller : params.caller,
                    data   : params.data,
                    close  : params.close,
                    users  : users
                });
                if (newapp.type() === 'dialog') {
                    /* Renderizo o dialogo */
                    ui.dialogs.add(newapp.ui);
                } else if (newapp.type() === 'frame') {
                    ui.collapse(true);
                    ui.apps.remove();
                    ui.apps.add(newapp.ui);
                    newapp.ui.click();
                } else if (newapp.type() !== 'embedList' && newapp.type() !== 'embedEntity') {
                    ui.collapse(false);
                    if (!newapp.caller() || newapp.caller().name() !== newapp.name()) {
                        /* Se o app tiver sido chamado pelo eekit ou outro app, removo todos os apps ativos */
                        ui.apps.remove();
                        ui.appMenu.remove();
                        ui.navigation.remove();
                        /* Renderiza o menu do app */
                        for (var i in newapp.menu) {
                            ui.appMenu.add(new ui.appMenuItem({
                                legend : newapp.menu[i].legend,
                                image  : newapp.menu[i].image,
                                href   : newapp.slug() + newapp.menu[i].href
                            }))
                        }
                    } else {
                        /* Fecho todos os apps em frente ao caller */
                        var found = false,
                            apps = ui.apps.get(),
                            current = newapp.caller();
                        while (current.type() === 'embedList' || current.type() === 'embedEntity') {
                            current = current.caller();
                        }
                        for (var i in apps) {
                            if (found) {
                                apps[i].close();
                            }
                            if (apps[i].context() === current) {
                                found = true;
                            }
                        }
                    }

                    /* Renderizo o app no corpo principal */
                    ui.apps.add(newapp.ui);
                    ui.navigation.add(newapp.ui.navigation);
                    newapp.ui.click();
                } else if (params.caller) {
                    params.caller.ui.embeds.add(newapp.ui);
                }
            });
        });
    },

    /* Cerifica se o path é compatível com o address bar
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    match : function (path, route) {
        var current_path = route.match(/([\/][A-Za-z0-9\-]*[^\/])/g) || ['/'],
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
     * @author Rafael Erthal
     * @since  2013-05
     */
    params : function (path, route) {
        var current_path = route.match(/([\/][A-Za-z0-9\-]*[^\/])/g) || ['/'],
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