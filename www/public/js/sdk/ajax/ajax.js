/** AJAX
 *
 * @autor : Rafael Erthal
 * @since : 2012-08
 *
 * @description : implementa a biblioteca de chamadas assincronas ao servidor
 * @param app : contexto em que os callbacks serão executados
 */

sdk.modules.ajax = function (app) {
    "use strict";

    /** get
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : realiza chamada CORS com método GET
     */
    this.get = function (path, cb) {
        app.ui.loading(true);

        empreendemia.ajax.get(path, function (data) {
            app.ui.loading(false);
            if (data && data.error && data.error.name === 'InvalidTokenError') {
                empreendemia.user.login();
            } else {
                if (cb) {
                    cb.apply(app, [data])
                }
            }
        });
    };

    /** post
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : realiza chamada CORS com método POST
     */
    this.post = function (path, cb) {
        app.ui.loading(true);

        empreendemia.ajax.post(path, function (data) {
            app.ui.loading(false);
            if (data && data.error && data.error.name === 'InvalidTokenError') {
                empreendemia.user.login();
            } else {
                if (cb) {
                    cb.apply(app, [data])
                }
            }
        });
    };

    /** put
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : realiza chamada CORS com método PUT
     */
    this.put = function (path, cb) {
        app.ui.loading(true);

        empreendemia.ajax.put(path, function (data) {
            app.ui.loading(false);
            if (data && data.error && data.error.name === 'InvalidTokenError') {
                empreendemia.user.login();
            } else {
                if (cb) {
                    cb.apply(app, [data])
                }
            }
        });
    };

    /** del
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : realiza chamada CORS com método DELETE
     */
    this.del = function (path, cb) {
        app.ui.loading(true);

        empreendemia.ajax.del(path, function (data) {
            app.ui.loading(false);
            if (data && data.error && data.error.name === 'InvalidTokenError') {
                empreendemia.user.login();
            } else {
                if (cb) {
                    cb.apply(app, [data])
                }
            }
        });
    };
};
