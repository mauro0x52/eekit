/**
 * Conjunto de grupos do eekit
 *
 * @author rafael erthal
 * @since 2013-05
 */

var Element    = module.use('element'),
    Css        = module.use('css'),
    Collection = module.use('collection'),
    Icon       = module.use('icon'),
    Group      = module.use('group'),
    Action     = module.use('action'),
    Helper     = module.use('helper'),
    GroupSet;

module.exports(GroupSet = new Class(function (params) {
    var element,
        headerTitle, headerIcons, headerActions,
        footer, footerTitle, footerIcons,
        groups;

    element = new Element('div', {attributes : {'class' : 'group'}, html : [
        new Element('div', {attributes : {'class' : 'header'}, html : [
            headerTitle = new Element('h3', {attributes : {'class' : 'hide'}}),
            headerIcons = new Element('ul', {attributes : {'class' : 'icons'}}),
            headerActions = new Element('menu', {attributes : {'class' : 'actions'}})
        ]}),
        groups = new Element('ol', {attributes : {'class' : 'groups'}}),
        footer = new Element('div', {attributes : {'class' : 'hide'}, html : [
            footerTitle = new Element('div', {attributes : {'class' : 'name'}}),
            footerIcons = new Element('ul', {attributes : {'class' : 'icons'}})
        ]})
    ]});

    element.template = this;
    this.id     = element.id;
    this.attach = element.attach;
    this.detach = element.detach;

    /**
     * Controla o cabeçalho do conjunto de grupos
     *
     * @author Mauro Ribeiro, Rafael Erthal
     * @since  2013-05
     */
    this.header = {
        title : function (value) {
            if (value === '') {
                headerTitle.attribute('class').set('hide');
            }
            if (value) {

                if (value.constructor !== String) {
                    throw new Error({
                        source    : 'groupset.js',
                        method    : 'header.title',
                        message   : 'Title value must be a string',
                        arguments : arguments
                    });
                }

                headerTitle.attribute('class').set('name');
                headerTitle.html.set(value);
            } else {
                return headerTitle.html.get()[0];
            }
        },
        icons : new Collection(headerIcons, [Icon]),
        actions : new Collection(headerActions, [Action])
    };

    /**
     * Controla o rodapé do conjunto de grupos
     *
     * @author Mauro Ribeiro, Rafael Erthal
     * @since  2013-05
     */
    this.footer = {
        title : function (value) {
            if (value === '') {
                footerTitle.attribute('class').set('hide');
            }
            if (value) {

                if (value.constructor !== String) {
                    throw new Error({
                        source    : 'groupset.js',
                        method    : 'footer.title',
                        message   : 'Title value must be a string',
                        arguments : arguments
                    });
                }

                footer.attribute('class').set('footer');
                footerTitle.attribute('class').set('name');
                footerTitle.html.set(value);
            } else {
                return footerTitle.html.get()[0];
            }
        },
        icons : new Collection(footerIcons, [Icon]),
        helper : new Helper(footer)
    };

    /**
     * Controla a visibilidade do conjunto de grupos
     *
     * @author Mauro Ribeiro, Rafael Erthal
     * @since  2013-05
     */
    this.visibility = function (value) {
        if (value) {

            if (value.constructor !== String) {
                throw new Error({
                    source    : 'groupset.js',
                    method    : 'visibility',
                    message   : 'Visibility value must be a string',
                    arguments : arguments
                });
            }

            switch (value) {
                case 'hide' :
                    element.attribute('class').set('group hide');
                    break;
                case 'show' :
                    element.attribute('class').set('group');
                    break;
                case 'fade' :
                    element.attribute('class').set('group fade');
                    break;
            }
        } else {
            return element.attribute('class').get().replace('group', '');
        }
    }

    /**
     * Controla os grupos dentro do conjunto de grupos
     *
     * @author Mauro Ribeiro, Rafael Erthal
     * @since  2013-05
     */
    this.groups = new Collection(groups, [GroupSet, Group]);

    /*
     * Valores iniciais
     */
    if (params) {
        this.groups.add(params.groups);
        if (params.header) {
            this.header.title(params.header.title);
            if (params.header.icons) {
                this.header.icons.add(params.header.icons);
            }
            if (params.header.actions) {
                this.header.actions.add(params.header.actions);
            }
        }
        if (params.footer) {
            this.footer.title(params.footer.title);
            if (params.footer.icons) {
                this.footer.icons.add(params.footer.icons);
            }
            if (params.footer.helper) {
                this.footer.helper.description(params.footer.helper.description);
                this.footer.helper.example(params.footer.helper.example);
            }
        }
        this.visibility(params.visibility);
    }

}));