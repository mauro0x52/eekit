/**
 * Icone de um aplicativo no Header
 *
 * @author Mauro Ribeiro
 * @since  2013-05
 */

var Element    = module.use('element'),
    Css        = module.use('css'),
    Collection = module.use('collection');

module.exports(new Class(function (params) {
    var element, image, legend, anchor,
        self = this;

    element = new Element('li', {attributes : {'class' : 'tool'}, html : [
        anchor = new Element('a', {attributes : {'class' : 'anchor', href : '#'}, html : [
            image = new Element('div', {attributes : {'class' : 'image tool'}}),
            legend = new Element('h2', {attributes : {'class' : 'legend'}})
        ]}),
        new Element('div', {attributes : {'class' : 'arrow'}, html : [
            new Element('div', {attributes : {'class' : 'fill'}})
        ]})
    ]});

    anchor.event('click').bind(function () {
        Empreendekit.path.redirect(self.image() + '/');
    });

    element.template = this;
    this.id     = element.id;
    this.attach = element.attach;
    this.detach = element.detach;

    /**
     * Controla a legenda do item
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.legend = function(value) {
        if (value){

            if (value.constructor !== String) {
                throw new Error({
                    source    : 'appIcon.js',
                    method    : 'legend',
                    message   : 'Legend value must be a string',
                    arguments : arguments
                });
            }

            legend.html.set(value);
        } else {
            return legend.html.get();
        }
    }

    /**
     * Controla a imagem do item
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.image = function(value) {
        if (value === '') {
            image.attribute('class').set('image tool');
        } else if (value){

            if (value.constructor !== String) {
                throw new Error({
                    source    : 'appIcon.js',
                    method    : 'image',
                    message   : 'Image value must be a string',
                    arguments : arguments
                });
            }

            image.attribute('class').set('image tool '+value);
        } else {
            return image.attribute('class').get().replace('image tool ', '');
        }
    }

    /*
     * Valores iniciais
     */
    if (params) {
        this.legend(params.legend);
        this.image(params.image);
    }
}));