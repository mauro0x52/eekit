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


    app.post('/mail', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        var Sendgrid = require('sendgrid'),
            sendgrid = new Sendgrid.SendGrid(config.sendgrid.username, config.sendgrid.password),
            token = request.param('token', null),
            subject = request.param('subject', null),
            body = request.param('body', null),
            category = request.param('category', 'undefined'),
            service = request.param('service', null),
            html, userId, userEmail, mail;

            if (!token) {
                response.send({error : { message : 'Validator "required" failed for path token', name : 'ValidatorError', path : 'token', type : 'required'}});
            } else if (!subject) {
                response.send({error : { message : 'Validator "required" failed for path subject', name : 'ValidatorError', path : 'subject', type : 'required'}});
            } else if (!body) {
                response.send({error : { message : 'Validator "required" failed for path body', name : 'ValidatorError', path : 'body', type : 'required'}});
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

                                mail = {
                                    from    : '"'+config.emails.contact.name+'"<'+config.emails.contact.address+'>',
                                    replyTo : '"'+config.emails.contact.name+'"<'+config.emails.contact.address+'>',
                                    to      : userEmail,
                                    subject : subject,
                                    html    : body,
                                    categories : ['eekit', 'eekit '+service+': '+category]
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
