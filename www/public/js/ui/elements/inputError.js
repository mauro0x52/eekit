/**
 * Mensagens de erro da validação
 *
 * @author Mauro Ribeiro
 * @since  2013-05
 */

var Element    = module.use('element'),
    Css        = module.use('css'),
    Collection = module.use('collection');

module.exports(new Class(function (params) {
    var element;

    element = new Element('li', {attributes : {'class' : 'error hide'}});

    element.template = this;
    this.id     = element.id;
    this.attach = element.attach;
    this.detach = element.detach;

    /**
     * Mensagem de erro
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.message = function (value) {
        if (value === '') {
            element.attribute('class').set('error hide');
        } else if (value) {

            if (value.constructor !== String) {
                throw new Error({
                    source    : 'inputError.js',
                    method    : 'message',
                    message   : 'Message value must be a string',
                    arguments : arguments
                });
            }

            element.attribute('class').set('error');
            element.html.set(value);
        } else {
            return element.html.get()[0];
        }
    };

    /*
     * Valores iniciais
     */
    if (params) {
        this.message(params.message);
    }
}));