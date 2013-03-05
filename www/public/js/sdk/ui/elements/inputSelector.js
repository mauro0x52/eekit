/** InputSelector
 *
 * @autor : Rafael Erthal
 * @since : 2012-10
 *
 * @description : implementa inputs
 */

sdk.modules.ui.inputSelector = function (app) {
    return function (params) {
        var parent,
            element = document.createElement('li'),
            legend_div = document.createElement('div'),
            text_label = document.createElement('label'),
            data_div = document.createElement('div'),
            input_text = document.createElement('input'),
            div_arrow = document.createElement('div'),
            div_fill = document.createElement('div'),
            div_selectedList = document.createElement('div'),
            options_ul = document.createElement('ul'),
            actions_div = document.createElement('div'),
            markall_div = document.createElement('div'),
            unmarkall_div = document.createElement('div'),
            that = this,
            type = 'single',
            listSelected,
            cb;

        /* CSS */
        element.setAttribute('class', 'field select');
        legend_div.setAttribute('class', 'legend');
        text_label.setAttribute('class', 'text');
        data_div.setAttribute('class', 'data');
        input_text.setAttribute('class', 'hide');
        input_text.setAttribute('type', 'text');
        div_arrow.setAttribute('class', 'hide');
        div_fill.setAttribute('class', 'fill');
        div_selectedList.setAttribute('class', 'hide');
        options_ul.setAttribute('class', 'options');
        actions_div.setAttribute('class', 'actions');
        markall_div.setAttribute('class', 'markall');
        unmarkall_div.setAttribute('class', 'unmarkall');

        markall_div.innerHTML = 'marcar todos';
        unmarkall_div.innerHTML = 'desmarcar todos';

        /* Eventos */
        listSelected = function () {
            var options = that.options.get(),
                i,
                html;

            html = '<div class="legend">selecionados:</div><ul class="list">';
            for (i in options) {
                if (options[i].clicked()) {
                    html += '<li class="item">' + options[i].legend() + '</li>';
                }
            }
            html += '</ul>';
            div_selectedList.innerHTML = html
        }

        options_ul.addEventListener('click', function () {
            if (type === 'single') {
                var options = that.options.get();

                for (var i in options) {
                    if (options[i]) {
                        options[i].clicked(false);
                    }
                }
            }
            setTimeout(function () {
                that.change();
                listSelected();
            }, 10);
        }, true);

        markall_div.addEventListener('click', function () {
            var options = that.options.get();
            for (var i in options) {
                if (options[i]) {
                    options[i].clicked(true);
                }
            }
            that.change();
        });

        unmarkall_div.addEventListener('click', function () {
            var options = that.options.get();
            for (var i in options) {
                if (options[i]) {
                    options[i].clicked(false);
                }
            }
            that.change();
        });

        input_text.addEventListener('keydown', function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                event.stopPropagation();
                return false;
            }
        });

        input_text.addEventListener('keyup', function () {
            var options = that.options.get(),
                i;

            for (i in options) {
                if ((options[i] && options[i].legend && options[i].legend().toLowerCase().indexOf(input_text.value.toLowerCase()) >= 0) || input_text.value === '') {
                    options[i].visibility('show');
                } else {
                    options[i].visibility('hide');
                }
            }
        });

        div_arrow.addEventListener('click', function () {
            if (that.filterable()) {
                input_text.focus();
                options_ul.setAttribute('class', 'options filterable');
            }
        });

        input_text.addEventListener('focus', function () {
            if (that.filterable()) {
                options_ul.setAttribute('class', 'options filterable');
            }
        });

        input_text.addEventListener('blur', function () {
            if (that.filterable()) {
                setTimeout(function () {
                    options_ul.setAttribute('class', 'options filterable hide');
                }, 200);
            }
        });

        /* Hierarquia */
        element.appendChild(legend_div);
        legend_div.appendChild(text_label);
        element.appendChild(data_div);
        data_div.appendChild(input_text);
        data_div.appendChild(div_arrow);
        div_arrow.appendChild(div_fill);
        data_div.appendChild(div_selectedList);
        data_div.appendChild(options_ul);
        actions_div.appendChild(markall_div);
        actions_div.appendChild(unmarkall_div);

        /* Métodos protegidos */
        this.attach = function (HTMLobject, collection) {
            if (HTMLobject && collection && HTMLobject.appendChild) {
                parent = collection
                HTMLobject.appendChild(element);
            }
        };
        this.detach = function (HTMLobject, collection) {
            if (HTMLobject && collection && HTMLobject.removeChild) {
                HTMLobject.removeChild(element);
            } else {
                parent.remove(this);
            }
        };
        /* Métodos públicos */
        this.legend = function (value) {
            if (value) {
                text_label.innerHTML = value;
            } else {
                return text_label.innerHTML;
            }
        };
        this.type = function (value) {
            if (value) {
                type = value;
            } else {
                return type;
            }
        }
        this.value = function () {
            var options = this.options.get(),
                res = [];
            for (var i in options) {
                if (options[i].clicked()) {
                    res.push(options[i].value());
                }
            }
            return res;
        }
        this.change = function (value) {
            if (value) {
                cb = value;
            } else {
                if (cb) {
                    cb.apply(app);
                }
            }
        };
        this.actions = function (value) {
            if (value === true || value === false) {
                if (value) {
                    element.appendChild(actions_div);
                } else if (actions_div.parentNode == element) {
                    element.removeChild(actions_div);
                }
            } else {
                return actions_div.parentNode == element
            }
        };
        this.filterable = function (value) {
            if (value === true || value === false) {
                if (value) {
                    input_text.setAttribute('class', 'input');
                    div_arrow.setAttribute('class', 'image arrow');
                    div_selectedList.setAttribute('class', 'selected-list');
                    options_ul.setAttribute('class', 'options filterable hide');
                } else {
                    input_text.setAttribute('class', 'hide');
                    div_arrow.setAttribute('class', 'hide');
                    div_selectedList.setAttribute('class', 'hide');
                    options_ul.setAttribute('class', 'options');
                }
            } else {
                return options_ul.getAttribute('class') !== 'options'
            }
        };
        this.visibility = function (value) {
            if (value) {
                switch (value) {
                    case 'hide' :
                        element.setAttribute('class', 'field select hide');
                        break;
                    case 'show' :
                        element.setAttribute('class', 'field select');
                        break;
                    case 'fade' :
                        element.setAttribute('class', 'field select fade');
                        break;
                }
            } else {
                return element.getAttribute('class').replace('option', '');
            }
        };
        this.options = new Collection(options_ul, [app.ui.inputOption]);

        /* Setando valores iniciais */
        if (params) {
            this.legend(params.legend);
            this.type(params.type);
            this.options.add(params.options);
            this.change(params.change);
            this.actions(params.actions);
            this.filterable(params.filterable);
            listSelected();
        }
    };
}
