/** app
 *
 * @autor : Rafael Erthal
 * @since : 2012-11
 *
 * @description : controlador de carregamento de aplicativos
 */
sdk.modules.apps = function (app) {
    "use strict";

    /** dialog
     *
     * @autor : Rafael Erthal
     * @since : 2012-11
     *
     * @description : abre um dialogo
     */
    this.dialog = function (params) {
        empreendemia.apps.open({
            app : params.app,
            route : params.route,
            close : params.close,
            caller : app,
            open : function (tool) {
                tool.open(params.data);
                empreendemia.apps.dialog(tool);
            }
        });
    };

    /** list
     *
     * @autor : Rafael Erthal
     * @since : 2012-11
     *
     * @description : abre uma lista
     */
     this.list = function (params) {
        empreendemia.apps.open({
            app : params.app,
            route : params.route,
            close : params.close,
            caller : app,
            open : function (tool) {
                tool.open(params.data);
                empreendemia.apps.render(tool, false, app);
            }
        });
     };

    /** entity
     *
     * @autor : Rafael Erthal
     * @since : 2012-11
     *
     * @description : abre uma entidade
     */
    this.entity = function (params) {
        empreendemia.apps.open({
            app : params.app,
            route : params.route,
            close : params.close,
            caller : app,
            open : function (tool) {
                tool.open(params.data);
                empreendemia.apps.render(tool, false, app);
            }
        });
    };

    /** list
     *
     * @autor : Rafael Erthal
     * @since : 2012-11
     *
     * @description : embeda uma lista
     */
     this.embeddedList = function (params) {
        empreendemia.apps.open({
            app : params.app,
            route : params.route,
            close : params.close,
            caller : app,
            open : function (tool) {
                tool.open(params.data);
                if (params.open) {
                    params.open.apply(app, [tool.ui]);
                }
            }
        });
     };

    /** entity
     *
     * @autor : Rafael Erthal
     * @since : 2012-11
     *
     * @description : embeda uma entidade
     */
     this.embeddedEntity = function (params) {
        empreendemia.apps.open({
            app : params.app,
            route : params.route,
            close : params.close,
            caller : app,
            open : function (tool) {
                tool.open(params.data);
                if (params.open) {
                    params.open.apply(app, [tool.ui]);
                }
            }
        });
     };
};
