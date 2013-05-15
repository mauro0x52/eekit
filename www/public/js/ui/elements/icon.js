/**
 * Ícones do eekit
 *
 * @author Mauro Ribeiro
 * @since  2013-05
 */

var Element    = module.use('element'),
    Css        = module.use('css'),
    Collection = module.use('collection');

module.exports(new Class(function (params) {
    var element, image, legend;

    element = new Element('li', {attributes : {'class' : 'icon'}, html : [
        image = new Element('div', {attributes : {'class' : 'hide'}}),
        legend = new Element('div', {attributes : {'class' : 'hide'}})
    ]});

    this.attach = element.attach;
    this.detach = element.detach;

    /**
     * Controla o nome da legenda do ícone
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.legend = function (value) {
        if (value === '') {
            legend.attribute('class').set('hide');
        }
        if (value) {

            if (value.constructor !== String) {
                throw new Error({
                    source    : 'icon.js',
                    method    : 'legend',
                    message   : 'Legend value must be a string',
                    arguments : arguments
                });
            }

            legend.attribute('class').set('legend');
            legend.html.set(value);
        } else {
            return legend.attribute('class').get();
        }
    };

    /**
     * Controla a imagem de um ícone
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.image = function (value) {
        if (value === '') {
            image.attribute('class').set('hide');
        }
        if (value) {

            if (value.constructor !== String) {
                throw new Error({
                    source    : 'icon.js',
                    method    : 'image',
                    message   : 'Image value must be a string',
                    arguments : arguments
                });
            }

            image.attribute('class').set('image icon ' + value);
        } else {
            return image.attribute('class').get().replace('image icon ', '');
        }
    };

    /*
     * Valores iniciais
     */
    if (params) {
        this.legend(params.legend);
        this.image(params.image);
    }
}));