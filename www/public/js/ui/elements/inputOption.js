/**
 * Opção do seletor
 *
 * @author Mauro Ribeiro
 * @since  2013-05
 */

var Element     = module.use('element'),
    Css         = module.use('css'),
    Collection  = module.use('collection');

module.exports(new Class(function (params) {
    var element,
        checkbox, label, image, legend,
        status, click_cb, option_value,
        self = this;

    element = new Element('li', {attributes : {'class' : 'option'}, html : [
        checkbox = new Element('div', {attributes : {'class' : 'image check-box'}}),
        label = new Element('div', {attributes : {'class' : 'hide'}}),
        image = new Element('div', {attributes : {'class' : 'hide'}}),
        legend = new Element('div', {attributes : {'class' : 'legend'}})

    ]});

    element.template = this;
    this.id     = element.id;
    this.attach = element.attach;
    this.detach = element.detach;

    element.event('click').bind(function () {
        status = !status;
        if (status) {
            element.attribute('class').set('option selected');
        } else {
            element.attribute('class').set('option');
        }
        if (click_cb) {
            click_cb.apply(click_cb);
        }
    });

    /**
     * Controla a legenda do input
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.legend = function (value) {
        if (value) {

            if (value.constructor !== String) {
                throw new Error({
                    source    : 'inputOption.js',
                    method    : 'legend',
                    message   : 'Legend value must be a string',
                    arguments : arguments
                });
            }

            legend.html.set(value);
        } else {
            return legend.html.get();
        }
    };

    /**
     * Controla a cor
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.label = function (value) {
        if (value === '') {
            label.attribute('class').set('hide');
        }
        if (value) {

            if (value.constructor !== String) {
                throw new Error({
                    source    : 'inputOption.js',
                    method    : 'label',
                    message   : 'Label value must be a string',
                    arguments : arguments
                });
            }

            label.attribute('class').set('label ' + value);
        } else {
            return label.attribute('class').get().replace('label ', '');
        }
    };

    /**
     * Controla a imagem
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
                    source    : 'inputOption.js',
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

    /**
     * Controla o estado da opção
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.clicked = function (value) {
        if (value === true || value === false) {
            status = value;
            if (status) {
                if (element.attribute('class').get().indexOf('hide') > 0) {
                    element.attribute('class').set('option selected hide');
                } else {
                    element.attribute('class').set('option selected');
                }
            } else {
                if (element.attribute('class').get().indexOf('hide') > 0) {
                    element.attribute('class').set('option hide');
                } else {
                    element.attribute('class').set('option');
                }
            }
        } else if (value) {

            if (value.constructor !== String) {
                throw new Error({
                    source    : 'inputOption.js',
                    method    : 'clicked',
                    message   : 'Clicked value must be a boolean',
                    arguments : arguments
                });
            }

        } else {
            return status;
        }
    };


    /**
     * Controla o callback de change
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.change = function (value) {
        if (value) {

            if (value.constructor !== Function) {
                throw new Error({
                    source    : 'inputOption.js',
                    method    : 'change',
                    message   : 'Change value must be a function',
                    arguments : arguments
                });
            }

            click_cb = value;
        } else {
            if (click_cb) {
                click_cb.apply(click_cb);
            }
        }
    };

    /**
     * Controla o valor da opção
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.value = function (value) {
        if (value) {
            option_value = value
        } else {
            return option_value;
        }
    };


    /**
     * Controla a visibilidade
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.visibility = function (value) {
        if (value) {

            if (value !== 'hide' && value !== 'show' && value !== 'fade') {
                throw new Error({
                    source    : 'inputSelector.js',
                    method    : 'visibility',
                    message   : 'Visibility value must be "hide", "show" or "fade"',
                    arguments : arguments
                });
            }

            switch (value) {
                case 'hide' :
                    if (status) {
                        element.attribute('class').set('option hide selected');
                    } else {
                        element.attribute('class').set('option hide');
                    }
                    break;
                case 'show' :
                    if (status) {
                        element.attribute('class').set('option selected');
                    } else {
                        element.attribute('class').set('option');
                    }
                    break;
                case 'fade' :
                    if (status) {
                        element.attribute('class').set('option fade selected');
                    } else {
                        element.attribute('class').set('option fade');
                    }
                    break;
            }
        } else {
            return element.attribute('class').get().replace('option', '');
        }
    };
    /*
     * Valores inciais
     */
    if (params) {
        this.legend(params.legend);
        this.label(params.label);
        this.image(params.image);
        this.clicked(params.clicked);
        this.change(params.change);
        this.value(params.value);
    }
}));