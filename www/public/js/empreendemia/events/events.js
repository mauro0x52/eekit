/** Events
 *
 * @autor : Rafael Erthal
 * @since : 2013-02
 *
 * @description : implementa a biblioteca de eventos do sdk
 */

empreendemia.events = {
    registered : [],

    /** bind
     *
     * @autor : Rafael Erthal
     * @since : 2013-01
     *
     * @description : registra evento
     * @param app : app do evento
     * @param event : nome do evento
     * @param callback : função a ser chamada
     */
    bind : function (app, event, callback) {
        empreendemia.events.registered.push({
            app : app,
            event : event,
            callback : callback
        });
    },

    /** trigger
     *
     * @autor : Rafael Erthal
     * @since : 2013-01
     *
     * @description : dispara evento
     * @param event : nome do evento
     * @param data : dados do evento
     */
    trigger : function (event, data) {
        var i;
        for (i in empreendemia.events.registered) {
            if (empreendemia.events.registered[i].event === event) {
                empreendemia.events.registered[i].callback.apply(empreendemia.events.registered[i].app, [data]);
            }
        }
    }
}
