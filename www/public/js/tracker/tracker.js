/*
 * Biblioteca de web analytics do eeKit
 *
 * @author: rafael erthal
 * @since: 2013-05
 */

module.exports({

    /* Grava evento de web analytics na api do tracker
     *
     * @author: rafael erthal
     * @since: 2013-05
     */
    event : function (label, app) {

        var query = queryToJson(location.search),
            data = {
                app : app.name,
                label : label,
                utm_source : query.utm_source,
                utm_medium : query.utm_medium,
                utm_content : query.utm_content,
                utm_campaign : query.utm_campaign
            };

        if (!label || label.constructor !== String) {
            throw {
                source     : 'tracker.js',
                method     : 'event',
                message    : 'Label must be a string',
                arguments : arguments
            };
        }

        if (
            app &&
            app.caller() &&
            (
                app.type() === 'embbed list'   ||
                app.type() === 'embbed entity' ||
                app.type() === 'dialog'
            )
        ) {
            data.source = app.caller();
        }

        empreendemia.ajax.post({
            url : 'http://' + empreendemia.config.services.tracker.host + ':' + empreendemia.config.services.tracker.port + '/event',
            data : data
        }, function (response) {});

    }

});