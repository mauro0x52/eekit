/** Utils
 *
 * @autor : Mauro Ribeiro
 * @since : 2012-08
 *
 * @description : Biblioteca de utilidades
 */
var config = require('../config.js'),
    needle = require('needle'),
    qs = require('querystring');

var rand = function(type) {
    var crypto = require('crypto');
    var string;
    var hash = crypto.createHash('sha1').update(crypto.randomBytes(10)).digest('hex').substring(0, 5);

    if (type === 'email') {
        string = 'testes+' + hash + '@empreendemia.com.br';
    } else {
        string = hash;
    }
    return string;
}
exports.rand = rand;

var api = {
    get : function(service, url, data, cb) {
        data = data ? data : {};
        needle.get(
            'http://'+config.services[service].url+':'+config.services[service].port + url + '?' + qs.stringify(data),
            function (error, response, data) {
                if (!data) {
                    cb (error, null, response)
                } else {
                    cb (error, data, response)
                }
            }
        );
    },
    post : function(service, url, data, cb) {
        data = data ? data : {};
        needle.post(
            'http://'+config.services[service].url+':'+config.services[service].port + url,
            data,
            function (error, response, data) {
                if (!data) {
                    cb (error, null, response)
                } else {
                    cb (error, data, response)
                }
            }
        );
    }
};
exports.api = api;

exports.auth = function (service, cb) {
    api.post('auth', '/company', {
        name  : 'testes+' + rand(),
        secret : 'www',
        admin : {
            name : 'testes+' + rand(),
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando'
        }
    }, function (error, data) {
        api.post('auth', '/service/' + service + '/authorize', {
            secret : 'www',
            token  : data.token
        }, function (error, data) {
            cb(data.token);
        });
    });
};