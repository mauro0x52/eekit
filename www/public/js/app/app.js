/*
 * Classe que representa um aplicativo do eekit
 *
 * @author Rafael Erthal
 * @since  2013-05
 */

module.exports(new Class (function (params) {

    var that       = this,
        app        = this,
        route      = null,
        callback   = null,
        type       = null,
        parameters = null,
        close_cb;

    if (!params) {
        throw new Error({
            source    : 'app.js',
            method    : 'constructor',
            message   : 'Params must be a object',
            arguments : arguments
        });
    }

    if (!params.name || params.name.constructor !== String) {
        throw new Error({
            source    : 'app.js',
            method    : 'constructor',
            message   : 'Name must be a string',
            arguments : arguments
        });
    }

    if (!params.slug || params.slug.constructor !== String) {
        throw new Error({
            source    : 'app.js',
            method    : 'constructor',
            message   : 'Slug must be a string',
            arguments : arguments
        });
    }

    if (!params.source || params.source.constructor !== String) {
        throw new Error({
            source    : 'app.js',
            method    : 'constructor',
            message   : 'Source must be a string',
            arguments : arguments
        });
    }

    this.config = Empreendekit.config;

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

        return route;

    };

    this.callback = function () {

        return callback;

    };

    this.type = function () {

        return type;

    };

    this.params = function () {

        return parameters;

    };

    /* Encerra a execução do app e remove-o da ui
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.close = function (value) {
        if (!value || value.constructor != Function) {
            this.ui.close();
            delete this;
            if (close_cb) {
                close_cb(value);
            }
        } else {
            close_cb = value;
        }
    }

    /* Controla a biblioteca de ajax do app
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.ajax = {

        get : function (path, cb) {

            Empreendekit.ajax.get(path, function (data) {
                if (data.error && data.error.name === 'InvalidTokenError') {
                    Empreendekit.auth.login();
                } else {
                    cb(data);
                }
            }, that);

        },

        put : function (path, cb) {

            Empreendekit.ajax.put(path, function (data) {
                if (data.error && data.error.name === 'InvalidTokenError') {
                    Empreendekit.auth.login();
                } else {
                    cb(data);
                }
            }, that);

        },

        post : function (path, cb) {

            Empreendekit.ajax.post(path, function (data) {
                if (data.error && data.error.name === 'InvalidTokenError') {
                    Empreendekit.auth.login();
                } else {
                    cb(data);
                }
            }, that);

        },

        del : function (path, cb) {

            Empreendekit.ajax.del(path, function (data) {
                if (data.error && data.error.name === 'InvalidTokenError') {
                    Empreendekit.auth.login();
                } else {
                    cb(data);
                }
            }, that);

        }

    };

    /* Controla a biblioteca de embeds e acionadores do app
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.apps = {

        open : function (params) {

            Empreendekit.path.redirect(params.app + params.route, that);

        }

    };

    /* Controla a biblioteca de eventos do app
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.events = {

        bind : function (label, callback) {

            if (!label || label.constructor !== String) {
                throw new Error({
                    source    : 'app.js',
                    method    : 'bind',
                    message   : 'Label must be a string',
                    arguments : arguments
                });
            }

            if (!callback || callback.constructor !== Function) {
                throw new Error({
                    source    : 'app.js',
                    method    : 'bind',
                    message   : 'Callback must be a function',
                    arguments : arguments
                });
            }

            that.addEventListener(label, callback, true);

        },

        trigger : function (label, data) {

            if (!label || label.constructor !== String) {
                throw new Error({
                    source    : 'app.js',
                    method    : 'trigger',
                    message   : 'Label must be a string',
                    arguments : arguments
                });
            }

            that.dispatchEvent(new CustomEvent(label, data));

        }

    };

    /* Controla a biblioteca de rotas do app
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.routes = {

        list : function (path, fn) {

            if (!path || path.constructor !== String) {
                throw new Error({
                    source    : 'app.js',
                    method    : 'list',
                    message   : 'Path must be a string',
                    arguments : arguments
                });
            }

            if (!fn || fn.constructor !== Function) {
                throw new Error({
                    source    : 'app.js',
                    method    : 'list',
                    message   : 'Callback must be a function',
                    arguments : arguments
                });
            }

            if (Empreendekit.path.match('/' + that.slug() + path)) {
                route      = location.pathname;
                callback   = fn;
                type       = 'list';
                parameters = Empreendekit.path.params('/' + that.slug() + path);
            }

        },

        entity : function (path, fn) {

            if (!path || path.constructor !== String) {
                throw new Error({
                    source    : 'app.js',
                    method    : 'entity',
                    message   : 'Route must be a string',
                    arguments : arguments
                });
            }

            if (!fn || fn.constructor !== Function) {
                throw new Error({
                    source    : 'app.js',
                    method    : 'entity',
                    message   : 'Callback must be a function',
                    arguments : arguments
                });
            }

            if (Empreendekit.path.match('/' + that.slug() + path)) {
                route      = location.pathname;
                callback   = fn;
                type       = 'entity';
                parameters = Empreendekit.path.params('/' + that.slug() + path);
            }

        },

        embedList : function (path, fn) {

            if (!path || path.constructor !== String) {
                throw new Error({
                    source    : 'app.js',
                    method    : 'embedList',
                    message   : 'Route must be a string',
                    arguments : arguments
                });
            }

            if (!fn || fn.constructor !== Function) {
                throw new Error({
                    source    : 'app.js',
                    method    : 'embedList',
                    message   : 'Callback must be a function',
                    arguments : arguments
                });
            }

            if (Empreendekit.path.match('/' + that.slug() + path)) {
                route      = location.pathname;
                callback   = fn;
                type       = 'embedList';
                parameters = Empreendekit.path.params('/' + that.slug() + path);
            }

        },

        embedEntity : function (path, fn) {

            if (!path || path.constructor !== String) {
                throw new Error({
                    source    : 'app.js',
                    method    : 'embedEntity',
                    message   : 'Route must be a string',
                    arguments : arguments
                });
            }

            if (!fn || fn.constructor !== Function) {
                throw new Error({
                    source    : 'app.js',
                    method    : 'embedEntity',
                    message   : 'Callback must be a function',
                    arguments : arguments
                });
            }

            if (Empreendekit.path.match('/' + that.slug() + path)) {
                route      = location.pathname;
                callback   = fn;
                type       = 'embedEntity';
                parameters = Empreendekit.path.params('/' + that.slug() + path);
            }

        },

        dialog : function (path, fn) {

            if (!path || path.constructor !== String) {
                throw new Error({
                    source    : 'app.js',
                    method    : 'dialog',
                    message   : 'Route must be a string',
                    arguments : arguments
                });
            }

            if (!fn || fn.constructor !== Function) {
                throw new Error({
                    source    : 'app.js',
                    method    : 'dialog',
                    message   : 'Callback must be a function',
                    arguments : arguments
                });
            }

            if (Empreendekit.path.match('/' + that.slug() + path)) {
                route      = location.pathname;
                callback   = fn;
                type       = 'dialog';
                parameters = Empreendekit.path.params('/' + that.slug() + path);
            }

        },

        frame : function (path, fn) {

            if (!path || path.constructor !== String) {
                throw new Error({
                    source    : 'app.js',
                    method    : 'frame',
                    message   : 'Route must be a string',
                    arguments : arguments
                });
            }

            if (!fn || fn.constructor !== Function) {
                throw new Error({
                    source    : 'app.js',
                    method    : 'frame',
                    message   : 'Callback must be a function',
                    arguments : arguments
                });
            }

            if (Empreendekit.path.match('/' + that.slug() + path)) {
                route      = location.pathname;
                callback   = fn;
                type       = 'frame';
                parameters = Empreendekit.path.params('/' + that.slug() + path);
            }

        }

    };

    /* Controla a biblioteca de web analytics do app
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.tracker = {

        event : function (label) {

            var query = {/* PEGAR UTMS NAS ROTAS */},
                data = {
                    app : app.name(),
                    label : label,
                    utm_source : query.utm_source,
                    utm_medium : query.utm_medium,
                    utm_content : query.utm_content,
                    utm_campaign : query.utm_campaign
                };

            if (!label || label.constructor !== String) {
                throw new Error({
                    source     : 'tracker.js',
                    method     : 'event',
                    message    : 'Label must be a string',
                    arguments : arguments
                });
            }

            if (
                that.caller() &&
                (
                    that.type() === 'embbed list'   ||
                    that.type() === 'embbed entity' ||
                    that.type() === 'dialog'
                )
            ) {
                data.source = that.caller().name();
            }

            Empreendekit.ajax.post({
                url : 'http://' + Empreendekit.config.services.tracker.host + ':' + Empreendekit.config.services.tracker.port + '/event',
                data : data
            });

        }

    };

    source = (
        new Function('app', params.source)
    ).apply(this, [this]);

    if (!this.callback()) {

        throw new Error({
            source    : 'app.js',
            method    : 'constructor',
            message   : 'Route not found',
            arguments : arguments
        });

    }

    this.ui = new Empreendekit.ui[this.type()](this);

    this.callback().apply(this, [this.params()]);

}));