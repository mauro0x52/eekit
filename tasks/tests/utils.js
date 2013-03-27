/** Utils
 *
 * @autor : Mauro Ribeiro
 * @since : 2012-08
 *
 * @description : Biblioteca de utilidades
 */
var config = require('../config.js'),
    restler = require('restler');

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
        restler.json('http://'+config.services[service].url+':'+config.services[service].port + url,
            data
        ).on('success', function(data, response) {
           cb(undefined, data, response);
        }).on('fail', function(data, response) {
            cb(undefined, data, response);
        }).on('error', function(error, response) {
            cb(error, undefined, response);
        });
    },
    post : function(service, url, data, cb) {
        restler.post('http://'+config.services[service].url+':'+config.services[service].port + url,{
            data: JSON.stringify(data),
            headers : { 'Content-Type' : 'application/json' }
        }).on('success', function(data, response) {
           cb(undefined, data, response);
        }).on('fail', function(data, response) {
            cb(undefined, data, response);
        }).on('error', function(error, response) {
            cb(error, undefined, response);
        });
    },
    put : function(service, url, data, cb) {
        restler.put('http://'+config.services[service].url+':'+config.services[service].port+url, {
            data: data,
            headers : { 'Content-Type' : 'application/json' }
        }).on('success', function(data, response) {
           cb(undefined, data, response);
        }).on('fail', function(data, response) {
            cb(undefined, data, response);
        }).on('error', function(error, response) {
            cb(error, undefined, response);
        });
    },
    del : function(service, url, data, cb) {
        restler.del('http://'+config.services[service].url+':'+config.services[service].port+url, {
            data: data,
            headers : { 'Content-Type' : 'application/json' }
        }).on('success', function(data, response) {
           cb(undefined, data, response);
        }).on('fail', function(data, response) {
            cb(undefined, data, response);
        }).on('error', function(error, response) {
            cb(error, undefined, response);
        });
    }
};
exports.api = api;

exports.auth = function (service, cb) {
    api.post('auth', '/company', {
        name  : 'testes+' + rand(),
        admin : {
            name : 'testes+' + rand(),
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'   
        }
    }, function (error, data) {
        api.post('auth', '/service/' + service + '/authorize', {
            secret : 'www'.
            token  : data.token
        }, function (error, data) {
            cb(data.token);
        });
    });
};