/** empreendemia
 *
 * @autor : Rafael Erthal
 * @since : 2012-11
 *
 * @description : javascript do corpo da empreendemia
 */
var empreendemia = {

    /** load
     *
     * @autor : Rafael Erthal
     * @since : 2012-11
     *
     * @description : carrega a seção do usuário na empreendemia
     */
    load : function () {
        empreendemia.ui.content.navigation.navigables.remove();
        empreendemia.ui.content.roll.sheets.apps.remove();
        empreendemia.ui.content.roll.menu.remove();
        /* Exibindo user section */
        empreendemia.user.profile(function (profile) {
            var routes,
                slug,
                route;

            empreendemia.ui.header.user.options.remove();
            if (profile) {
                /* Usuário logado */
                empreendemia.ui.header.user.login();
                empreendemia.ui.header.user.options.add(new empreendemia.ui.userOption({
                    legend : profile.name,
                    style  : 'name'
                }));
                empreendemia.ui.header.user.options.add(new empreendemia.ui.userOption({
                    legend : 'sair',
                    style  : 'logout',
                    click  : empreendemia.user.logout
                }));
                /* Monta a rota */
                routes = empreendemia.routes.get() || 'tarefas/';
                slug = routes.split('/')[0];
                route = routes.replace(slug, '') || '/';
            } else {
                /* Usuário deslogado */
                empreendemia.ui.header.user.logout();
                empreendemia.ui.header.user.options.add(new empreendemia.ui.userOption({
                    legend : 'cadastre-se',
                    style  : 'signup',
                    click  : empreendemia.user.signup
                }));
                empreendemia.ui.header.user.options.add(new empreendemia.ui.userOption({
                    legend : 'login',
                    style  : 'login',
                    click  : empreendemia.user.login
                }));
                /* Monta a rota */
                routes = empreendemia.routes.get() || 'ee/';
                slug = routes.split('/')[0];
                route = routes.replace(slug, '') || '/';
            }
            /* Exibindo aplicativo da rota */
            empreendemia.apps.open({
                app   : slug,
                route : route,
                open  : function (tool) {
                    tool.open();
                    empreendemia.apps.render(tool, true);
                }
            });
        });
        /* Exibindo lista de aplicativos */
        empreendemia.user.apps(function (apps) {
            empreendemia.ui.header.menu.apps.remove();
            for (var i in apps) {
                if (apps[i].name.toLowerCase() !== 'ee') {
                    empreendemia.ui.header.menu.apps.add(new empreendemia.ui.appIcon({
                        legend : apps[i].name,
                        image  : apps[i].slug,
                        title  : apps[i].name,
                        href   : apps[i].slug
                    }));
                }
            }
        });
    },

    /** start
     *
     * @autor : Rafael Erthal
     * @since : 2012-11
     *
     * @description : inicia a empreendemia
     */
    start : function () {
        empreendemia.ui = new empreendemia.ui();

        window.addEventListener('resize', empreendemia.ui.content.roll.sheets.fitHeight, true);

        empreendemia.load();
    }
};
