/**
 * Fieldsets do eekit
 *
 * @author Mauro Ribeiro
 * @since  2013-05
 */

var Element       = module.use('element'),
    Css           = module.use('css'),
    Collection    = module.use('collection'),
    InputText     = module.use('inputText'),
    InputTextArea = module.use('inputTextArea');

module.exports(new Class(function (params) {
    var element,
        legend, fields;

    element = new Element('fieldset', {attributes : {'class' : 'field-set'}, html : [
        legend = new Element('legend', {attributes : {'class' : 'legend'}}),
        fields = new Element('ul', {attributes : {'class' : 'fields'}})
    ]});

    element.template = this;
    this.id     = element.id;
    this.attach = element.attach;
    this.detach = element.detach;

    /**
     * Valida campos
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.validate = function () {
        var inputs = this.fields.get(),
            valid = true;

        for (var i in inputs) {
            if (inputs[i].validate && !inputs[i].validate()) {
                valid = false;
            }
        }
        return valid;
    }

    /**
     * Controla a visibilidade
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.visibility = function (value) {
        if (value) {

            if (value.constructor !== String) {
                throw new Error({
                    source    : 'fieldset.js',
                    method    : 'visibility',
                    message   : 'Visibility value must be a string',
                    arguments : arguments
                });
            }

            switch (value) {
                case 'hide' :
                    element.attribute('class').set('field-set hide');
                    break;
                case 'show' :
                    element.attribute('class').set('field-set');
                    break;
                case 'fade' :
                    element.attribute('class').set('field-set fade');
                    break;
            }
        } else {
            return element.attribute('class').get().replace('field-set', '');
        }
    };

    /**
     * Colapsa ou descolapsa
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.collapsed = function (value) {
        var css = '';
        if (value === true || value === false) {
            css = element.attribute('class').get();
            if (value) {
                css += ' collapsed';
            } else {
                css = css.replace('collapsed', ' ');
            }
            element.attribute('class').set(css);
        } else if (value) {

            if (value.constructor !== String) {
                throw new Error({
                    source    : 'fieldset.js',
                    method    : 'collapsed',
                    message   : 'Collapsed value must be a boolean',
                    arguments : arguments
                });
            }

        } else {
            return css.indexOf('collapsed') > -1;
        }
    }

    /**
     * Controla a legenda
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.legend = function (value) {
        if (value === '') {
            legend.attribute('class').set('hide');
        }
        if (value) {
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
     *
     */
    //inputText, inputTextarea, inputPassword, inputDate, inputSelector
    this.fields = new Collection(fields, [InputText, InputTextArea]);

    /*
     * Valores iniciais
     */
    if (params) {
        this.legend(params.legend);
        this.fields.add(params.fields);
        this.collapsed(params.collapsed);
        this.visibility(params.visibility);
    }
}));