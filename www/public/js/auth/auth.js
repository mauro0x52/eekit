/*
 * Biblioteca de autenticação do eeKit
 *
 * @author Rafael Erthal
 * @since  2013-05
 */

module.exports({

    login : function () {
        Empreendekit.path.redirect('ee/login', null, function (data) {
            console.log(data);
        });
    },

    service : {

        authorize : function (host, cb) {
            Empreendekit.ajax.get({});
        }

    }

});