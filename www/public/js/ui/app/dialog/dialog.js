/*
 * Interface de dialogo de aplicativos do eekit
 *
 * @author Rafael Erthal
 * @since  2013-05
 */

var Element        = module.use('element'),
    Css            = module.use('css'),
    Collection     = module.use('collection'),
    FieldSet       = module.use('fieldset'),
    InputText      = module.use('inputText'),
    InputTextArea  = module.use('inputTextArea'),
    InputError     = module.use('inputError'),
    InputSelector  = module.use('inputSelector'),
    InputOption    = module.use('inputOption'),
    InputDate      = module.use('inputDate');

module.exports(new Class(function (context) {

    var element,
        title,
        close,
        flash,
        description,
        form,
        fieldsets,
        action;

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
                description = new Element('p', {attributes : {'class' : 'description hide'}}),
                form        = new Element('form', {attributes : {'class' : 'form'}, html : [
                    fieldsets = new Element('div', {attributes : {'class' : 'field-sets'}}),
                    new Element('div', {attributes : {'class' : 'submit'}, html : [
                        action = new Element('input', {attributes : {'class' : 'input', type : 'submit'}})
                    ]})
                ], events : {
                    submit : function (evt) {
                        evt.preventDefault();
                    }
                }})
            ]})
        ]})
    ]});

    this.attach = element.attach;
    this.detach = element.detach;
    this.fieldset = FieldSet;
    this.inputText = InputText;
    this.inputTextarea = InputTextArea;
    this.inputError = InputError;
    this.inputSelector = InputSelector;
    this.inputOption = InputOption;
    this.inputDate = InputDate;

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
            title.html.get();
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
            description.html.get();
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
            flash.html.get();
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

                action.html.set(value);
            } else {
                action.html.get();
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

}));