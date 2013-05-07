/** app
 *
 * @autor : Rafael Erthal
 * @since : 2012-11
 *
 * @description : controlador de carregamento de aplicativos
 */
sdk.modules.apps = function (app) {
    "use strict";

    /** open
     *
     * @autor : Rafael Erthal
     * @since : 2013-01
     *
     * @description : abre um app
     */
    this.open = function (params) {
        empreendemia.apps.open({
            app : params.app,
            route : params.route,
            close : params.close,
            caller : app,
            open : function (tool) {
                tool.open(params.data);
                if (
                    tool.ui.type() === 'dialog'       ||
                    tool.ui.type() === 'entity'       ||
                    tool.ui.type() === 'frame'        ||
                    tool.ui.type() === 'list'
                ) {
                    empreendemia.apps.render(tool);
                } else if (
                    tool.ui.type() === 'embbed entity' ||
                    tool.ui.type() === 'embbed list'
                ) {
                    if (params.open) {
                        params.open.apply(app, [tool.ui]);
                    }
                }
            }
        });
    };
};
