/*
 * Interface de dialogo de aplicativos do eekit
 *
 * @author Rafael Erthal
 * @since  2013-05
 */

var Element        = module.use('element'),
    Css            = module.use('css'),
    Collection     = module.use('collection'),
    Action         = module.use('action'),
    FieldSet       = module.use('fieldset'),
    InputText      = module.use('inputText'),
    InputTextArea  = module.use('inputTextArea'),
    InputError     = module.use('inputError'),
    InputSelector  = module.use('inputSelector'),
    InputOption    = module.use('inputOption'),
    InputDate      = module.use('inputDate'),
    InputPassword  = module.use('inputPassword');

module.exports(new Class(function (context) {

    var element,
        title,
        close,
        flash,
        description,
        form,
        fieldsets,
        action,
        actions,
        close_cb,
        self = this;

    element = new Element('div', {attributes : {'class' : 'modal-wrapper'}, html : [
        new Element('div', {attributes : {'class' : 'background'}}),
        new Element('div', {attributes : {'class' : 'centralizer'}, html : [
            new Element('div', {attributes : {'class' : 'modal'}, html : [
                new Element('div', {attributes : {'class' : 'header'}, html : [
                    title = new Element('h1', {attributes : {'class' : 'title'}})
                ]}),
                close = new Element('div', {attributes : {'class' : 'close'}, html : [
                    new Element('div', {attributes : {'class' : 'image'}}),
                    new Element('div', {attributes : {'class' : 'legend'}, html : 'fechar'})
                ]}),
                flash       = new Element('div', {attributes : {'class' : 'flash hide'}}),
                description = new Element('p', {attributes : {'class' : 'description'}}),
                form        = new Element('form', {attributes : {'class' : 'form'}, html : [
                    fieldsets = new Element('div', {attributes : {'class' : 'field-sets'}}),
                    new Element('div', {attributes : {'class' : 'submit'}, html : [
                        action = new Element('input', {attributes : {'class' : 'input', type : 'submit'}})
                    ]})
                ], events : {
                    submit : function (evt) {
                        evt.preventDefault();
                    }
                }}),
                actions = new Element('menu', {attributes : {'class' : 'actions'}})
            ]})
        ]})
    ]});

    close.event('click').bind(function () {
        context.close();
    });

    element.template = this;
    this.id = element.id;
    this.attach = element.attach;
    this.detach = element.detach;
    this.action = Action;
    this.fieldset = FieldSet;
    this.inputText = InputText;
    this.inputTextarea = InputTextArea;
    this.inputError = InputError;
    this.inputSelector = InputSelector;
    this.inputOption = InputOption;
    this.inputDate = InputDate;
    this.inputPassword = InputPassword;

    this.context = function () {

        return context;

    };

    /* Controla o fechamento da ui
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.close = function (value) {
        if (value) {

            if (value.constructor === Function) {
                throw new Error({
                    source    : 'app.js',
                    method    : 'click',
                    message   : 'Click value must be a function',
                    arguments : arguments
                });
            }

            close_cb = value;
        } else {

            self.detach();
            if (close_cb) {
                close_cb();
            }
        }
    };

    /**
     * Controla o titulo do app
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.title = function (value) {

        if (value) {

            if (value.constructor != String) {
                throw new Error({
                    source    : 'dialog.js',
                    method    : 'title',
                    message   : 'Title value must be a string',
                    arguments : arguments
                });
            }

            title.html.set(value);
        } else {
            title.html.get()[0];
        }

    };

    /**
     * Controla a descrição do app
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.description = function (value) {

        if (value) {

            if (value.constructor != String) {
                throw new Error({
                    source     : 'dialog.js',
                    method     : 'description',
                    message    : 'Description value must be a string',
                    arguments : arguments
                });
            }

            description.html.set(value);
        } else {
            description.html.get()[0];
        }

    };

    /**
     * Controla o flash do app
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.error = function (value) {

        if (value) {

            if (value.constructor != String) {
                throw new Error({
                    source     : 'dialog.js',
                    method     : 'error',
                    message    : 'Error value must be a string',
                    arguments : arguments
                });
            }

            flash.html.set(value);
        } else {
            flash.html.get()[0];
        }

    };

    /**
     * Controla o formulário do app
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.form = {

        action : function (value) {

            if (value) {

                if (value.constructor != String) {
                    throw new Error({
                        source     : 'dialog.js',
                        method     : 'form.action',
                        message    : 'Action value must be a string',
                        arguments : arguments
                    });
                }
                action.attribute('value').set(value);
            } else {
                action.attribute('value').get();
            }

        },

        submit : function (value) {

            if (value) {

                if (value.constructor != Function) {
                    throw new Error({
                        source     : 'dialog.js',
                        method     : 'form.submit',
                        message    : 'Submit callback must be a function',
                        arguments : arguments
                    });
                }

                form.event('submit').bind(function (evt) {
                    evt.preventDefault();
                    value.apply(context);
                });
            } else {
                form.event('submit').trigger();
            }

        },

        fieldsets : new Collection(fieldsets, [FieldSet])

    }

    /**
     * Controla as ações do modal
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     *
     */
    this.actions = new Collection(actions, [Action]);
    
}));