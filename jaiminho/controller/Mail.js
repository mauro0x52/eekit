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
        config = require('../config.js'),
        Model = require('./../model/Model.js'),
        Schedule = Model.Schedule;

    /** POST /mail/schedule
     *
     * @autor : Rafael Erthal
     * @since : 2012-10
     *
     * @description : Agenda o envio de um email
     *
     * @request : {token, request:{service,name}, mail:{from, to, subject, html}, dateCreated, date}
     * @response : {account}
     */
    app.post('/mail/schedule', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        var token = request.param('token', null),
            mail = request.param('mail', {}),
            requester = request.param('request', {}),
            from = mail.from,
            to = mail.to,
            subject = mail.subject,
            html = mail.html,
            service = requester.service,
            schedule;

        if (!token) {
            response.send({error : { message : 'Validator "required" failed for path token', name : 'ValidatorError', path : 'token', type : 'required'}});
        } else if (!subject) {
            response.send({error : { message : 'Validator "required" failed for path subject', name : 'ValidatorError', path : 'subject', type : 'required'}});
        } else if (!html) {
            response.send({error : { message : 'Validator "required" failed for path html', name : 'ValidatorError', path : 'html', type : 'required'}});
        } else if (!service) {
            response.send({error : { message : 'Validator "required" failed for path service', name : 'ValidatorError', path : 'service', type : 'required'}});
        } else if (from && /^.*\@empreendemia\.com\.br$/.test(from) === false) {
            response.send({error : { message : 'Must be a valid email address', name : 'ValidatorError', path : 'from', type : 'format'}});
        } else if (to && /^.*\@empreendemia\.com\.br$/.test(to) === false) {
            response.send({error : { message : 'Must be a valid email address', name : 'ValidatorError', path : 'to', type : 'format'}});
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
                            schedule = new Schedule({
                                user        : data.user._id,
                                request     : {
                                    service : service,
                                    name    : requester.name
                                },
                                mail        : {
                                    from    : from,
                                    to      : to,
                                    subject : subject,
                                    html    : html
                                },
                                dateCreated : new Date(),
                                date        : request.param('date', null)
                            });

                            schedule.save(function (error) {
                                if (error) {
                                    response.send({error : error});
                                } else {
                                    response.send({schedule : schedule});
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

    app.post('/mail/self', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        var Sendgrid = require('sendgrid'),
            sendgrid = new Sendgrid.SendGrid(config.sendgrid.username, config.sendgrid.password),
            token = request.param('token', null),
            from = request.param('from', null),
            subject = request.param('subject', null),
            html = request.param('html', null),
            name = request.param('name', 'undefined'),
            service = request.param('service', null),
            categoriesArray = [], userId, userEmail, mail, sgEmail;

            if (!token) {
                response.send({error : { message : 'Validator "required" failed for path token', name : 'ValidatorError', path : 'token', type : 'required'}});
            } else if (!subject) {
                response.send({error : { message : 'Validator "required" failed for path subject', name : 'ValidatorError', path : 'subject', type : 'required'}});
            } else if (!html) {
                response.send({error : { message : 'Validator "required" failed for path html', name : 'ValidatorError', path : 'html', type : 'required'}});
            } else if (!service) {
                response.send({error : { message : 'Validator "required" failed for path service', name : 'ValidatorError', path : 'service', type : 'required'}});
            } else if (from && /^.*\@empreendemia\.com\.br$/.test(from) === false) {
            response.send({error : { message : 'Must be a valid email address', name : 'ValidatorError', path : 'from', type : 'format'}});
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
                                userId = data.user._id;
                                userEmail = data.user.username;

                                if (config.environment === 'development' || config.environment === 'testing') {
                                    categoriesArray.push('eekit test');
                                    categoriesArray.push('eekit test '+service+': '+name);
                                } else {
                                    categoriesArray.push('eekit');
                                    categoriesArray.push('eekit '+service+': '+name);
                                }

                                mail = {
                                    from    : from ? from : '"'+config.emails.contact.name+'"<'+config.emails.contact.address+'>',
                                    replyTo : from ? from : '"'+config.emails.contact.name+'"<'+config.emails.contact.address+'>',
                                    to      : userEmail,
                                    subject : subject,
                                    html    : html
                                }

                                sgEmail = new Sendgrid.Email(mail);
                                sgEmail.setCategory(categoriesArray);

                                sendgrid.send(sgEmail, function(success) {
                                    if (success) {
                                        mail.name = name;
                                        mail.categories = categoriesArray;
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
        name = request.param('name', 'undefined'),
        service = request.param('service', null),
        categoriesArray = [], userId, userEmail, mail, sgEmail;

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
                            userId = data.user._id;
                            userEmail = data.user.username;

                            if (config.environment === 'development' || config.environment === 'testing') {
                                categoriesArray.push('eekit test');
                                categoriesArray.push('eekit test admin '+service+': '+name);
                            } else {
                                categoriesArray.push('eekit');
                                categoriesArray.push('eekit admin '+service+': '+name);
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
                                html    : html
                            }

                            sgEmail = new Sendgrid.Email(mail);
                            sgEmail.setCategory(categoriesArray);

                            sendgrid.send(sgEmail, function(success) {
                                if (success) {
                                    mail.name = name;
                                    mail.categories = categoriesArray;
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
