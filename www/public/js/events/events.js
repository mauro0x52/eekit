/*
 * Biblioteca de controle de eventos do eeKit
 *
 * @author: rafael erthal
 * @since: 2013-05
 */

var events = [];

module.exports({

    /* registra evento
     *
     * @author: rafael erthal
     * @since: 2013-05
     */
    bind : function (event, callback, app) {

        if (!app) {
            throw {
                source     : 'events.js',
                method     : 'bind',
                message    : 'App must be especified',
                arguments : arguments
            };
        }

        if (!event || event.constructor !== String) {
            throw {
                source     : 'events.js',
                method     : 'bind',
                message    : 'Event must be a string',
                arguments : arguments
            };
        }

        if (!callback || callback.constructor !== Function) {
            throw {
                source     : 'events.js',
                method     : 'bind',
                message    : 'Callback must be a function',
                arguments : arguments
            };
        }

        events.push({
            app      : app,
            event    : event,
            callback : callback
        });

    },

    /* dispara evento
     *
     * @author: rafael erthal
     * @since: 2013-05
     */
    trigger : function (event, data, app) {

        var i;

        if (!event || event.constructor !== String) {
            throw {
                source     : 'events.js',
                method     : 'trigger',
                message    : 'Event must be a string',
                arguments : arguments
            };
        }

        for (i in events) {
            if (events[i].event === event) {
                events[i].callback.apply(events[i].app, [data]);
            }
        }

    }

});