/**
 * Orientador do eekit
 *
 * @author Mauro Ribeiro
 * @since  2013-05
 */

var Element    = module.use('element'),
    Css        = module.use('css'),
    Collection = module.use('collection');

module.exports(new Class(function (parent) {
    var element,
        close, description, example,
        self = this;

    element = new Element('div', {attributes : {'class' : 'helper hide'}, html : [
        /* close */
        close = new Element('div', {attributes : {'class' : 'close'}, html : [
            new Element('div', {attributes : {'class' : 'image'}, html : []}),
            new Element('div', {attributes : {'class' : 'legend'}, html : []})
        ]}),
        /* description */
        description = new Element('div', {attributes : {'class' : 'description'}, html : []}),
        /* example */
        example = new Element('div', {attributes : {'class' : 'example'}, html : []}),
        /* arrow */
        new Element('div', {attributes : {'class' : 'arrow'}, html : [
            new Element('div', {attributes : {'class' : 'fill'}, html : []})
        ]})
    ]});

    /* Eventos */
    close.event('click').bind(function (evt) {
        evt.stopPropagation();
        self.hide();
    })

    if (parent) {
        parent.html.attach(element);
        parent.event('click').bind(function () {
            self.hide();
        });
    }

    element.template = this;
    this.id     = element.id;
    this.attach = element.attach;
    this.detach = element.detach;

    /**
     * Controla a descrição
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.description = function (value) {
        if (value === '') {
            description.attribute('class').set('hide');
        }
        if (value) {

            if (value.constructor !== String) {
                throw new Error({
                    source    : 'helper.js',
                    method    : 'description',
                    message   : 'Description value must be a string',
                    arguments : arguments
                });
            }

            self.show();
            description.attribute('class').set('description');
            description.html.set(value);
        } else {
            return description.html.get()[0];
        }
    };

    /**
     * Controla o exemplo
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.example = function (value) {
        if (value === '') {
            example.attribute('class').set('hide');
        }
        if (value) {
            self.show();
            example.attribute('class').set('example');
            example.html.set(value);
        } else {
            return example.html.get()[0];
        }
    };

    /**
     * Exibe o helper
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.show = function (value) {
        element.attribute('class').set('helper');
    };

    /**
     * Esconde o helper
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.hide = function (value) {
        element.attribute('class').set('helper hide');
    };
}));