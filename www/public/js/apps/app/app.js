/*
 * Classe que representa um aplicativo do eekit
 *
 * @author: rafael erthal
 * @since: 2013-05
 */

module.exports(new Class (function (params) {

    var that = this;

    if (!params) {
        throw {
            source    : 'app.js',
            method    : 'constructor',
            message   : 'Params must be a object',
            arguments : arguments
        };
    }

    if (!params.name || params.name.constructor !== String) {
        throw {
            source    : 'app.js',
            method    : 'constructor',
            message   : 'Name must be a string',
            arguments : arguments
        };
    }

    if (!params.slug || params.slug.constructor !== String) {
        throw {
            source    : 'app.js',
            method    : 'constructor',
            message   : 'Slug must be a string',
            arguments : arguments
        };
    }

    if (!params.source || params.source.constructor !== String) {
        throw {
            source    : 'app.js',
            method    : 'constructor',
            message   : 'Source must be a string',
            arguments : arguments
        };
    }

    this.name = function () {

        return params.name;

    };

    this.slug = function () {

        return params.slug;

    };

    this.caller = function () {

        return params.caller;

    };

    this.route = function () {

        return null;

    };

    this.type = function () {

        return null;

    };

    this.params = function () {

        return null

    };

    /* Encerra a execução do app e remove-o da ui
     *
     * @author: rafael erthal
     * @since: 2013-05
     */
    this.close = function () {

    }

    /* Controla a biblioteca de ajax do app
     *
     * @author: rafael erthal
     * @since: 2013-05
     */
    this.ajax = {

        get : function (path, cb) {

            Empreendekit.ajax.get(path, cb, that);

        },

        put : function (path, cb) {

            Empreendekit.ajax.put(path, cb, that);

        },

        post : function (path, cb) {

            Empreendekit.ajax.post(path, cb, that);

        },

        del : function (path, cb) {

            Empreendekit.ajax.del(path, cb, that);

        }

    };

    /* Controla a biblioteca de embeds e acionadores do app
     *
     * @author: rafael erthal
     * @since: 2013-05
     */
    this.apps = {

        open : function (params) {

            Empreendekit.apps.open(params, that);

        }

    };

    /* Controla a biblioteca de eventos do app
     *
     * @author: rafael erthal
     * @since: 2013-05
     */
    this.events = {

        bind : function (event, callback) {

            Empreendekit.events.bind(event, callback, that);

        },

        trigger : function (event, data) {

            Empreendekit.events.trigger(event, data, that);

        }

    };

    /* Controla a biblioteca de rotas do app
     *
     * @author: rafael erthal
     * @since: 2013-05
     */
    this.routes = {

        list : function (route, callback) {

            Empreendekit.routes.list(route, callback, that);

        },

        entity : function (route, callback) {

            Empreendekit.routes.entity(route, callback, that);

        },

        embedList : function (route, callback) {

            Empreendekit.routes.embedList(route, callback, that);

        },

        embedEntity : function (route, callback) {

            Empreendekit.routes.embedEntity(route, callback, that);

        },

        dialog : function (route, callback) {

            Empreendekit.routes.dialog(route, callback, that);

        },

        frame : function (route, callback) {

            Empreendekit.routes.frame(route, callback, that);

        }

    };

    /* Controla a biblioteca de web analytics do app
     *
     * @author: rafael erthal
     * @since: 2013-05
     */
    this.tracker = {

        event : function (label) {

            Empreendekit.tracker.event(label, that);

        }

    };

    source = (
        new Function('app', params.source)
    ).apply(this, [this]);

    if (!this.route()) {

        throw {
            source    : 'app.js',
            method    : 'constructor',
            message   : 'Route not found',
            arguments : arguments
        };

    }

    this.ui = new Empreendekit.ui[this.type()](this);
    this.route().apply(this, [this.params()]);

}));