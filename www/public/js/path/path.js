/*
 * Biblioteca de controle de rotas do eeKit
 *
 * @author Rafael Erthal
 * @since  2013-05
 */

var ajax   = module.use('ajax'),
    config = module.use('config'),
    ui     = module.use('ui'),
    App    = module.use('app');

module.exports({

    /* Altera o path
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    redirect : function (path, caller) {
        
        if (!path) {
            throw new Error({
                source     : 'path.js',
                method     : 'redirect',
                message    : 'Path must be especified',
                arguments  : arguments
            });
        }

        path = '/' + path;

        var app = path.match(/^\/([^\/]+)/) || [],
            route = path.match(/^\/[^\/]+(.*)/) || [];

        history.pushState({}, 'EmpreendeKit', path);

        ajax.get({
            url : 'http://' + config.services.apps.host + ':' + config.services.apps.port + '/app/' + app[1] + '/source'
        }, function (response) {

            var newapp = new App({
                name   : response.name,
                slug   : response.slug,
                source : response.source,
                caller : caller
            });

            if (newapp.type() === 'dialog') {
                ui.dialogs.add(newapp.ui);
            } else {
                if (newapp.type() !== 'embedList' && newapp.type() !== 'embedEntity') {
                    if (!newapp.caller()) {
                        ui.apps.remove();
                        ui.appMenu.remove();
                        /* Renderiza o menu do app */
                        for (var i in newapp.menu) {
                            ui.appMenu.add(new ui.appMenuItem({
                                legend : newapp.menu[i].legend,
                                image  : newapp.menu[i].image,
                                href   : newapp.menu[i].href,
                                tip    : newapp.menu[i].tip
                            }))
                        }
                    }

                    ui.apps.add(newapp.ui);
                    ui.navigation.add(newapp.ui.navigation);

                    if (newapp.type() === 'frame') {
                        ui.collapse(true);
                    } else {
                        newapp.ui.click();
                        ui.collapse(false);
                    }
                }
            }
        });
    },

    /* Cerifica se o path é compatível com o address bar
     *
     * @author Rafael Erthal
     * @since  2013-05
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
     * @author Rafael Erthal
     * @since  2013-05
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