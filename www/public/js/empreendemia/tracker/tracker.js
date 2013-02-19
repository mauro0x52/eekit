/** Tracker
 *
 * @autor : Rafael Erthal
 * @since : 2012-08
 *
 * @description : implementa a biblioteca de track do usuário
 */

empreendemia.tracker = {
    events : [],
    
    /** event
     *
     * @autor : Rafael Erthal
     * @since : 2012-10
     *
     * @description : registra evento no tracker
     */
    event : function(event, app, source){
        empreendemia.ajax.post({
            url : 'http://' + empreendemia.config.services.tracker.host + ':' + empreendemia.config.services.tracker.port + '/event',
            data : {
                token : empreendemia.user.token,
                app : app.name,
                source : source,
                label : event
            }
        }, function (response) {
            empreendemia.tracker.events.push(response.event);
        });
    }
}
