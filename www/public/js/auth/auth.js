/*
 * Biblioteca de autenticação do eeKit
 *
 * @author Rafael Erthal
 * @since  2013-05
 */

module.exports({

    user : {

        signin : function () {
            Empreendekit.path.redirect('ee/login', {close : function (data) {
                setToken(data.token, data.remindme);
                Empreendekit.config.services.www.token = data.token;
                Empreendekit.path.redirect('tarefas/');

                empreendemia.socket.emit('auth', {
                    user    : empreendemia.config.user,
                    company : empreendemia.config.company
                });

            }});
        },

        signup : function () {

        },

        signout : function () {
            setToken(null, 0);
        },

        validate : function (cb) {
            Empreendekit.ajax.get({url : 'http://' + Empreendekit.config.services.auth.host + ':' + Empreendekit.config.services.auth.port + '/validate', data : {
                secret : Empreendekit.config.services.www.secret,
                token : getToken()
            }}, function (data) {
                cb(data);
            });
        }

    },

    service : {

        authorize : function (servicePort, cb) {
            if (!Empreendekit.config) {
                cb();
            } else {
                var service;

                for (var i in Empreendekit.config.services) {
                    if (Empreendekit.config.services[i].port.toString() === servicePort.toString()) {
                        service = i;
                    }
                }

                if (!service || !Empreendekit.config.services[service]) {
                    cb();
                } else if (Empreendekit.config.services[service].token) {
                    cb(Empreendekit.config.services[service].token);
                } else {
                    Empreendekit.ajax.post({url : 'http://' + Empreendekit.config.services.auth.host + ':' + Empreendekit.config.services.auth.port + '/service/' + service + '/authorize', data : {
                        secret : Empreendekit.config.services.www.secret,
                        token : getToken()
                    }}, function (data) {
                        Empreendekit.config.services[service].token = data.token;
                        cb(data.token);
                    });
                }
            }
        }

    }

});