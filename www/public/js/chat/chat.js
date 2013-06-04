/*
 * Biblioteca de controle de chats do eeKit
 *
 * @author Rafael Erthal
 * @since  2013-06
 */

var config = module.use('config'),
    ui     = module.use('ui');

module.exports(new Class (function (params) {

    var conversant = params.conversant;

    var ui = new Empreendekit.ui.chat({
        title  : conversant ? 'Conversa com ' + conversant.name : 'Chat online. Estamos disponíveis!'
        submit : function () {
            Empreendekit.socket.emit('chat', {
                jid     : conversant.jid,
                message : ui.message()
            });
            ui.message('');
        }
    });

    Empreendekit.socket.on('chat', function (message) {
        if (
            message.jid === conversant.jid ||
            !conversant
        ) {
            ui.messages.add(new ui.chatMessage({
                sender  : conversant ? conversant.name || 'Gabriel',
                content : message.content,
                date    : new Date(message.date)
            }));
        }
    });

}));