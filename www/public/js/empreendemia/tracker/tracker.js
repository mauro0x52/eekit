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
        var query = queryToJson(location.search);
        empreendemia.ajax.post({
            url : 'http://' + empreendemia.config.services.tracker.host + ':' + empreendemia.config.services.tracker.port + '/event',
            data : {
                app : app.name,
                source : source,
                label : event,
                utm_source : query.utm_source,
                utm_medium : query.utm_medium,
                utm_content : query.utm_content,
                utm_campaign : query.utm_campaign
            }
        }, function (response) {
            empreendemia.tracker.events.push(response.event);
        });
    }
}
