/**
 * Inputs password do eekit
 *
 * @author Mauro Ribeiro
 * @since  2013-05
 */

var Element    = module.use('element'),
    Css        = module.use('css'),
    Collection = module.use('collection'),
    Helper     = module.use('helper'),
    InputError = module.use('inputError');

module.exports(new Class(function (params) {

    var element,
        input,
        errors,
        legend,
        rules,
        self = this,
        change_cb;

    element = new Element('li', {attributes : {'class' : 'field password'}, html : [
        new Element('div', {attributes : {'class' : 'legend'}, html : [
            legend = new Element('label', {attributes : {'class' : 'text'}})
        ]}),
        new Element('div', {attributes : {'class' : 'data'}, html : [
            input  = new Element('input', {attributes : {'class' : 'input', 'type' : 'password', 'autocomplete' : 'off'}}),
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
     * Valida o input
     *
     * @author Mauro Ribeiro, Rafael Erthal
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
     * @author Mauro Ribeiro, Rafael Erthal
     * @since  2013-05
     */
    this.rules = function (value) {
        if (value) {

            if (value.constructor !== Array) {
                throw new Error({
                    source    : 'inputPassword.js',
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
     * Controla a legenda do input
     *
     * @author Mauro Ribeiro, Rafael Erthal
     * @since  2013-05
     */
    this.legend = function (value) {
        if (value) {

            if (value.constructor !== String) {
                throw new Error({
                    source    : 'inputPassword.js',
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
     * Controla o valor do input
     *
     * @author Mauro Ribeiro, Rafael Erthal
     * @since  2013-05
     */
    this.value = function (value) {
        if (value) {

            if (value.constructor !== String && value.constructor !== Number) {
                throw new Error({
                    source    : 'inputPassword.js',
                    method    : 'value',
                    message   : 'Value value must be a string or number',
                    arguments : arguments
                });
            }

            input.attribute('value').set(value);
            this.change();
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
                    source    : 'inputPassword.js',
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
     * Dá focus no input
     *
     * @author Mauro Ribeiro, Rafael Erthal
     * @since  2013-05
     */
    this.focus = function () {
        setTimeout(function () {input.event('focus').trigger()}, 100);
    }

    /**
     * Controla a visibilidade do input
     *
     * @author Mauro Ribeiro, Rafael Erthal
     * @since  2013-05
     */
    this.visibility = function (value) {
        if (value) {

            if (value.constructor !== String) {
                throw new Error({
                    source    : 'inputPassword.js',
                    method    : 'visibility',
                    message   : 'Visibility value must be a string',
                    arguments : arguments
                });
            }

            switch (value) {
                case 'hide' :
                    element.attribute('class').set('field password hide');
                    break;
                case 'show' :
                    element.attribute('class').set('field password');
                    break;
                case 'fade' :
                    element.attribute('class').set('field password fade');
                    break;
            }
        } else {
            return element.attribute('class').get().replace('field password', '');
        }
    };

    /**
     * Controla orientador
     *
     * @author Mauro Ribeiro, Rafael Erthal
     * @since  2013-05
     */
    this.helper = new Helper(element);

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
        this.visibility(params.visibility);
        this.errors.add(params.errors);
        this.rules(params.rules);
        if (params.helper) {
            this.helper.description(params.helper.description);
            this.helper.example(params.helper.example);
        }
    }
}));