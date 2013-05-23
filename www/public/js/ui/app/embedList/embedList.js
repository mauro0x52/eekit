/*
 * Interface de listagem embedada de aplicativos do eekit
 *
 * @author Rafael Erthal
 * @since  2013-05
 */

var Element    = module.use('element'),
    Css        = module.use('css'),
    Collection = module.use('collection'),
    EmbedApp   = module.use('embedApp')
    Helper     = module.use('helper'),
    FieldSet   = module.use('fieldset'),
    InputText  = module.use('inputText'),
    GroupSet   = module.use('groupset'),
    Group      = module.use('group'),
    Item       = module.use('item'),
    Icon       = module.use('icon'),
    Action     = module.use('action');

module.exports(new Class(function (context) {

    this.inherit(EmbedApp);

    var groups;

    this.body.html.attach([
        groups  = new Element('div', {attributes : {'class' : 'groups'}})
    ]);

    this.body = undefined;
    this.helper = Helper;
    this.fieldset = FieldSet;
    this.inputText = InputText;
    this.groupset = GroupSet;
    this.group = Group;
    this.item = Item;
    this.icon = Icon;
    this.action = Action;

    /* Controla os grupos do app
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.groups = new Collection(groups, [GroupSet]);

}));