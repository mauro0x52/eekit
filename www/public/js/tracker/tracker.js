/*
 * Biblioteca de web analytics do eeKit
 *
 * @author: rafael erthal
 * @since: 2013-05
 */

var ajax = module.use('ajax'),
    config = module.use('config');

module.exports({

    /* Grava evento de web analytics na api do tracker
     *
     * @author: rafael erthal
     * @since: 2013-05
     */
    event : function (label, app) {

        var query = {},
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

        ajax.post({
            url : 'http://' + config.services.tracker.host + ':' + config.services.tracker.port + '/event',
            data : data
        }, function (response) {});

    }

});