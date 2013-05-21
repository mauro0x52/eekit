/**
 * Textarea do eekit
 *
 * @author Mauro Ribeiro
 * @since  2013-05
 */

var Element    = module.use('element'),
    Css        = module.use('css'),
    Collection = module.use('collection'),
    InputError = module.use('inputError');

module.exports(new Class(function (params) {
    var element,
        legend, input,
        rules, errors,
        change_cb,
        self = this;

    element = new Element('li', {attributes : {'class' : 'field textarea'}, html : [
        new Element('div', {attributes : {'class' : 'legend'}, html : [
            legend = new Element('label', {attributes : {'class' : 'text'}})
        ]}),
        new Element('div', {attributes : {'class' : 'data'}, html : [
            input  = new Element('textarea', {attributes : {'class' : 'input', 'type' : 'text', 'autocomplete' : 'off'}}),
            errors = new Element('ul', {attributes : {'class' : 'errors hide'}})
        ]})
    ]});

    element.template = this;
    this.id     = element.id;
    this.attach = element.attach;
    this.detach = element.detach;

    input.event('change').bind(function () {
        self.change();
    });
    input.event('keyup').bind(function () {
        self.change();
    });

    /**
     * Valida
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.validate = function () {
        var valid = true;

        this.errors.remove();
        for (var i in rules) {
            if (!rules[i].rule.test(self.value())) {
                this.errors.add(new InputError({message : rules[i].message}));
                valid = false;
            }
        }
        return valid;
    };

    /**
     * Controla regras de validação
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.rules = function (value) {
        if (value) {

            if (value.constructor !== Array) {
                throw new Error({
                    source    : 'inputTextArea.js',
                    method    : 'rules',
                    message   : 'Rules value must be an array',
                    arguments : arguments
                });
            }

            rules = value;
        } else {
            return rules;
        }
    };

    /**
     * Controla a legenda
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.legend = function (value) {
        if (value) {

            if (value.constructor !== String) {
                throw new Error({
                    source    : 'inputTextArea.js',
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
     * Controla o valor
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.value = function (value) {
        if (value) {

            if (value.constructor !== String && value.constructor !== Number) {
                throw new Error({
                    source    : 'inputTextArea.js',
                    method    : 'value',
                    message   : 'Value value must be a string or number',
                    arguments : arguments
                });
            }

            input.html.set(value);
            self.change();
        } else {
            return input.attribute('value').get();
        }
    };

    /**
     * Controla o callback de change
     *
     * @author Mauro Ribeiro, Rafael Erthal
     * @since  2013-05
     */
    this.change = function (value) {
        if (value) {

            if (value.constructor !== Function) {
                throw new Error({
                    source    : 'inputTextArea.js',
                    method    : 'change',
                    message   : 'Change value must be a function',
                    arguments : arguments
                });
            }

            change_cb = value;
        } else if (change_cb) {
            change_cb.apply(self);
        }
        self.validate();
    };

    /**
     * Dá focus
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.focus = function () {
        setTimeout(function () {input.event('focus').trigger()}, 100);
    }


    /**
     * Controla os erros
     *
     * @author Mauro Ribeiro, Rafael Erthal
     * @since  2013-05
     */
    this.errors = new Collection(errors, [InputError]);

    /*
     * Valores iniciais
     */
    if (params) {
        this.legend(params.legend);
        this.rules(params.rules);
        this.value(params.value);
        this.change(params.change);
        this.rules(params.rules);
    }
}));
