/*
 * Biblioteca de ajax do eeKit
 *
 * @author Rafael Erthal
 * @since  2013-05
 */

var auth = module.use('auth'),
    ajax = new Ajax();

module.exports({

    /* realiza chamada CORS com método GET
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    get : function (path, cb, app) {

        if (!path) {
            throw new Error({
                source     : 'ajax.js',
                method     : 'get',
                message    : 'Path must be especified',
                arguments : arguments
            });
        }

        if (!path.url || path.url.constructor !== String) {
            throw new Error({
                source     : 'ajax.js',
                method     : 'get',
                message    : 'Url must be a string',
                arguments : arguments
            });
        }

        auth.service.authorize(path.url, function (token) {
            path.data = path.data || {};
            path.data.token = token;

            ajax.get(path.url, {
                data : path.data,
                onsuccess : function (data) {
                    if (cb) {
                        cb(eval('(' + data + ')'));
                    }
                }
            });
        });

    },

    /* realiza chamada CORS com método POST
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    post : function (path, cb, app) {

        if (!path) {
            throw new Error({
                source     : 'ajax.js',
                method     : 'post',
                message    : 'Path must be especified',
                arguments : arguments
            });
        }

        if (!path.url || path.url.constructor !== String) {
            throw new Error({
                source     : 'ajax.js',
                method     : 'post',
                message    : 'Url must be a string',
                arguments : arguments
            });
        }

        auth.service.authorize(path.url, function (token) {
            path.data = path.data || {temp : 'lalala'};
            path.data.token = token;

            ajax.post(path.url, {
                data : path.data,
                onsuccess : function (data) {
                    if (cb) {
                        cb(eval('(' + data + ')'));
                    }
                }
            });
        });

    }

});