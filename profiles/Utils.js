/** Utils
 *
 * @autor : Rafael Erthal
 * @since : 2013-03
 *
 * @description : Biblioteca de utilidades
 */
var config = require('./config.js');

/** Auth
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : valida o token de um usuário no serviço Auth
 * @param login : username do usuário
 * @param token : token do usuário
 * @param cb : callback a ser chamado após validado o token
 */
exports.auth = function (token, cb) {
    "use strict";

    require('restler').get('http://'+config.services.auth.url+':'+config.services.auth.port+'/validate', {
        data: {
            token  : token,
            secret : config.security.secret
        }
    }).on('success', function(data) {
        if (data.user) {
            cb(null, data.user);
        } else if (data.error) {
            cb(data.error, null);
        } else {
            cb(null, null);
        }
    }).on('error', function(error) {
        cb(error, null);
    });
};

/** Bind
 * @author : Rafael Erthal
 * @since : 2013-03
 *
 * @description : binda evento no kami-sama
 * @param name : nome do evento
 * @param method : método para chamar a url
 * @param callback : url a ser chamada no disparo do evento
 */
exports.bind = function (token, name, method, callback) {
    "use strict";

    require('restler').post('http://' + config.services.kamisama.url + ':' + config.services.kamisama.port + '/bind', {
        data: {
            token : token,
            secret : config.security.secret,
            label : name,
            method : method,
            callback : callback
        }
    }).on('success', function() {}).on('error', function() {});
};

/** Trigger
 * @author : Rafael Erthal
 * @since : 2013-03
 *
 * @description : dispara evento no kami-sama
 * @param name : nome do evento
 * @param method : método para chamar a url
 * @param callback : url a ser chamada no disparo do evento
 */
exports.trigger = function (token, name, data) {
    "use strict";

    require('restler').post('http://' + config.services.kamisama.url + ':' + config.services.kamisama.port + '/tigger', {
        data: {
            token : token,
            secret : config.security.secret,
            label : name,
            data : data
        }
    }).on('success', function() {}).on('error', function() {});
};


//            token : token,
//            subject : 'Aew admin!',
//            html : 'Email para o admin',
//            categories : 'teste',
//            service : 'serviço de teste',
//            to : 'testes+aew@empreendemia.com.br'

/**
 * Envia email para admin
 *
 * @author Mauro Ribeiro
 * @since  2013-03
 *
 * @param token             token do usuário
 * @param data              dados do email
 * @param data.subject      titulo do email
 * @param data.html         corpo do email
 * @param data.categories   categorias associadas ao sendgrid
 * @param data.to           email de alguem especifico
 */
exports.mailAdmin = function(token, data) {
    "use strict";

    data.token = token;
    data.service = 'profiles';
    
    require('restler').post('http://' + config.services.jaiminho.url + ':' + config.services.jaiminho.port + '/mail/admin', {
        data: data
    }).on('success', function(data) {console.log(data)}).on('error', function(data) {console.log(data)});;
};