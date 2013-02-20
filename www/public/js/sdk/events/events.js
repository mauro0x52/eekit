/** Events
 *
 * @autor : Rafael Erthal
 * @since : 2013-01
 *
 * @description : implementa a biblioteca de eventos do sdk
 */

sdk.modules.events = function (app) {
    /** bind
     *
     * @autor : Rafael Erthal
     * @since : 2013-01
     *
     * @description : registra evento
     * @param event : nome do evento
     * @param callback : função a ser chamada
     */
    this.bind = function (event, callback) {
        empreendemia.events.bind(app, event, callback);
    };

    /** trigger
     *
     * @autor : Rafael Erthal
     * @since : 2013-01
     *
     * @description : dispara evento
     * @param event : nome do evento
     * @param data : dados do evento
     */
    this.trigger = function (event, data) {
        empreendemia.events.bind(event, data);
    };

};
