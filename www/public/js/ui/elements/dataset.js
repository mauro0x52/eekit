/**
 * Conjunto de datasets do eekit
 *
 * @author Mauro Ribeiro
 * @since  2013-05
 */

var Element    = module.use('element'),
    Css        = module.use('css'),
    Collection = module.use('collection'),
    Data       = module.use('data');

module.exports(GroupSet = new Class(function (params) {
    var element,
        legend, fields;

    element = new Element('div', {attributes : {'class' : 'data-set'}, html : [
        legend = new Element('h6', {attributes : {'class' : 'legend hide'}}),
        fields = new Element('ul', {attributes : {'class' : 'fields'}})
    ]});

    this.attach = element.attach;
    this.detach = element.detach;

    /**
     * Controla o título
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
                    source    : 'dataset.js',
                    method    : 'legend',
                    message   : 'Legend value must be a string',
                    arguments : arguments
                });
            }

            legend.attribute('class').set('legend');
            legend.html.set(value);
        } else {
            return legend.html.get();
        }
    };

    /**
     * Controla os campos
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.fields = new Collection(fields, [Data]);

    /*
     * Valores iniciais
     */
    if (params) {
        this.legend(params.legend);
        this.fields.add(params.fields);
    }
}));