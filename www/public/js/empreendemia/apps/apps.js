/** app
 *
 * @autor : Rafael Erthal
 * @since : 2012-11
 *
 * @description : controlador de carregamento de aplicativos
 */
empreendemia.apps = {
    active : [],
    /** open
     *
     * @autor : Rafael Erthal
     * @since : 2012-11
     *
     * @description : abre um app
     */
    open : function (params) {
        if (params) {
            var navigables = empreendemia.ui.content.navigation.navigables.get();

            for (var i in navigables) {
                if (navigables[i].href() === params.app + params.route) {
                    return navigables[i].click();
                }
            }

            empreendemia.user.companyUsers(function () {
                empreendemia.ajax.get({
                    url : 'http://' + empreendemia.config.services.apps.host + ':' + empreendemia.config.services.apps.port + '/app/' + params.app + '/source'
                }, function (response) {
                    if (response && !response.error) {
                        var tool = sdk.open(response);

                        tool.close = function (data) {
                            var i,
                                found = false,
                                nav = empreendemia.ui.content.navigation.navigables.get(),
                                apps = empreendemia.ui.content.roll.sheets.apps.get();

                            tool.ui.detach();

                            for (i in apps) {
                                if (apps[i] === tool.ui) {
                                    found = true;
                                    empreendemia.ui.content.navigation.focus(apps[i-1]);
                                }
                                if (found) {
                                   empreendemia.ui.content.navigation.navigables.remove(nav[i]);
                                   empreendemia.ui.content.roll.sheets.apps.remove(apps[i]);
                               }
                            }

                            if (params.close) {
                                params.close(data);
                            }
                        };

                        tool.open = function (data) {
                            tool.routes.go(params.route, data);
                        };

                        tool.caller = function () {
                            return params.caller;
                        };

                        if (params.open) {
                            params.open(tool);
                        }
                    }
                });
            });
        }
    },

    /** render
     *
     * @autor : Rafael Erthal
     * @since : 2012-11
     *
     * @description : abre um app
     */
     render : function (tool) {
        var apps = empreendemia.ui.content.roll.sheets.apps.get(),
            nav = empreendemia.ui.content.navigation.navigables.get(),
            position,
            i,j;

        if (tool.ui.type() === 'dialog') {
            tool.ui.attach(document.body);
        } else {
            if (tool.caller()) {
                for (i in apps) {
                    var containers = apps[i].embbeds ? apps[i].embbeds.get() : [];
                        containers.push(apps[i]);

                    for (j in containers) {
                        if (tool.caller() && tool.caller().ui && containers[j] === tool.caller().ui) {
                           position = i;
                       }
                    }
                }
                for (i in apps) {
                    if (i > position || ! position) {
                       empreendemia.ui.content.navigation.navigables.remove(nav[i]);
                       empreendemia.ui.content.roll.sheets.apps.remove(apps[i]);
                    }
                }
            } else {
                if(tool.ui.type() === 'frame') {
                    empreendemia.ui.header.visibility('hide');
                    empreendemia.ui.content.navigation.visibility('hide');
                } else {
                    empreendemia.ui.header.visibility('show');
                    empreendemia.ui.content.navigation.visibility('show');
                }

                empreendemia.ui.content.roll.menu.remove();
                empreendemia.ui.content.roll.sheets.apps.remove();
                empreendemia.ui.content.navigation.navigables.remove();
                for (var i in tool.menu) {
                    empreendemia.ui.content.roll.menu.add(new empreendemia.ui.appMenu({
                        legend   : tool.menu[i].legend,
                        tip      : tool.menu[i].tip,
                        image    : tool.menu[i].image,
                        href     : tool.slug + tool.menu[i].href,
                        selected : tool.menu[i].href === tool.routes.route()
                    }));
                }
                tool.ui.menu = empreendemia.ui.content.roll.menu;
            }

            var navigable = new empreendemia.ui.appNavigable({
                legend : tool.ui.heading(),
                href   : tool.slug + tool.routes.route(),
                click  : function () {
                    empreendemia.ui.content.navigation.focus(tool.ui);
                }
            });

            tool.ui.title = function (value) {
                if (value) {
                    navigable.legend(value);
                    tool.ui.heading(value);
                } else {
                    return tool.ui.heading()
                }
            }

            empreendemia.ui.content.navigation.navigables.add(navigable);
            empreendemia.ui.content.roll.sheets.apps.add(tool.ui);
            navigable.click();
        }
     }
};
