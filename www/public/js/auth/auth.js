/*
 * Biblioteca de autenticação do eeKit
 *
 * @author Rafael Erthal
 * @since  2013-05
 */

function setToken (token, remindme) {
    var expire = new Date();
    if (remindme) {
        expire.setDate(expire.getDate() + 30);
    } else {
        expire.setDate(expire.getDate() + 1);
    }

    var value = escape(token) + ((expire==null) ? "" : "; expires="+expire.toUTCString());
    document.cookie = "token=" + value;
}

function getToken () {
    var cookies = document.cookie;
    var token_start = cookies.indexOf(" token=");
    if (token_start == -1){
        token_start = cookies.indexOf("token=");
    }
    if (token_start > -1) {
        token_start = cookies.indexOf("=", token_start) + 1;

        var token_end = cookies.indexOf(";", token_start);
        if (token_end == -1) {
            token_end = cookies.length;
        }
        return unescape(cookies.substring(token_start,token_end));
    }
}

module.exports({

    user : {

        signin : function () {
            Empreendekit.path.redirect('ee/login', null, function (data) {
                setToken(data.token, data.remindme);
                Empreendekit.config.services.www.token = data.token;
                Empreendekit.path.redirect('tarefas/');
            });
        },

        signup : function () {

        },

        signout : function () {

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