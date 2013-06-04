/**
 * Botões ações do eekit
 *
 * @author Rafael Erthal
 * @since  2013-06
 */

var Element    = module.use('element'),
    Css        = module.use('css'),
    Message    = module.use('chatMessage');

module.exports(new Class(function (params) {
    var self = this,
        element,
        title,
        close,
        messages,
        message,
        input,
        submit_cb;

    element = new Element('div', {attributes : {'class' : 'chat collapsed'}, html : [
        new Element('div' ,{attributes : {'class' : 'header'}, html : [
            new Element('div', {attributes : {'class' : 'logo'}}),
            title = new Element('div', {attributes : {'class' : 'title'}}),
            close = new Element('div', {attributes : {'class' : 'close'}})
        ]}),
        messages = new Element('div', {attributes : {'class' : 'messages'}}),
        form     = new Element('form', {attributes : {'class' : 'form'}, html : [
            message = new Element('input', {attributes : {'type' : 'text', 'class' : 'input'}}),
            input   = new Element('input', {attributes : {'type' : 'submit', 'class' : 'submit'}})
        ]})
    ]});

    element.template = this;
    this.id     = element.id;
    this.attach = element.attach;
    this.detach = element.detach;

    /* Eventos */
    close.event('click').bind(function (evt) {
        evt.preventDefault();
        self.collapsed();
    });

    form.event('submit').bind(function (evt) {
        evt.preventDefault();
        self.submit();
    });

    /**
     * Controla o title do chat
     *
     * @author Rafael Erthal
     * @since  2013-06
     */
    this.title = function (value) {
        if (value) {

            if (value.constructor !== String) {
                throw new Error({
                    source    : 'chat.js',
                    method    : 'title',
                    message   : 'Title value must be a string',
                    arguments : arguments
                });
            }

            title.html.set(value);
        } else {
            return title.html.get()[0];
        }
    };

    /**
     * Controla o envio do form
     *
     * @author Rafael Erthal
     * @since  2013-06
     */
    this.submit = function (value) {
        if (value) {

            if (value.constructor !== Function) {
                throw new Error({
                    source    : 'chat.js',
                    method    : 'submit',
                    message   : 'Submit value must be a function',
                    arguments : arguments
                });
            }

            submit_cb = value;
        } else if (submit_cb) {
            submit_cb.apply(self);
        }
    };

    /**
     * Colapsa ou descolapsa
     *
     * @author Rafael Erthal
     * @since  2013-06
     */
    this.collapsed = function (value) {
        if (value === true || value === false) {
            if (value) {
                element.attribute('class').set('chat collapsed');
            } else {
                element.attribute('class').set('chat');
            }
        } else {
            return element.attribute('class').get().indexOf('collapsed') > -1;
        }
    };

    /**
     * Controla o conteudo da mensagem digitada
     *
     * @author Rafael Erthal
     * @since  2013-06
     */
    this.message = function (value) {
        if (value) {
            input.attribute('value').set(value);
        } else {
            return input.attribute('value').get();
        }
    };

    /**
     * Controla as mensagens
     *
     * @author Rafael Erthal
     * @since  2013-06
     */
    this.messages = new Collection(messages, [Message]);

    /*
     * Valores iniciais
     */
    if (params) {
        this.title(params.title);
        this.submit(params.submit);
        if (params.messages) {
            this.messages.add(params.messages);
        }
    }
}));
