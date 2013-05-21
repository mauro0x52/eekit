/**
 * Seletor
 *
 * @author Mauro Ribeiro
 * @since  2013-05
 */

var Element     = module.use('element'),
    Css         = module.use('css'),
    Collection  = module.use('collection'),
    InputOption = module.use('inputOption');

module.exports(new Class(function (params) {
    var element,
        legend, input, arrow, selected, options, actions, markall, unmarkall,
        type, change_cb,
        self = this;

    element = new Element('li', {attributes : {'class' : 'field select'}, html : [
        new Element('div', {attributes : {'class' : 'legend'}, html : [
            legend = new Element('label', {attributes : {'class' : 'text'}})
        ]}),
        new Element('div', {attributes : {'class' : 'data'}, html : [
            input  = new Element('input', {attributes : {'class' : 'input hide', 'type' : 'text', 'autocomplete' : 'off'}}),
            arrow = new Element('div', {attributes : {'class' : 'arrow hide'}, html : [
                new Element('div', {attributes : {'class' : 'fill'}})
            ]}),
            new Element('div', {attributes : {'class' : 'selected-list hide'}, html : [
                new Element('div', {attributes : {'class' : 'legend'}}),
                selected = new Element('ul', {attributes : {'class' : 'list'}})
            ]}),
            options = new Element('ul', {attributes : {'class' : 'options hide'}})
        ]}),
        actions = new Element('div', {attributes : {'class' : 'hide'}, html : [
            markall = new Element('div', {attributes : {'class' : 'markall'}}),
            unmarkall = new Element('div', {attributes : {'class' : 'unmarkall'}})
        ]})

    ]});

    element.template = this;
    this.id     = element.id;
    this.attach = element.attach;
    this.detach = element.detach;

    this.listSelected = function () {
        var options = self.options.get(),
            i,
            html;

        html = '<div class="legend">selecionados:</div><ul class="list">';
        for (i in options) {
            if (options[i].clicked()) {
                html += '<li class="item">' + options[i].legend() + '</li>';
            }
        }
        html += '</ul>';
        selected.html.set(html);
    }

    options.event('click').bind(function () {
        if (type === 'single') {
            var options = self.options.get();

            for (var i in options) {
                if (options[i]) {
                    options[i].clicked(false);
                }
            }
        }
        setTimeout(function () {
            self.change();
            self.listSelected();
        }, 10);
    });

    markall.event('click').bind(function () {
        var options = self.options.get();
        for (var i in options) {
            if (options[i]) {
                options[i].clicked(true);
            }
        }
        self.change();
    });

    unmarkall.event('click').bind(function () {
        var options = self.options.get();
        for (var i in options) {
            if (options[i]) {
                options[i].clicked(false);
            }
        }
        self.change();
    });

    input.event('keyup').bind(function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
    });

    input.event('keyup').bind(function (event) {
        var options = self.options.get(),
            i;

        for (i in options) {
            if ((options[i] && options[i].legend && options[i].legend().toLowerCase().indexOf(input_text.value.toLowerCase()) >= 0) || input_text.value === '') {
                options[i].visibility('show');
            } else {
                options[i].visibility('hide');
            }
        }
    });

    arrow.event('click').bind(function () {
        if (self.filterable()) {
            input.focus();
            options.attribute('class').set('options filterable');
        }
    });

    arrow.event('blur').bind(function () {
        if (self.filterable()) {
            setTimeout(function () {
                options.setAttribute('class', 'options filterable hide');
            }, 100);
        }
    });

    /**
     * Controla a legenda do input
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.legend = function (value) {
        if (value) {

            if (value.constructor !== String) {
                throw new Error({
                    source    : 'inputSelector.js',
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
     * Controla o tipo do seletor
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.type = function (value) {
        if (value) {

            if (value !== 'single' && value !== 'multiple') {
                throw new Error({
                    source    : 'inputSelector.js',
                    method    : 'type',
                    message   : 'Type value must be "single" or "multiple"',
                    arguments : arguments
                });
            }

            type = value;
        } else {
            return type;
        }
    }

    /**
     * Pega o array de opções selecionadas
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.value = function () {
        var options = self.options.get(),
            res = [];
        for (var i in options) {
            if (options[i].clicked()) {
                res.push(options[i].value());
            }
        }
        return res;
    }

    /**
     * Controla o callback do evento change
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.change = function (value) {
        if (value) {

            if (value.constructor !== Function) {
                throw new Error({
                    source    : 'inputSelector.js',
                    method    : 'change',
                    message   : 'Change value must be a function',
                    arguments : arguments
                });
            }

            change_cb = value;
        } else {
            if (change_cb) {
                change_cb.apply(change_cb);
            }
        }
    };


    /**
     * Controla as ações do seletor
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.actions = function (value) {
        if (value === true || value === false) {
            if (value) {
                element.appendChild(actions);
            } else if (actions.parentNode == element) {
                element.removeChild(actions);
            }
        } else if (value) {

            throw new Error({
                source    : 'inputSelector.js',
                method    : 'actions',
                message   : 'Actions value must be a boolean',
                arguments : arguments
            });

        } else {
            return actions.parentNode == element;
        }
    };

    /**
     * Troca o template para filtrável
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.filterable = function (value) {
        if (value === true || value === false) {
            if (value) {
                input.attribute('class').set('input');
                arrow.attribute('class').set('image arrow');
                selected.attribute('class').set('selected-list');
                options.attribute('class').set('options filterable hide');
            } else {
                input.attribute('class').set('hide');
                arrow.attribute('class').set('hide');
                selected.attribute('class').set('hide');
                options.attribute('class').set('options');
            }
        } else if (value) {

            throw new Error({
                source    : 'inputSelector.js',
                method    : 'filterable',
                message   : 'Filterable value must be a boolean',
                arguments : arguments
            });

        } else {
            return options.attribute('class').get() !== 'options';
        }
    };

    /**
     * Mostra ou esconde
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.visibility = function (value) {
        if (value) {

            if (value !== 'hide' && value !== 'show' && value !== 'fade') {
                throw new Error({
                    source    : 'inputSelector.js',
                    method    : 'visibility',
                    message   : 'Visibility value must be "hide", "show" or "fade"',
                    arguments : arguments
                });
            }

            switch (value) {
                case 'hide' :
                    element.attribute('class').set('field select hide');
                    break;
                case 'show' :
                    element.attribute('class').set('field select');
                    break;
                case 'fade' :
                    element.attribute('class').set('field select fade');
                    break;
            }
        } else {
            return element.attribute('class').get().replace('field select', '');
        }
    };

    /**
     * Controla as opções
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.options = new Collection(options, [InputOption]);

    /*
     * Valores inciais
     */
    if (params) {
        this.legend(params.legend);
        this.type(params.type);
        this.options.add(params.options);
        this.change(params.change);
        this.actions(params.actions);
        this.filterable(params.filterable);
        this.listSelected();
    }
}));