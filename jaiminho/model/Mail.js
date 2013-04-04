/** Mail
 * @author : Rafael Erthal
 * @since : 2013-04
 *
 * @description : Representação de email
 */

var Mail = function (params) {
    this.from = params.from;
    this.to = params.to;
    this.subject = params.subject;
    this.html = params.html;

    this.send = function (params, cb) {
        var Sendgrid = require('sendgrid'),
            sendgrid = new Sendgrid.SendGrid(config.sendgrid.username, config.sendgrid.password),
            config = require('../config.js'),
            token = params.token,
            name = params.name,
            service = params.service;

        if (!token) {
            cb({ message : 'Validator "required" failed for path token', name : 'ValidatorError', path : 'token', type : 'required'}, null);
        } else if (!this.subject) {
            cb({ message : 'Validator "required" failed for path subject', name : 'ValidatorError', path : 'subject', type : 'required'}, null);
        } else if (!this.html) {
            cb({ message : 'Validator "required" failed for path html', name : 'ValidatorError', path : 'html', type : 'required'}, null);
        } else if (!service) {
            cb({ message : 'Validator "required" failed for path service', name : 'ValidatorError', path : 'service', type : 'required'}, null);
        } else if (this.from && /^.*\@empreendemia\.com\.br$/.test(this.from) === false) {
            cb({ message : 'Must be a valid email address', name : 'ValidatorError', path : 'from', type : 'format'}, null);
        } else {
            restler.post('http://'+config.services.auth.url+':'+config.services.auth.port+'/service/jaiminho/authorize', {
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
                            var userEmail = data.user.username,
                                categoriesArray = [];

                            if (config.environment === 'development' || config.environment === 'testing') {
                                categoriesArray.push('eekit test');
                                categoriesArray.push('eekit test '+service+': '+name);
                            } else {
                                categoriesArray.push('eekit');
                                categoriesArray.push('eekit '+service+': '+name);
                            }

                            var mail = {
                                from    : from ? from : '"'+config.emails.contact.name+'"<'+config.emails.contact.address+'>',
                                replyTo : from ? from : '"'+config.emails.contact.name+'"<'+config.emails.contact.address+'>',
                                to      : userEmail,
                                subject : subject,
                                html    : html,
                                categories : categoriesArray
                            }

                            sendgrid.send(mail, function(success) {
                                if (success) {
                                    mail.name = name;
                                    cb(null, mail);
                                } else {
                                    cb({message : 'Mail not sent', name : 'ServerError'}, null);
                                }
                            });
                        } else {
                            response.send({error : data.error});
                        }
                    }).on('error', function(error) {
                        response.send({error : error});
                    });
                } else {
                    cb(data.error, null);
                }
            }).on('error', function(error) {
                cb(error, null);
            });
        }
    }
};

/*  Exportando o pacote  */
exports.Mail = Mail;