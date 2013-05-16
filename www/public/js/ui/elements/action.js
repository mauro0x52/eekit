/**
 * Botões ações do eekit
 *
 * @author Mauro Ribeiro
 * @since  2013-05
 */

var Element    = module.use('element'),
    Css        = module.use('css'),
    Collection = module.use('collection');

module.exports(new Class(function (params) {
    var element,
        anchor, image, legend,
        click_cb,
        that = this;

    element = new Element('li', {attributes : {'class' : 'action'}, html : [
        anchor = new Element('a', {attributes : {'class' : 'anchor', 'target' : '_blank', 'href' : '#', 'draggable' : 'false'}, html : [
            image = new Element('div', {attributes : {'class' : 'hide'}}),
            legend = new Element('div', {attributes : {'class' : 'hide'}})
        ]})
    ]});

    this.attach = element.attach;
    this.detach = element.detach;

    /* Eventos */
    anchor.event('click').bind(function (event) {
        if (that.href() === '#') {
            event.stopPropagation();
            event.preventDefault();
        }
        that.click();
    });

    /**
     * Controla o orientador da ação
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    //this.helper = new Helper(element);

    /**
     * Controla a legenda da ação
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
                    source    : 'action.js',
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
     * Controla a tooltip da ação
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.tip = function (value) {
        if (value === null || value === '') {
            anchor.attribute('title').set('');
        } else if (value) {

            if (value.constructor !== String) {
                throw new Error({
                    source    : 'action.js',
                    method    : 'tip',
                    message   : 'Tip value must be a string',
                    arguments : arguments
                });
            }

            anchor.attribute('title').set(value);
        } else {
            return anchor.attribute('title').get();
        }
    };

    /**
     * Controla a imagem da ação
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
                    source    : 'action.js',
                    method    : 'image',
                    message   : 'Image value must be a string',
                    arguments : arguments
                });
            }

            image.attribute('class').set('image action ' + value);
        } else {
            return image.attribute('class').get().replace('image action ', '');
        }
    };

    /**
     * Controla o click da ação
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.click = function (value) {
        if (value) {

            if (value.constructor !== Function) {
                throw new Error({
                    source    : 'action.js',
                    method    : 'click',
                    message   : 'Click value must be a function',
                    arguments : arguments
                });
            }

            click_cb = value;
        } else if (click_cb) {
            click_cb.apply(that);
        }
    };

    /**
     * Controla o href da ação
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.href = function (value) {
        if (value) {

            if (value.constructor !== String) {
                throw new Error({
                    source    : 'action.js',
                    method    : 'href',
                    message   : 'Href value must be a string',
                    arguments : arguments
                });
            }

            anchor.attribute('href').set(value);
        } else {
            return anchor.attribute('href').get();
        }
    }

    /*
     * Valores iniciais
     */
    if (params) {
        this.legend(params.legend);
        this.tip(params.tip);
        this.image(params.image);
        this.href(params.href);
        this.click(params.click);
        if (params.helper) {
            this.helper.description(params.helper.description);
            this.helper.example(params.helper.example);
        }
    }
}));
