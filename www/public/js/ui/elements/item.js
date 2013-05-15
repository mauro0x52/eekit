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
    ]})

//    element.addEventListener('click', function (e) {
//        var releasable = app.ui.releasable(),
//            receptive =  app.ui.receptive();
//
//        if (releasable && releasable.constructor === app.ui.item && receptive && receptive.constructor === app.ui.group) {
//
//            e.preventDefault();
//            e.stopPropagation();
//
//            releasable.detach(document.body, ['aaa']);
//
//            var items = receptive.items.get(),
//                position = 1;
//
//            receptive.items.remove();
//            for (var j in items) {
//                if (items[j] === that) {
//                    releasable.drop(receptive, position);
//                    position++;
//                }
//                items[j].drop(receptive, position);
//                position++;
//            }
//        }
//    }, true);


//    title_anchor.addEventListener('click', function (e) {
//        if (click_cb) {
//            click_cb.apply(app);
//        }
//
//        return false;
//    }, true);

    this.attach = element.attach;
    this.detach = element.detach;

    /**
     * Define os grupos que posso dropar este item
     * @TODO implementar
     */
//    this.droppableGroups = function (value) {
//        if (value && value.constructor === Array) {
//            droppableGroups = value;
//        } else {
//            return droppableGroups;
//        }
//    };

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
            element.attribute('class').set('item');
            if (click_cb) {
                click_cb.apply(that);
            }
        }
    }

    /**
     * Drop
     * @TODO implementar
     */
//    this.drop = function (value, position) {
//        if (value && !position) {
//            drop_cb = value;
//        } else {
//            if (position) {
//                var droppableGroups = that.droppableGroups();
//                for (var i = 0; i < droppableGroups.length; i++) {
//                    droppableGroups[i].droppable(false);
//                }
//
//                app.ui.receptive(null);
//                app.ui.releasable(null);
//                value.items.add(that);
//                document.stopDrag();
//                element.setAttribute('style', '');
//                if (that.visibility() === ' hide') {
//                    element.attribute('class').set('item hide');
//                } else if (click_cb) {
//                    element.attribute('class').set('item clickable');
//                } else {
//                    element.attribute('class').set('item');
//                }
//                if (drop_cb) {
//                    drop_cb(value, position);
//                }
//            }
//        }
//    };
    /**
     * Drag
     * @TODO implementar
     */
//    this.drag = function (value) {
//        if (value) {
//            drag_cb = value;
//        } else {
//            if (app.ui.releasable && !app.ui.releasable()) {
//                var droppableGroups = that.droppableGroups();
//                for (var i in droppableGroups) {
//                    droppableGroups[i].droppable(true);
//                }
//
//                app.ui.receptive(null);
//                app.ui.releasable(that);
//                that.detach();
//                document.startDrag(element);
//                if (drag_cb) {
//                    drag_cb();
//                }
//            }
//        }
//    };

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