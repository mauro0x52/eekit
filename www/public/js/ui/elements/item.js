/**
 * Ícones do eekit
 *
 * @author Mauro Ribeiro
 * @since  2013-05
 */

var Element    = module.use('element'),
    Css        = module.use('css'),
    Collection = module.use('collection'),
    Icon       = module.use('icon'),
    Action     = module.use('action');

module.exports(new Class(function (params) {
    var element,
        label, legend, title, titleAnchor, description, icons, actions,
        click_cb,
        drop_cb,
        that = this;

    element = new Element('li', {attributes : {'class' : 'item'}, html : [
        label = new Element('div', {attributes : {'class' : 'label'}, html : [
            new Element('div', {attributes : {'class' : 'background'}}),
            legend = new Element('div', {attributes : {'class' : 'legend hide'}})
        ]}),
        title = new Element('h4', {attributes : {'class' : 'title hide'}, html : [
            titleAnchor = new Element('a', {attributes : {'class' : 'anchor'}})
        ]}),
        icons = new Element('ul', {attributes : {'class' : 'icons hide'}}),
        description = new Element('p', {attributes : {'class' : 'description hide'}}),
        actions = new Element('menu', {attributes : {'class' : 'actions hide'}}),
        new Element('div', {attributes : {'class' : 'click'}, html : [
            new Element('div', {attributes : {'class' : 'arrow'}, html : [
                new Element('div', {attributes : {'class' : 'fill'}})
            ]})
        ]})
    ]});

    element.event('click').bind(function (e) {
        e.preventDefault();

        if (Empreendekit.ui.dragging === element) {
            element.parent().parent().event('drop').trigger();
        } else {
            that.click();
        }
    }, true);

    element.event('release').bind(function (e) {
        Empreendekit.ui.dragging = null;
        element.attribute('class').set('item');
        
    });

    element.event('mouseover').bind(function (e) {
        if (Empreendekit.ui.dragging) {

            e.preventDefault(); 

            var elements = element.parent().html.get(),
                hovered_poisition,
                dragging_poisition;

            for (var i in elements) {
                if (elements[i].id() === element.id()) {
                    hovered_poisition = i;
                }
                if (elements[i].id() === Empreendekit.ui.dragging.id()) {
                    dragging_poisition = i;
                }
            }

            if (hovered_poisition > dragging_poisition) {
                Empreendekit.ui.dragging.html.attachAfter(element);
            } else {
                Empreendekit.ui.dragging.html.attachBefore(element);
            }
        }
    });

    this.attach = element.attach;
    this.detach = element.detach;

    /**
     * Inicia o drag'n drop
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.drag = function () {
        element.attribute('class').set('item dragging');
        Empreendekit.ui.dragging = element;
    };

    /**
     * Controla a ação de drop do item
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.drop = function (value) {
        if (value) {

            if (value.constructor !== Function) {
                throw new Error({
                    source    : 'item.js',
                    method    : 'click',
                    message   : 'Click value must be a function',
                    arguments : arguments
                });
            }

            drop_cb = value
        } else {
            if (drop_cb) {
                drop_cb.apply(that);
            }
        }
    };

    /**
     * Controla a ação do click no item
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.click = function (value) {
        if (value) {

            if (value.constructor !== Function) {
                throw new Error({
                    source    : 'item.js',
                    method    : 'click',
                    message   : 'Click value must be a function',
                    arguments : arguments
                });
            }

            element.attribute('class').set('item clickable');
            click_cb = value;
        } else {
            if (click_cb) {
                click_cb.apply(that);
            }
        }
    }

    /**
     * Controla a label do item
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.label = {
        color : function (value) {
            if (value === '') {
                label.attribute('class').set('label');
            }
            if (value) {

                if (value.constructor !== String) {
                    throw new Error({
                        source    : 'item.js',
                        method    : 'label.color',
                        message   : 'Color value must be a string',
                        arguments : arguments
                    });
                }

                label.attribute('class').set('label ' + value);
            } else {
                return label.attribute('class').get().replace('label', '');
            }
        },
        legend : function (value) {
            if (value === '') {
                legend.attribute('class').set('legend hide');
            }
            if (value) {

                if (value.constructor !== String) {
                    throw new Error({
                        source    : 'item.js',
                        method    : 'label.legend',
                        message   : 'Legend value must be a string',
                        arguments : arguments
                    });
                }

                legend.attribute('class').set('legend');
                legend.html.set(value)
            } else {
                return legend.html.get();
            }
        }
    };

    /**
     * Controla o título do item
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.title = function (value) {
        if (value === '') {
            title.attribute('class').set('title hide');
        }
        if (value) {

            if (value.constructor !== String) {
                throw new Error({
                    source    : 'item.js',
                    method    : 'title',
                    message   : 'Title value must be a string',
                    arguments : arguments
                });
            }

            title.attribute('class').set('title');
            titleAnchor.html.set(value);
        } else {
            return titleAnchor.html.get();
        }
    };

    /**
     * Controla a descrição do item
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.description = function (value) {
        if (value === '') {
            description.attribute('class').set('description hide');
        }
        if (value) {

            if (value.constructor !== String) {
                throw new Error({
                    source    : 'item.js',
                    method    : 'description',
                    message   : 'Description value must be a string',
                    arguments : arguments
                });
            }

            description.attribute('class').set('description');
            description.html.set(value);
        } else {
            return description.html.get();
        }
    };

    /**
     * Controla a href das âncoras
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.href = function (value) {
        if (value) {

            if (value.constructor !== String) {
                throw new Error({
                    source    : 'item.js',
                    method    : 'href',
                    message   : 'Href value must be a string',
                    arguments : arguments
                });
            }

            titleAnchor.attribute('href').set(value);
        } else {
            return titleAnchor.attribute('href').get();
        }
    }

    /**
     * Controla a visibilidade do item
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.visibility = function (value) {
        if (value) {

            if (value !== 'hide' && value !== 'show' && value !== 'fade') {
                throw new Error({
                    source    : 'item.js',
                    method    : 'visibility',
                    message   : 'Visibility value must be "hide", "show" or "fade"',
                    arguments : arguments
                });
            }

            switch (value) {
                case 'hide' :
                    element.attribute('class').set('item hide');
                    break;
                case 'show' :
                    if (click_cb) {
                        element.attribute('class').set('item clickable');
                    } else {
                        element.attribute('class').set('item');
                    }
                    break;
                case 'fade' :
                    element.attribute('class').set('item fade');
                    break;
            }
        } else {
            return element.attribute('class').get().replace('item', '');
        }
    };

    /**
     * Controla os icones do item
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.icons = new Collection(icons, [Icon]);

    /**
     * Controla as ações do item
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.actions = new Collection(actions, [Action]);

    /**
     * Controla o orientador do item
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    //this.helper = new empreendemia.ui.helper(element);

    /*
     * Valores iniciais
     */
    if (params) {
        this.title(params.title);
        this.description(params.description);
        this.href(params.href);
//        this.visibility(params.visibility);
        this.icons.add(params.icons);
        this.actions.add(params.actions);
//        this.droppableGroups(params.droppableGroups);
//        this.drop(params.drop);
        this.click(params.click);
        if (params.label) {
            this.label.color(params.label.color);
            this.label.legend(params.label.legend);
        }
//        if (params.helper) {
//            this.helper.description(params.helper.description);
//            this.helper.example(params.helper.example);
//        }
    }
}));