/**
 * Controller Mail
 *
 * @author Mauro Ribeiro
 * @since  2013-03
 *
 * Módulo que implementa as funcionalidades de email
 */

module.exports = function (app) {
    var auth = require('../Utils.js').auth,
        restler = require('restler'),
        config = require('../config.js');


    app.post('/mail/self', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        var Sendgrid = require('sendgrid'),
            sendgrid = new Sendgrid.SendGrid(config.sendgrid.username, config.sendgrid.password),
            token = request.param('token', null),
            subject = request.param('subject', null),
            html = request.param('html', null),
            categories = request.param('categories', 'undefined'),
            service = request.param('service', null),
            categoriesArray = [], userId, userEmail, mail;

            if (!token) {
                response.send({error : { message : 'Validator "required" failed for path token', name : 'ValidatorError', path : 'token', type : 'required'}});
            } else if (!subject) {
                response.send({error : { message : 'Validator "required" failed for path subject', name : 'ValidatorError', path : 'subject', type : 'required'}});
            } else if (!html) {
                response.send({error : { message : 'Validator "required" failed for path html', name : 'ValidatorError', path : 'html', type : 'required'}});
            } else if (!service) {
                response.send({error : { message : 'Validator "required" failed for path service', name : 'ValidatorError', path : 'service', type : 'required'}});
            } else {
                restler.post('http://'+config.services.auth.url+':'+config.services.auth.port+'/service/jaiminho/auth', {
                    data: {
                        token  : token,
                        secret : config.security.secret
                    }
                }).on('success', function(data) {
                    if (data.token) {
                        token = data.token;
                        restler.get('http://'+config.services.auth.url+':'+config.services.auth.port+'/validate', {
                            data: {
                                token  : token,
                                secret : config.security.secret
                            }
                        }).on('success', function(data) {
                            if (data.user) {
                                userId = data.user._id;
                                userEmail = data.user.username;
                                categoriesArray.push('eekit');

                                if (!categories) {
                                    categoriesArray.push('eekit '+service+': undefined category');
                                } else if (typeof categories === 'string') {
                                    categoriesArray.push('eekit '+service+': '+categories);
                                } else {
                                    for (var i in categories) {
                                        categoriesArray.push('eekit '+service+': '+categories[i]);
                                    }
                                }

                                mail = {
                                    from    : '"'+config.emails.contact.name+'"<'+config.emails.contact.address+'>',
                                    replyTo : '"'+config.emails.contact.name+'"<'+config.emails.contact.address+'>',
                                    to      : userEmail,
                                    subject : subject,
                                    html    : html,
                                    categories : categoriesArray
                                }

                                sendgrid.send(mail, function(success) {
                                    if (success) {
                                        response.send({mail : mail});
                                    } else {
                                        response.send({error : {message : 'Mail not sent', name : 'ServerError'}});
                                    }
                                });
                            } else {
                                response.send({error : data.error});
                            }
                        }).on('error', function(error) {
                            response.send({error : error});
                        });
                    } else {
                        response.send({error : data.error});
                    }
                }).on('error', function(error) {
                    response.send({error : error});
                });
            }
    });

    app.post('/mail/admin', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        var Sendgrid = require('sendgrid'),
            sendgrid = new Sendgrid.SendGrid(config.sendgrid.username, config.sendgrid.password),
        to = request.param('to', null),
        token = request.param('token', null),
        subject = request.param('subject', null),
        html = request.param('html', null),
        categories = request.param('categories', 'undefined'),
        service = request.param('service', null),
        categoriesArray = [], userId, userEmail, mail;

        if (!token) {
            response.send({error : { message : 'Validator "required" failed for path token', name : 'ValidatorError', path : 'token', type : 'required'}});
        } else if (!subject) {
            response.send({error : { message : 'Validator "required" failed for path subject', name : 'ValidatorError', path : 'subject', type : 'required'}});
        } else if (!html) {
            response.send({error : { message : 'Validator "required" failed for path html', name : 'ValidatorError', path : 'html', type : 'required'}});
        } else if (!service) {
            response.send({error : { message : 'Validator "required" failed for path service', name : 'ValidatorError', path : 'service', type : 'required'}});
        } else if (to && /^.*\@empreendemia\.com\.br$/.test(to) === false) {
            response.send({error : { message : 'Must be a valid email address', name : 'ValidatorError', path : 'to', type : 'format'}});
        } else {
            restler.post('http://'+config.services.auth.url+':'+config.services.auth.port+'/service/jaiminho/auth', {
                data: {
                    token  : token,
                    secret : config.security.secret
                }
            }).on('success', function(data) {
                if (data.token) {
                    token = data.token;

                    restler.get('http://'+config.services.auth.url+':'+config.services.auth.port+'/validate', {
                        data: {
                            token  : token,
                            secret : config.security.secret
                        }
                    }).on('success', function(data) {
                        if (data.user) {
                            userId = data.user._id;
                            userEmail = data.user.username;
                            categoriesArray.push('eekit');

                            if (!categories) {
                                categoriesArray.push('eekit admin '+service+': undefined category');
                            } else if (typeof categories === 'string') {
                                categoriesArray.push('eekit admin '+service+': '+categories);
                            } else {
                                for (var i in categories) {
                                    categoriesArray.push('eekit admin '+service+': '+categories[i]);
                                }
                            }

                            html = '<p>Id: '+userId+'</p><p>Email: '+userEmail+'</p><br /><br />' + html;

                            if (!to) {
                                to = config.emails.contact.address;
                            }

                            mail = {
                                from    : '"'+config.emails.noreply.name+'"<'+config.emails.noreply.address+'>',
                                replyTo : '"'+config.emails.noreply.name+'"<'+config.emails.noreply.address+'>',
                                to      : to,
                                subject : subject,
                                html    : html,
                                categories : categoriesArray
                            }
                            
                            sendgrid.send(mail, function(success) {
                                if (success) {
                                    response.send({mail : mail});
                                } else {
                                    response.send({error : {message : 'Mail not sent', name : 'ServerError'}});
                                }
                            });
                        } else {
                            response.send({error : data.error});
                        }
                    }).on('error', function(error) {
                        response.send({error : error});
                    });
                } else {
                    response.send({error : data.error});
                }
            }).on('error', function(error) {
                response.send({error : error});
            });
        }
    });

}
