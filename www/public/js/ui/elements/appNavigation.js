/**
 * Item da navegação do app
 *
 * @author Mauro Ribeiro
 * @since  2013-05
 */

var Element    = module.use('element'),
    Css        = module.use('css'),
    Collection = module.use('collection');

module.exports(new Class(function (params) {
    var element, anchor,
        click_cb,
        self = this;

    element = new Element('li', {attributes : {'class' : 'sheet'}, html : [
        anchor = new Element('a', {attributes : {'class' : 'anchor', href : '#'}})
    ]});

    element.template = this;
    this.id     = element.id;
    this.attach = element.attach;
    this.detach = element.detach;

    element.event('click').bind(function () {
        self.click();
    });

    /**
     * Controla o click do item
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.click = function (value) {
        if (value) {

            if (value.constructor !== Function) {
                throw new Error({
                    source    : 'appNavigation.js',
                    method    : 'click',
                    message   : 'Click value must be a function',
                    arguments : arguments
                });
            }

            click_cb = value;
        } else {
            if (click_cb) {
                click_cb.apply(self);
            }
        }
    };

    this.select = function (value) {
        if (value === true || value === false) {
            if (value) {
                element.attribute('class').set('sheet selected');
            } else {
                element.attribute('class').set('sheet');
            }
        } else {
            return element.attribute('class').get().indexOf('selected') > -1;
        }
    }

    /**
     * Controla a legenda do item
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.legend = function (value) {
        if (value){

            if (value.constructor !== String) {
                throw new Error({
                    source    : 'appNavigation.js',
                    method    : 'legend',
                    message   : 'Legend value must be a string',
                    arguments : arguments
                });
            }

            anchor.html.set(value);
        } else {
            return anchor.html.get();
        }
    };

    /*
     * Valores iniciais
     */
    if (params) {
        this.legend(params.legend);
    }
}));