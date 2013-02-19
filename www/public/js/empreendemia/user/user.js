/** user
 *
 * @autor : Rafael Erthal
 * @since : 2012-10
 *
 * @description : controlador de seção de usuário
 */
empreendemia.user = {
    token : getCookie('token'),

    login : function () {
        empreendemia.apps.open({
            app   : 'ee',
            route : '/login',
            open  : function (tool) {
                tool.open();
                empreendemia.apps.dialog(tool);
            },
            close : function (params) {
                if (params) {
                    empreendemia.user.token = params.token;
                    empreendemia.load();
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
                empreendemia.apps.dialog(tool);
            },
            close : function (token) {
                empreendemia.user.token = token;
                setCookie('token', token, 1);
                empreendemia.load();
            }
        });
    },

    logout : function () {
        empreendemia.user.token = null;
        setCookie('token', null, 0);
        setCookie('remindme', null, 0);
        empreendemia.load();
    },

    profile : function (cb) {
        empreendemia.ajax.get({
            url : 'http://' + empreendemia.config.services.profiles.host + ':' + empreendemia.config.services.profiles.port + '/profile'
        }, function (response) {
            if (response && !response.error) {
                if (getCookie('remindme')) {
                    setCookie('token', empreendemia.user.token, 30);
                    setCookie('id', response.profile._id, 30);
                } else {
                    setCookie('token', empreendemia.user.token, 1);
                    setCookie('id', response.profile._id, 1);
                }
                cb(response.profile);
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
                empreendemia.apps.dialog(tool);
            }
        });
    }
};