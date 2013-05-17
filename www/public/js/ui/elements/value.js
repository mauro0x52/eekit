/**
 * Valor de um dado de campo do eekit
 *
 * @author Mauro Ribeiro
 * @since  2013-05
 */

var Element    = module.use('element'),
    Css        = module.use('css'),
    Collection = module.use('collection');

module.exports(GroupSet = new Class(function (params) {
    var element,
        data;

    element = new Element('li', {attributes : {'class' : 'value'}, html : [
        data = new Element('div', {attributes : {'class' : 'data'}})
    ]});

    element.template = this;
    this.attach = element.attach;
    this.detach = element.detach;

    /**
     * Controla o valor
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.value = function (value) {
        if (value) {

            if (value.constructor !== String && value.constructor !== Number) {
                throw new Error({
                    source    : 'value.js',
                    method    : 'value',
                    message   : 'Value value must be a string or a number',
                    arguments : arguments
                });
            }

            data.html.set(value);
        } else {
            return data.html.get();
        }
    };

    /*
     * Valores iniciais
     */
    if (params) {
        this.value(params.value);
    }
}));