/** user
 *
 * @autor : Rafael Erthal
 * @since : 2012-10
 *
 * @description : controlador de seção de usuário
 */
empreendemia.user = {
    auth : function (cb) {
        var www_token = getCookie('token');
        if (www_token) {
            empreendemia.ajax.get({
                url : 'http://' + empreendemia.config.services.auth.host + ':' + empreendemia.config.services.auth.port + '/validate',
                data : {
                    secret : empreendemia.config.services.www.secret,
                    token  : www_token
                }
            }, function (data) {
                sdk.config.user = data.user;
                var i;
                if (data && data.tokens) {
                    for (i in data.tokens) {
                        if (new Date() < new Date(data.tokens[i].dateExpiration)) {
                            empreendemia.config.services[data.tokens[i].service].token = data.tokens[i].token;
                        }
                    }
                }
                empreendemia.user.companyUsers(cb);
            });
        } else {
            cb();
        }
    },

    companyUsers : function (cb) {
        var www_token = getCookie('token');
        empreendemia.ajax.get({
            url : 'http://' + empreendemia.config.services.auth.host + ':' + empreendemia.config.services.auth.port + '/company/users',
            data : {
                token : www_token
            }
        }, function (data) {
            empreendemia.config.users = data.users;
            sdk.config.users = data.users;
            cb();
        });
    },

    serviceLogin : function (service, cb) {
        var www_token = getCookie('token');
        if (www_token) {
            empreendemia.ajax.post({
                url : 'http://' + empreendemia.config.services.auth.host + ':' + empreendemia.config.services.auth.port + '/service/' + service + '/authorize',
                data : {
                    secret : empreendemia.config.services.www.secret,
                    token  : www_token
                }
            }, function (data) {
                empreendemia.config.services[service].token = data.token;
                cb(empreendemia.config.services[service].token);
            });
        } else {
            cb();
        }
    },

    login : function () {
        empreendemia.apps.open({
            app   : 'ee',
            route : '/login',
            open  : function (tool) {
                tool.open();
                empreendemia.apps.render(tool);
            },
            close : function (params) {
                if (params && params.token) {
                    if (params.remindme) {
                        setCookie('token', params.token, 30);
                    } else {
                        setCookie('token', params.token, 1);
                    }
                    empreendemia.user.auth(function () {
                        empreendemia.load();
                    });
                }
            }
        });
    },

    signup : function () {
        empreendemia.apps.open({
            app   : 'ee',
            route : '/cadastro',
            open  : function (tool) {
                tool.open();
                empreendemia.apps.render(tool);
            },
            close : function (params) {
                if (params && params.token) {
                    if (params.remindme) {
                        setCookie('token', params.token, 30);
                    } else {
                        setCookie('token', params.token, 1);
                    }
                    empreendemia.user.auth(function () {
                        empreendemia.routes.set('ee/usuario-cadastrado');
                        empreendemia.load();
                    });
                }
            }
        });
    },

    logout : function () {
        var www_token = getCookie('token');
        empreendemia.ajax.post({
            url : 'http://' + empreendemia.config.services.auth.host + ':' + empreendemia.config.services.auth.port + '/user/logout',
            data : {
                secret : empreendemia.config.services.www.secret,
                token  : www_token
            }
        }, function (data) {
            var i;
            setCookie('token', null, 0);
            setCookie('remindme', null, 0);
            for (i in empreendemia.config.services) {
                empreendemia.config.services[i].token = undefined;
            }
            empreendemia.routes.set('ee/');
            empreendemia.load();
        });
    },

    profile : function (cb) {
        var www_token = getCookie('token');
        empreendemia.ajax.get({
            url : 'http://' + empreendemia.config.services.auth.host + ':' + empreendemia.config.services.auth.port + '/validate',
            data : {
                secret : empreendemia.config.services.www.secret,
                token : www_token
            }
        }, function (response) {
            if (response && !response.error) {
                if (getCookie('remindme')) {
                    setCookie('token', getCookie('token'), 30);
                } else {
                    setCookie('token', getCookie('token'), 1);
                }
                cb(response.user);
            } else {
                cb(null);
            }
        });
    },

    apps : function (cb) {
        empreendemia.ajax.get({
            url : 'http://' + empreendemia.config.services.apps.host + ':' + empreendemia.config.services.apps.port + '/apps'
        }, function (response) {
            if (response && !response.error) {
                cb(response.apps);
            } else {
                cb(null);
            }
        });
    },

    feedback : function () {
        empreendemia.apps.open({
            app   : 'ee',
            route : '/feedback',
            open  : function (tool) {
                tool.open({
                    user : getCookie('id'),
                    events : empreendemia.tracker.events,
                    html : document.body.innerHTML
                });
                empreendemia.apps.render(tool);
            }
        });
    }
};