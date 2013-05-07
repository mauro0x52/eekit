/** EmbeddedList
 *
 * @autor : Rafael Erthal
 * @since : 2012-08
 *
 * @description : implementa a lista embedada da UI de ferramenta
 */

sdk.modules.ui.embeddedList = function (app) {
    var element = document.createElement('div'),
        header_div = document.createElement('div'),
        header_h4 = document.createElement('h4'),
        body_div = document.createElement('div'),
        groups_ol = document.createElement('ol'),
        filter_div = document.createElement('div'),
        filter_form = document.createElement('form'),
        fieldsets_div = document.createElement('div'),
        submit_div = document.createElement('div'),
        submit_input = document.createElement('input'),
        cb,
        releasable = null,
        receptive = null;

    /* CSS */
    element.setAttribute('class', 'related list');
    header_div.setAttribute('class', 'header');
    header_h4.setAttribute('class', 'title');
    body_div.setAttribute('class', 'body');
    groups_ol.setAttribute('class', 'groups');
    filter_div.setAttribute('class', 'filter');
    filter_form.setAttribute('class', 'form');
    fieldsets_div.setAttribute('class', 'field-sets');
    submit_div.setAttribute('class', 'submit');
    submit_input.setAttribute('type', 'submit');
    submit_input.setAttribute('class', 'input');

    /* Hierarquia */
    element.appendChild(header_div);
    header_div.appendChild(header_h4);
    element.appendChild(body_div);
    body_div.appendChild(groups_ol);
    element.appendChild(filter_div);
    filter_div.appendChild(filter_form);
    filter_form.appendChild(fieldsets_div);
    filter_form.appendChild(submit_div);
    submit_div.appendChild(submit_input);

    /* Eventos */
    filter_form.setAttribute('onsubmit', 'return false;');
    filter_form.addEventListener('submit', function (event) {
        event.stopPropagation();
        if (cb) {
            cb.apply(app);
        }
    }, true);

    /* Métodos protegidos */
    this.attach = function (HTMLobject) {
        if (HTMLobject && HTMLobject.appendChild) {
            HTMLobject.appendChild(element);
            empreendemia.ui.content.roll.sheets.fitHeight();
        }
    };
    this.detach = function () {
        if (element.parentNode && element.parentNode && element.parentNode.removeChild) {
            element.parentNode.removeChild(element);
        }
    };

    /* Elementos específicos de ferramenta */
    this.action = new sdk.modules.ui.action(app);
    this.icon = new sdk.modules.ui.icon(app);
    this.group = new sdk.modules.ui.group(app);
    this.groupset = new sdk.modules.ui.groupset(app);
    this.item = new sdk.modules.ui.item(app);
    this.fieldset = new sdk.modules.ui.fieldset(app);
    this.inputText = new sdk.modules.ui.inputText(app);
    this.inputPassword = new sdk.modules.ui.inputPassword(app);
    this.inputDate = new sdk.modules.ui.inputDate(app);
    this.inputSelector = new sdk.modules.ui.inputSelector(app);
    this.inputOption = new sdk.modules.ui.inputOption(app);

    /* Métodos públicos */
    this.releasable = function (value) {
        if ((value && value.constructor === app.ui.item) || (value === null)) {
            releasable = value;
            if (value) {
                groups_ol.setAttribute('class', 'groups droppable');
            } else {
                groups_ol.setAttribute('class', 'groups');
            }
        } else {
            return releasable;
        }
    };
    this.receptive = function (value) {
        if ((value && value.constructor === app.ui.group) || (value === null)) {
            receptive = value;
            if (value) {
                groups_ol.setAttribute('class', 'groups droppable');
            } else {
                groups_ol.setAttribute('class', 'groups');
            }
        } else {
            return receptive;
        }
    };
    this.loading = function (value) {
        if (value) {
            element.setAttribute('class', 'related list loading');
        } else {
            element.setAttribute('class', 'related list');
        }
    };
    this.heading = this.title = function (value) {
        if (value) {
            header_h4.innerHTML = value;
        } else {
            return header_h4.innerHTML;
        }
    };
    this.filter = {
        action : function (value) {
            if (value) {
                submit_input.setAttribute('value', value);
            } else {
                return submit_input.getAttribute('value');
            }
        },
        submit : function (value) {
            if (value) {
                cb = value;
            } else {
                if (cb) {
                    cb.apply(app);
                }
            }
        },
        fieldsets : new Collection(fieldsets_div, [this.fieldset])
    };
    this.groups = new Collection(groups_ol, [this.groupset, this.group]);
}
