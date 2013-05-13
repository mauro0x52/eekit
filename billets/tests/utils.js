/** Utils
 *
 * @autor : Mauro Ribeiro
 * @since : 2012-08
 *
 * @description : Biblioteca de utilidades
 */
var config = require('../config.js');
var needle = require('needle');
var fs = require('fs');
var qs = require('querystring');

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
}

exports.api = api;

var db = {
    openCollection : function (service, collection, cb) {
        var mongodb = require("mongodb"),
            mongoserver = new mongodb.Server(config.services[service].mongodb.url, config.services[service].mongodb.port),
            connector = new mongodb.Db(config.services[service].mongodb.db, mongoserver);

        connector.open(function (error, db) {
            db.collection(collection, function (error, collection) {
                cb(error, collection);
            });
        });
    },
    dropCollection : function (service, collection, cb) {
        db.openCollection(service, collection, function(error, collection) {
            collection.remove({}, cb(error));
        });
    }
}

exports.db = db;

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


var newUser = function(service, cb) {
    var username = 'testes+'+rand()+'@empreendemia.com.br',
        password = 'testando',
        user = {};

    // cria um usuario
    api.post('auth', '/company', {
        name : 'Empresa',
        admin : {
            username : username,
            password : password,
            name : 'Admin'
        },
        secret : 'www'
    }, function(error, data) {
        if (error) {
            cb(error);
        } else if (!data) {
            cb(new Error({message : 'data is empty'}));
        } else if (data.error) {
            cb(new Error(data.error));
        } else {
            user.tokens = { www : data.token };
            api.post(
                'auth', '/service/'+service+'/authorize', {
                    token : user.tokens.www,
                    secret : 'www'
                },
                function(error, data, response) {
                    if (error) {
                        cb(error);
                    } else if (!data) {
                        cb({message : 'data is empty'});
                    } else if (data.error) {
                        cb(data.error);
                    } else {
                        user.tokens[service] = data.token;
                        cb(null, user);
                    }
                }
            );
        }

    });
}

exports.newUser = newUser;
