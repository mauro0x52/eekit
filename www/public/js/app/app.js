/*
 * Classe que representa um aplicativo do eekit
 *
 * @author Rafael Erthal
 * @since  2013-05
 */

module.exports(new Class (function (params) {

    var that       = this,
        app        = this,
        callback   = null,
        type       = null,
        parameters = null,
        events     = [];

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
    this.config.users = params.users;

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

        return params.route;

    };

    this.data = function () {

        return params.data;

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
        that.ui.close();
        delete that;
        if (params.close) {
            params.close(value);
        }
    }

    /* Controla a biblioteca de ajax do app
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.ajax = {

        get : function (path, cb) {

            if (that.ui.loading) {
                that.ui.loading(true);
            }

            Empreendekit.ajax.get(path, function (data) {
                if (data.error && data.error.name === 'InvalidTokenError') {
                    Empreendekit.path.redirect('ee/');
                } else {
                    cb(data);
                    if (that.ui.loading) {
                        setTimeout(function () { that.ui.loading(false); }, 1000);
                    }
                }
            }, that);

        },

        post : function (path, cb) {

            if (that.ui.loading) {
                that.ui.loading(true);
            }

            Empreendekit.ajax.post(path, function (data) {
                if (data.error && data.error.name === 'InvalidTokenError') {
                    Empreendekit.path.redirect('ee/');
                } else {
                    cb(data);
                    if (that.ui.loading) {
                        setTimeout(function () { that.ui.loading(false); }, 1000);
                    }
                }
            }, that);

        }

    };

    /* Abre um novo app
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.open = function (params) {
        params = params || {},
        params.caller = that;

        Empreendekit.path.redirect(params.app + params.route, params);

    };

    /* Escuta um evento do kamisama
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.bind = function (label, callback) {

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

        events.push({label : label, callback : callback})

    };

    /* Dispara um evento
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.trigger = function (label, data) {

        if (!label || label.constructor !== String) {
            throw new Error({
                source    : 'app.js',
                method    : 'trigger',
                message   : 'Label must be a string',
                arguments : arguments
            });
        }

        for (var i in events) {
            if (events[i].label === label) {
                events[i].callback(data);
            }
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

            if (Empreendekit.path.match('/' + that.slug() + path, params.route)) {
                callback   = fn;
                type       = 'list';
                parameters = Empreendekit.path.params('/' + that.slug() + path, params.route);
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

            if (Empreendekit.path.match('/' + that.slug() + path, params.route)) {
                callback   = fn;
                type       = 'entity';
                parameters = Empreendekit.path.params('/' + that.slug() + path, params.route);
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

            if (Empreendekit.path.match('/' + that.slug() + path, params.route)) {
                callback   = fn;
                type       = 'embedList';
                parameters = Empreendekit.path.params('/' + that.slug() + path, params.route);
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

            if (Empreendekit.path.match('/' + that.slug() + path, params.route)) {
                callback   = fn;
                type       = 'embedEntity';
                parameters = Empreendekit.path.params('/' + that.slug() + path, params.route);
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

            if (Empreendekit.path.match('/' + that.slug() + path, params.route)) {
                callback   = fn;
                type       = 'dialog';
                parameters = Empreendekit.path.params('/' + that.slug() + path, params.route);
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

            if (Empreendekit.path.match('/' + that.slug() + path, params.route)) {
                callback   = fn;
                type       = 'frame';
                parameters = Empreendekit.path.params('/' + that.slug() + path, params.route);
            }

        }

    };

    /* Controla a biblioteca de web analytics do app
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.event = function (label) {

        var query = {/* PEGAR UTMS NAS ROTAS */},
            data = {
                app : app.slug(),
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

        _gaq.push(['_trackEvent', app.name(), label]);

        Empreendekit.ajax.post({
            url : 'http://' + Empreendekit.config.services.tracker.host + ':' + Empreendekit.config.services.tracker.port + '/event',
            data : data
        });

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

    this.callback().apply(this, [this.params(), this.data()]);

}));