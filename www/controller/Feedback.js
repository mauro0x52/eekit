/** Feedback
 * @author : Mauro Ribeiro
 * @since : 2012-10
 *
 * @description : Módulo que envia feedback
 */

module.exports = function (app) {
    "use strict";

    var config  = require('../config.js');

    /** POST /feedback
     *
     * @autor : Mauro Ribeiro
     * @since : 2012-10
     *
     * @description : Envia feedback
     *
     * @allowedApp : Apenas o www
     * @allowedUser : Público
     *
     * @request : {_id, email, message, events, html}
     */
    app.post('/feedback', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        var Sendgrid = require('sendgrid'),
            sendgrid = new Sendgrid.SendGrid(config.sendgrid.username, config.sendgrid.password),
            html = '', events;

        events = request.param('events', null);

        html += '<h1>Novo feedback</h1>';
        html += '<p>'+request.param('message', null)+'</p>';
        html += '<h2>Usuário</h2>';
        html += '<p>user: '+request.param('user', null)+'</p>';
        html += '<p>email: '+request.param('email', null)+'</p>';
        html += '<h2>Últimos eventos</h2>';
        html += '<ul>';
        for (var i in events) {
            html += '<li>';
            html += JSON.stringify(events[i]);
            html += '</li>';
        }
        html += '</ul>';
        html += '<h2>HTML</h2>';
        html += request.param('html', null);
        sendgrid.send({
            from: 'atendimento@empreendekit.com.br',
            replyTo : request.param('email', null),
            to      : config.emails.contact.address,
            subject : 'Novo feedback!',
            html    : html,
            categories : ['feedback']
        }, function(success) {
            if (success) {
                response.send(null);
            } else {
                response.send({error : {message : 'Feedback not sent', name : 'ServerError'}});
            }
        });

    });
};