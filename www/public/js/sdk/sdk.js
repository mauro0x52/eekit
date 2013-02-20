/** SDK
 *
 * @autor : Rafael Erthal
 * @since : 2012-10
 *
 * @description : controlador de carregamento de aplicativos
 */
var sdk = {
    modules : {},

    /** build
     *
     * @autor : Rafael Erthal
     * @since : 2012-10
     *
     * @description : parseia o código do app
     */
    build : function (source) {
        var document = undefined,
            window = undefined,
            navigator = undefined,
            screen = undefined,
            history = undefined,
            location = undefined,
            alert = undefined,
            prompt = undefined,
            confirm = undefined,
            header = undefined,
            sdk = undefined,
            empreendemia = undefined,
            setCookie = undefined,
            getCookie = undefined,
            jsonToQuery = undefined,
            queryToJson = undefined,
            ajaxRequest = undefined,
            app;

        eval(source);
        return app;
    },

    /** open
     *
     * @autor : Rafael Erthal
     * @since : 2012-10
     *
     * @description : aciona a ferramenta
     */
    open : function (tool) {
        var app = this.build(tool.source);
        app.slug = tool.slug;
        app.name = tool.name;
        app.config = sdk.config;
        for (var prop in sdk.modules) {
            app[prop] = new sdk.modules[prop](app);
        }
        if (app.slug === 'ee') {
            app.empreendemia = empreendemia;
        }

        app.start();
        app.start = undefined;

        return app;
    }
};
