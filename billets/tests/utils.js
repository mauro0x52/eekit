/** Utils
 *
 * @autor : Mauro Ribeiro
 * @since : 2012-08
 *
 * @description : Biblioteca de utilidades
 */
var config = require('../config.js');
var restler = require('restler');
var fs = require('fs');

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
    },
    file : function(service, url, data, files, cb) {

        var fs = require('fs'),
            mime = require('mime');

        for (var i in files){
            var stat = fs.statSync(__dirname + '/static/' + files[i]);
            data[i] = restler.file(__dirname + '/static/'+files[i], files[i], stat.size, null, mime.lookup('../static/'+files[i]));
        }

        restler.post('http://'+config.services[service].url+':'+config.services[service].port+url, {
            multipart: true,
            data: data
        }).on('success', function(data, response) {
           cb(undefined, data, response);
        }).on('fail', function(data, response) {
            cb(undefined, data, response);
        }).on('error', function(error, response) {
            cb(error, undefined, response);
        });
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
    api.post('auth', '/user', {
        username : username,
        password : password,
        password_confirmation : password,
        status : 'active',
        secret : 'www'
    }, function(error, data) {
        if (error) {
            cb(error);
        } else if (!data) {
            cb({message : 'data is empty'});
        } else if (data.error) {
            cb(data.error);
        } else {
            user.tokens = { www : data.token };
            api.post(
                'auth', '/service/'+service+'/auth', {
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
