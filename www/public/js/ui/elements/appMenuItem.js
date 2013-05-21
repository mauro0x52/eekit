/**
 * Item do menu de um app
 *
 * @author Mauro Ribeiro
 * @since  2013-05
 */

var Element    = module.use('element'),
    Css        = module.use('css'),
    Collection = module.use('collection');

module.exports(new Class(function (params) {
    var element, image, legend, anchor, href,
        self = this;

    element = new Element('li', {attributes : {'class' : 'option'}, html : [
        anchor = new Element('a', {attributes : {'class' : 'anchor', href : '#'}, html : [
            image = new Element('div', {attributes : {'class' : 'image menu '}}),
            legend = new Element('h2', {attributes : {'class' : 'legend'}})
        ]}),
        new Element('div', {attributes : {'class' : 'arrow'}, html : [
            new Element('div', {attributes : {'class' : 'fill'}})
        ]})
    ]});

    anchor.event('click').bind(function () {
        Empreendekit.apps.open({
            app   : self.image(),
            route : href
        });
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
                    source    : 'appMenuItem.js',
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
            image.attribute('class').set('image menu');
        } else if (value){

            if (value.constructor !== String) {
                throw new Error({
                    source    : 'appMenuItem.js',
                    method    : 'image',
                    message   : 'Image value must be a string',
                    arguments : arguments
                });
            }

            image.attribute('class').set('image menu '+value);
        } else {
            return image.attribute('class').get().replace('image menu ', '');
        }
    }

    /**
     * Controla a tooltip do item
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.tip = function(value) {
        if (value){

            if (value.constructor !== String) {
                throw new Error({
                    source    : 'appMenuItem.js',
                    method    : 'tip',
                    message   : 'Tip value must be a string',
                    arguments : arguments
                });
            }

            anchor.attribute('title').set(value);
        } else {
            return anchor.attribute('title').get();
        }
    }

    /**
     * Controla a âncora do item
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.href = function(value) {
        if (value){

            if (value.constructor !== String) {
                throw new Error({
                    source    : 'appMenuItem.js',
                    method    : 'href',
                    message   : 'Href value must be a string',
                    arguments : arguments
                });
            }

            href = value;
        } else {
            return href;
        }
    }

    /*
     * Valores iniciais
     */
    if (params) {
        this.legend(params.legend);
        this.image(params.image);
        this.href(href);
        this.tip(params.tip);
    }
}));