/**
 * InputText
 *
 * @author Rafael Erthal
 * @since  2012-10
 *
 * @description : implementa inputs
 */

module.exports(InputText = new Class(function (params) {
    var parent,
        element = document.createElement('li'),
        legend_div = document.createElement('div'),
        text_label = document.createElement('label'),
        data_div = document.createElement('div'),
        input_text = document.createElement('input'),
        error_ul = document.createElement('ul'),
        cb,
        rules = [],
        that = this;

    /* CSS */
    element.setAttribute('class', 'field text');
    legend_div.setAttribute('class', 'legend');
    text_label.setAttribute('class', 'text');
    data_div.setAttribute('class', 'data');
    input_text.setAttribute('class', 'input');
    input_text.setAttribute('type', 'text');
    input_text.setAttribute('autocomplete', 'off');
    error_ul.setAttribute('class', 'errors hide');

    /* Hierarquia */
    element.appendChild(legend_div);
    legend_div.appendChild(text_label);
    element.appendChild(data_div);
    data_div.appendChild(input_text);
    data_div.appendChild(error_ul);

    /* Eventos */
    input_text.addEventListener('change', function () {
        that.validate();
        if (cb) {
            cb.apply(app);
        }
    }, true);
    input_text.addEventListener('keyup', function () {
        if (cb) {
            cb.apply(app);
        }
    }, true);

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
    this.validate = function () {
        var valid = true;
            this.errors.remove();
        for (var i in rules) {
            if (!rules[i].rule.test(input_text.value)) {
                this.errors.add(new app.ui.inputError({message : rules[i].message}));
                valid = false;
            }
        }
        return valid;
    }
    this.rules = function (value) {
        if (value) {
            rules = value;
        } else {
            return rules;
        }
    };
    this.legend = function (value) {
        if (value) {
            text_label.innerHTML = value;
        } else {
            return text_label.innerHTML;
        }
    };
    this.name = function (value) {
        if (value) {
            input_text.setAttribute('name', value);
            text_label.setAttribute('for', value);
        } else {
            return input_text.getAttribute('name');
        }
    };
    this.value = function (value) {
        if (value) {
            input_text.value = value;
            this.change();
        } else {
            return input_text.value;
        }
    };
    this.change = function (value) {
        if (value) {
            cb = value;
        } else {
            if (cb) {
                cb.apply(app);
            }
        }
    };
    this.focus = function () {
        setTimeout(function () {input_text.focus()}, 100);
    }
    this.errors = new Collection(error_ul, [app.ui.inputError])
    this.helper = new empreendemia.ui.helper(element);
    this.visibility = function (value) {
        if (value) {
            switch (value) {
                case 'hide' :
                    element.setAttribute('class', 'field text hide');
                    break;
                case 'show' :
                    element.setAttribute('class', 'field text');
                    break;
                case 'fade' :
                    element.setAttribute('class', 'field text fade');
                    break;
            }
        } else {
            return element.getAttribute('class').replace('field text', '');
        }
    };
    /* Setando valores iniciais */
    if (params) {
        this.legend(params.legend);
        this.rules(params.rules);
        this.name(params.name);
        this.value(params.value);
        this.change(params.change);
        this.visibility(params.visibility);
        if (params.helper) {
            this.helper.description(params.helper.description);
            this.helper.example(params.helper.example);
        }
    }
}));