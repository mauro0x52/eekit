/** Tracker
 *
 * @autor : Rafael Erthal
 * @since : 2012-08
 *
 * @description : implementa a biblioteca de track do usuário
 */

sdk.modules.tracker = function (app) {
    /** event
     *
     * @autor : Rafael Erthal
     * @since : 2012-10
     *
     * @description : registra evento
     * @param event : nome do evento
     */
    this.event = function (event) {
        if (app.ui.type() === 'dialog' && app.caller() && app.caller().ui && app.caller().ui.type) {
            if (app.caller().ui.type() === 'embbed list' || app.caller().ui.type() === 'embbed entity') {
                empreendemia.tracker.event(event, app, app.caller().caller().name);
            } else {
                empreendemia.tracker.event(event, app);
            }
        } else if ((app.ui.type() === 'embbed list' || app.ui.type() === 'embbed entity') && app.caller()) {
            empreendemia.tracker.event(event, app, app.caller().name);
        } else {
            empreendemia.tracker.event(event, app);
        }
    }
};
