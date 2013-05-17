/*
 * Interface de listagem de aplicativos do eekit
 *
 * @author Rafael Erthal
 * @since  2013-05
 */

var Element    = module.use('element'),
    Css        = module.use('css'),
    App        = module.use('app'),
    Collection = module.use('collection'),
    Helper     = module.use('helper'),
    FieldSet   = module.use('fieldset'),
    InputText  = module.use('inputText'),
    GroupSet   = module.use('groupset'),
    Group      = module.use('group'),
    Item       = module.use('item'),
    Icon       = module.use('icon'),
    Action     = module.use('action');

module.exports(new Class(function (context) {

    this.inherit(App);

    var element,
        groups,
        filter,
        form,
        fieldsets,
        body,
        action,
        actions;

    this.sheet.html.attach([
        /* Filtro */
        filter  = new Element('div', {attributes : {'class' : 'filter'}, html : [
            new Element('form', {attributes : {'class' : 'form'}, html : [
                /* Fieldsets */
                fieldsets = new Element('div', {attributes : {'class' : 'field-sets'}}),
                /* Submit */
                new Element('div', {attributes : {'class' : 'submit'}, html : [
                    action = new Element('input', {attributes : {'type' : 'submit', 'class' : 'input'}})
                ]})
            ], events : {
                submit : function (evt) {
                    evt.preventDefault();
                }
            }})
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

    this.sheet = undefined;
    this.helper = Helper;
    this.fieldset = FieldSet;
    this.inputText = InputText;
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

                action.html.set(value);
            } else {
                action.html.get();
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

                form.event('submit').bind(function (evt) {
                    evt.preventDefault();
                    value.apply(context);
                });
            } else {
                form.event('submit').trigger();
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
    this.groups = new Collection(groups, [GroupSet]);

}));