/**
 * Botões ações do eekit
 *
 * @author Rafael Erthal
 * @since  2013-06
 */

var Element    = module.use('element'),
    Css        = module.use('css');

module.exports(new Class(function (params) {
    var self = this,
        sender,
        date,
        content;

    element = new Element('div', {attributes : {'class' : 'message'}, html : [
        sender  = new Element('div', {attributes : {'class' : 'sender'}}),
        date    = new Element('div', {attributes : {'class' : 'date'}}),
        content = new Element('div', {attributes : {'class' : 'content'}})
    ]});

    element.template = this;
    this.id     = element.id;
    this.attach = element.attach;
    this.detach = element.detach;

    /**
     * Controla o conteudo mensagem
     *
     * @author Rafael Erthal
     * @since  2013-06
     */
    this.content = function (value) {
        if (value) {

            if (value.constructor !== String) {
                throw new Error({
                    source    : 'chatMessage.js',
                    method    : 'content',
                    message   : 'Content value must be a string',
                    arguments : arguments
                });
            }

            content.html.set(value);
        } else {
            return content.html.get()[0];
        }
    };

    /**
     * Controla o nome de quem enviou a mensagem
     *
     * @author Rafael Erthal
     * @since  2013-06
     */
    this.sender = function (value) {
        if (value) {

            if (value.constructor !== String) {
                throw new Error({
                    source    : 'chatMessage.js',
                    method    : 'sender',
                    message   : 'Sender value must be a string',
                    arguments : arguments
                });
            }

            sender.html.set(value);
        } else {
            return sender.html.get()[0];
        }
    };

    /**
     * Controla a data da mensagem
     *
     * @author Rafael Erthal
     * @since  2013-06
     */
    this.date = function (value) {
        if (value) {

            if (value.constructor !== Date) {
                throw new Error({
                    source    : 'chatMessage.js',
                    method    : 'date',
                    message   : 'Date value must be a date',
                    arguments : arguments
                });
            }

            date.html.set(value);
        } else {
            return new Date(date.html.get()[0]);
        }
    };

    /*
     * Valores iniciais
     */
    if (params) {
        this.content(params.content);
        this.sender(params.sender);
        this.date(params.date);
    }
}));
