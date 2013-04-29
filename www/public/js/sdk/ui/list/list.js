/** List
 *
 * @autor : Rafael Erthal
 * @since : 2012-08
 *
 * @description : implementa a lista da UI de ferramenta
 */

sdk.modules.ui.list = function (app) {
    var element = document.createElement('div'),
        header_div = document.createElement('div'),
        header_h4 = document.createElement('h4'),
        close_div = document.createElement('div'),
        close_image_div = document.createElement('div'),
        close_legend_div = document.createElement('div'),
        body_div = document.createElement('div'),
        menu_div = document.createElement('div'),
        actions_menu = document.createElement('menu'),
        groups_ol = document.createElement('ol'),
        filter_div = document.createElement('div'),
        filter_form = document.createElement('form'),
        fieldsets_div = document.createElement('div'),
        submit_div = document.createElement('div'),
        submit_input = document.createElement('input'),
        loading_div = document.createElement('div'),
        legend_div = document.createElement('div'),
        image_div = document.createElement('div'),
        cb,
        that = this,
        releasable = null,
        receptive = null;

    /* CSS */
    element.setAttribute('class', 'sheet list');
    header_div.setAttribute('class', 'header');
    header_h4.setAttribute('class', 'title');
    close_div.setAttribute('class', 'close');
    close_image_div.setAttribute('class', 'image');
    close_legend_div.setAttribute('class', 'legend');
    close_legend_div.innerHTML = 'fechar';
    body_div.setAttribute('class', 'body');
    menu_div.setAttribute('class', 'menu');
    actions_menu.setAttribute('class', 'actions');
    groups_ol.setAttribute('class', 'groups');
    filter_div.setAttribute('class', 'filter');
    filter_form.setAttribute('class', 'form');
    fieldsets_div.setAttribute('class', 'field-sets');
    submit_div.setAttribute('class', 'submit');
    submit_input.setAttribute('type', 'submit');
    submit_input.setAttribute('class', 'input');
    loading_div.setAttribute('class', 'loading');
    legend_div.setAttribute('class', 'legend');
    legend_div.innerHTML = 'carregando';
    image_div.setAttribute('class', 'image');

    /* Hierarquia */
    element.appendChild(header_div);
    header_div.appendChild(header_h4);
    header_div.appendChild(close_div);
    close_div.appendChild(close_image_div);
    close_div.appendChild(close_legend_div);
    element.appendChild(body_div);
    body_div.appendChild(menu_div);
    menu_div.appendChild(actions_menu);
    body_div.appendChild(groups_ol);
    element.appendChild(filter_div);
    filter_div.appendChild(filter_form);
    filter_form.appendChild(fieldsets_div);
    filter_form.appendChild(submit_div);
    submit_div.appendChild(submit_input);
    element.appendChild(loading_div);
    loading_div.appendChild(legend_div);
    loading_div.appendChild(image_div);

    /* Eventos */
    close_div.addEventListener('click', function (event) {
        event.stopPropagation();
        app.close();
    }, true);

    filter_form.setAttribute('onsubmit', 'return false;');
    filter_form.addEventListener('submit', function (event) {
        event.stopPropagation();
        that.loading(true);
        that.loading(false);
        if (cb) {
            cb.apply(app);
        }
    }, true);

    element.addEventListener('click', function (event) {
        if (!app.ui.selected()) {
            event.stopPropagation();
            event.preventDefault();
        }
        empreendemia.ui.content.navigation.focus(app.ui);
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
    this.inputTextarea = new sdk.modules.ui.inputTextarea(app);
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
    this.height = function () {
        var height = 460;

        if (document.body && document.body.offsetWidth) {
            height = document.body.offsetHeight;
        }
        if (document.compatMode=='CSS1Compat' &&
            document.documentElement &&
            document.documentElement.offsetWidth
        ) {
            height = document.documentElement.offsetHeight;
        }
        if (window.innerWidth && window.innerHeight) {
            height = window.innerHeight;
        }

        body_div.style.height = height-155;
        filter_div.style.height = height-155;
    };
    this.loading = function (value) {
        if (value) {
            element.setAttribute('class', 'sheet list loading');
        } else {
            setTimeout(function () {element.setAttribute('class', 'sheet list');}, 500);
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
                that.loading(true);
                that.loading(false);
                if (cb) {
                    cb.apply(app);
                }
            }
        },
        fieldsets : new Collection(fieldsets_div, [this.fieldset])
    };
    this.actions = new Collection(actions_menu, [this.action]);
    this.groups = new Collection(groups_ol, [this.groupset, this.group]);
}
