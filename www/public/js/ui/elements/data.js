/**
 * Dado de campo do eekit
 *
 * @author Mauro Ribeiro
 * @since  2013-05
 */

var Element    = module.use('element'),
    Css        = module.use('css'),
    Collection = module.use('collection'),
    Value      = module.use('value');

module.exports(GroupSet = new Class(function (params) {
    var element,
        legend, values;

    element = new Element('li', {attributes : {'class' : 'field'}, html : [
        legend = new Element('div', {attributes : {'class' : 'legend'}}),
        values = new Element('ul', {attributes : {'class' : 'values'}})
    ]});

    element.template = this;
    this.id     = element.id;
    this.attach = element.attach;
    this.detach = element.detach;

    /**
     * Controla a legenda
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.legend = function (value) {
        if (value === '') {
            legend.attribute('class').set('legend hide');
        }
        if (value) {

            if (value.constructor !== String) {
                throw new Error({
                    source    : 'data.js',
                    method    : 'legend',
                    message   : 'Legend value must be a string',
                    arguments : arguments
                });
            }

            legend.attribute('class').set('legend');
            legend.html.set(value);
        } else {
            return legend.html.get()[0];
        }
    };

    /**
     * Controla os valores de um dado
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
     this.values = new Collection(values, [Value]);

    /*
     * Valores iniciais
     */
    if (params) {
        this.legend(params.legend);
        this.values.add(params.values);
    }
}));