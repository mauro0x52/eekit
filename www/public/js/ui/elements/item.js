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
    Action     = module.use('action'),
    Helper     = module.use('helper');

module.exports(new Class(function (params) {
    var element,
        label, legend, title, titleAnchor, description, icons, actions, arrow,
        click_cb,
        drop_cb,
        that = this,
        style = {
            "click"      : "",
            "drag"      : "",
            "visibility" : "show"
        };

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
        arrow = new Element('div', {attributes : {'class' : 'click'}, html : [
            new Element('div', {attributes : {'class' : 'arrow'}, html : [
                new Element('div', {attributes : {'class' : 'fill'}})
            ]})
        ]})
    ]});

    titleAnchor.event('click').bind(function () {
        if (!Empreendekit.ui.dragging()) {
            that.click();
        }
    }, true);
    arrow.event('click').bind(function () {
        if (!Empreendekit.ui.dragging()) {
            that.click();
        }
    }, true);

    element.event('click').bind(function (e) {
        if (Empreendekit.ui.dragging() === element) {
            element.parent().parent().event('drop').trigger();
        }
    });

    element.event('mouseover').bind(function (e) {
        if (Empreendekit.ui.dragging() && element.parent().parent().attribute('droppable').get() === 'true') {
            e.preventDefault();

            if (element.parent() === Empreendekit.ui.dragging().parent()) {
                /* Elementos do mesmo grupo */
                var elements = element.parent().html.get(),
                    hovered_poisition,
                    dragging_poisition;

                for (var i in elements) {
                    if (elements[i] === element.template) {
                        hovered_poisition = i;
                    }
                    if (elements[i] === Empreendekit.ui.dragging().template) {
                        dragging_poisition = i;
                    }
                }

                if (hovered_poisition > dragging_poisition) {
                    Empreendekit.ui.dragging().html.attachAfter(element);
                } else {
                    Empreendekit.ui.dragging().html.attachBefore(element);
                }
            } else {
                /* Elementos de grupos distintos */
                element.html.attachAfter(Empreendekit.ui.dragging());
            }
        }
    });

    element.template = this;
    this.id     = element.id;
    this.attach = element.attach;
    this.detach = element.detach;

    /**
     * altera o status do css do objeto
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    var css = function () {
        element.attribute('class').set('item ' + style.click + ' ' + style.drag + ' ' + style.visibility);
    };

    /**
     * Inicia o drag'n drop
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.drag = function () {
        style.drag= 'dragging';
        css();

        Empreendekit.ui.dragging(element);
    };

    /**
     * Controla a ação de drop do item
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.drop = function (value) {
        if (!value) {
            throw new Error({
                source    : 'item.js',
                method    : 'click',
                message   : 'Drop value must be defined',
                arguments : arguments
            });
        }

        if (value.constructor === Function) {
            drop_cb = value;
        } else {
            style.drag= '';
            css();

            Empreendekit.ui.dragging(null);

            if (drop_cb && value) {
                drop_cb(value.group, value.position);
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

            style.click = 'clickable';
            css();

            click_cb = value;
        } else {
            if (click_cb) {
                click_cb.apply(that);
            }
        }
    };

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
                return legend.html.get()[0];
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
            return titleAnchor.html.get()[0];
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
            description.html.set(value.replace(/%0A/g, ' '));
        } else {
            return description.html.get()[0];
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
    };

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
                    style.visibility = 'hide';
                    break;
                case 'show' :
                    style.visibility = '';
                    break;
                case 'fade' :
                    style.visibility = 'fade';
                    break;
            }
            css();
        } else {
            switch (style.visibility) {
                case 'hide' :
                     return 'hide';
                case 'fade' :
                    return 'fade';
                default :
                    return 'show';
            }
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
    this.helper = new Helper(element);

    /*
     * Valores iniciais
     */
    if (params) {
        this.title(params.title);
        this.description(params.description);
        this.href(params.href);
        this.visibility(params.visibility);
        this.icons.add(params.icons);
        this.actions.add(params.actions);
        this.click(params.click);
        if (params.drop) {
            this.drop(params.drop);
        }
        if (params.label) {
            this.label.color(params.label.color);
            this.label.legend(params.label.legend);
        }
        if (params.helper) {
            this.helper.description(params.helper.description);
            this.helper.example(params.helper.example);
        }
    }
}));