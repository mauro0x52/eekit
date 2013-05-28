/*
 * Biblioteca de autenticação do eeKit
 *
 * @author Rafael Erthal
 * @since  2013-05
 */

module.exports({

    user : {

        signin : function () {
            if (getToken()) {
                Empreendekit.path.redirect('tarefas/');
            } else {
                Empreendekit.path.redirect('ee/login', {
                    close : function (data) {
                        setToken(data.token, data.remindme);
                        Empreendekit.config.services.www.token = data.token;
                        Empreendekit.path.redirect('tarefas/');
                        Empreendekit.auth.user.validate();
                    }
                });
            }
        },

        signup : function () {
            if (getToken()) {
                Empreendekit.path.redirect('tarefas/');
            } else {
                Empreendekit.path.redirect('ee/cadastrar', {
                    close : function (data) {
                        if (data) {
                            setToken(data.token, false);
                            Empreendekit.config.services.www.token = data.token;
                            Empreendekit.path.redirect('ee/usuario-cadastrado');
                            Empreendekit.auth.user.validate();
                        }
                    }
                });
            }
        },

        signout : function () {
            var token = getToken();
            clearToken();
            Empreendekit.ajax.post({url : 'http://' + Empreendekit.config.services.auth.host + ':' + Empreendekit.config.services.auth.port + '/user/logout', data : {
                secret : Empreendekit.config.services.www.secret,
                token : token
            }}, function (data) {
                Empreendekit.path.redirect('ee/');
                Empreendekit.socket.emit('auth', {
                    user    : null,
                    company : null
                });
            });
        },

        validate : function () {
            Empreendekit.ajax.get({url : 'http://' + Empreendekit.config.services.auth.host + ':' + Empreendekit.config.services.auth.port + '/validate', data : {
                secret : Empreendekit.config.services.www.secret,
                token : getToken()
            }}, function (data) {
                if (data && data.user) {
                    Empreendekit.config.user = data.user;
                    Empreendekit.socket.emit('auth', {
                        user    : data.user._id,
                        company : data.company._id
                    });
                }
            });
        }

    },

    company : {

        users : function (cb) {
            Empreendekit.ajax.get({url : 'http://' + Empreendekit.config.services.auth.host + ':' + Empreendekit.config.services.auth.port + '/company/users', data : {
                secret : Empreendekit.config.services.www.secret,
                token : getToken()
            }}, function (users) {
                if (users && users.users && cb) {
                    cb(users.users);
                } else {
                    cb();
                }
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