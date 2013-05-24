/*
 * Interface de listagem de aplicativos do eekit
 *
 * @author Rafael Erthal
 * @since  2013-05
 */

var Element       = module.use('element'),
    Css           = module.use('css'),
    App           = module.use('app'),
    Collection    = module.use('collection'),
    Helper        = module.use('helper'),
    FieldSet      = module.use('fieldset'),
    InputText     = module.use('inputText'),
    InputSelector = module.use('inputSelector'),
    InputOption   = module.use('inputOption'),
    InputDate     = module.use('inputDate'),
    GroupSet      = module.use('groupset'),
    Group         = module.use('group'),
    Item          = module.use('item'),
    Icon          = module.use('icon'),
    Action        = module.use('action');

module.exports(new Class(function (context) {

    this.inherit(App);

    var element,
        groups,
        filter,
        form,
        fieldsets,
        body,
        action,
        actions,
        submit_cb,
        self = this;

    this.sheet.html.attach([
        /* Filtro */
        filter  = new Element('div', {attributes : {'class' : 'filter'}, html : [
            form = new Element('form', {attributes : {'class' : 'form'}, html : [
                /* Fieldsets */
                fieldsets = new Element('div', {attributes : {'class' : 'field-sets'}}),
                /* Submit */
                new Element('div', {attributes : {'class' : 'submit'}, html : [
                    action = new Element('input', {attributes : {'type' : 'submit', 'class' : 'input'}})
                ]})
            ]})
        ]}),
        /* Body */
        new Element('div', {attributes : {'class' : 'body'}, html : [
            /* Actions */
            new Element('div', {attributes : {'class' : 'menu'}, html : [
                actions  = new Element('menu', {attributes : {'class' : 'actions'}})
            ]}),
            /* Grupos */
            groups  = new Element('ol', {attributes : {'class' : 'groups'}})
        ]})
    ]);

    form.event('submit').bind(function (evt) {
        evt.preventDefault();
        self.form.submit();
        return false;
    })

    this.sheet = undefined;
    this.helper = Helper;
    this.fieldset = FieldSet;
    this.inputText = InputText;
    this.inputOption = InputOption;
    this.inputSelector = InputSelector;
    this.inputDate = InputDate;
    this.groupset = GroupSet;
    this.group = Group;
    this.item = Item;
    this.icon = Icon;
    this.action = Action;

    /* Controla o filtro do app
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.filter = {

        action : function (value) {

            if (value) {

                if (value.constructor != String) {
                    throw new Error({
                        source     : 'list.js',
                        method     : 'filter.action',
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
                        source     : 'list.js',
                        method     : 'filter.submit',
                        message    : 'Submit callback must be a function',
                        arguments : arguments
                    });
                }

                submit_cb = value;
            } else {
                if (submit_cb) {
                    submit_cb();
                }
            }

        },

        fieldsets : new Collection(fieldsets, [FieldSet])

    };

    /* Controla os grupos do app
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.actions = new Collection(actions, [Action]);

    /* Controla os grupos do app
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.groups = new Collection(groups, [Group, GroupSet]);

}));