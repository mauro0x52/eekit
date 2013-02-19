/** Dialog
 *
 * @autor : Rafael Erthal
 * @since : 2012-08
 *
 * @description : implementa dialogo da UI de ferramenta
 */

sdk.modules.ui.dialog = function (app, container) {
    var element = document.createElement('div'),
        background_div = document.createElement('div'),
        centralizer_div = document.createElement('div'),
        modal_div = document.createElement('div'),
        header_div = document.createElement('div'),
        title_h1 = document.createElement('h1'),
        close_div = document.createElement('div'),
        close_image_div = document.createElement('div'),
        close_legend_div = document.createElement('div'),
        error_div = document.createElement('div'),
        description_div = document.createElement('div'),
        description_p = document.createElement('p'),
        footer_div = document.createElement('div'),
        form_form = document.createElement('form'),
        fieldsets_div = document.createElement('div'),
        submit_div = document.createElement('div'),
        submit_input = document.createElement('input'),
        cb,
        that = this;

    /* CSS */
    element.setAttribute('class', 'modal-wrapper');
    background_div.setAttribute('class', 'background');
    centralizer_div.setAttribute('class', 'centralizer');
    modal_div.setAttribute('class', 'modal width-400');
    header_div.setAttribute('class', 'header');
    title_h1.setAttribute('class', 'hide');
    close_div.setAttribute('class', 'close');
    close_image_div.setAttribute('class', 'image');
    close_legend_div.setAttribute('class', 'legend');
    close_legend_div.innerHTML = 'fechar';
    error_div.setAttribute('class', 'hide');
    description_div.setAttribute('class', 'hide');
    footer_div.setAttribute('class', 'hide');
    form_form.setAttribute('class', 'form');
    fieldsets_div.setAttribute('class', 'field-sets');
    submit_div.setAttribute('class', 'submit');
    submit_input.setAttribute('type', 'submit');
    submit_input.setAttribute('class', 'input');

    /* Hierarquia */
    element.appendChild(background_div);
    element.appendChild(centralizer_div);
    centralizer_div.appendChild(modal_div);
    modal_div.appendChild(header_div);
    header_div.appendChild(title_h1);
    modal_div.appendChild(close_div);
    close_div.appendChild(close_image_div);
    close_div.appendChild(close_legend_div);
    modal_div.appendChild(error_div);
    modal_div.appendChild(description_div);
    description_div.appendChild(description_p);
    modal_div.appendChild(form_form);
    form_form.appendChild(fieldsets_div);
    form_form.appendChild(submit_div);
    submit_div.appendChild(submit_input);
    modal_div.appendChild(footer_div);

    /* Eventos */
    form_form.setAttribute('onsubmit', 'return false;');
    form_form.addEventListener('submit', function (event) {
        event.stopPropagation();
        if (cb && that.form.validate()) {
            cb.apply(app);
        }
    }, true);

    close_div.addEventListener('click', function (event) {
        event.stopPropagation();
        app.close();
    }, true);

    /* Elementos específicos de ferramenta */
    this.fieldset = new sdk.modules.ui.fieldset(app);
    this.inputText = new sdk.modules.ui.inputText(app);
    this.inputError = new sdk.modules.ui.inputError(app);
    this.inputPassword = new sdk.modules.ui.inputPassword(app);
    this.inputDate = new sdk.modules.ui.inputDate(app);
    this.inputSelector = new sdk.modules.ui.inputSelector(app);
    this.inputOption = new sdk.modules.ui.inputOption(app);

    /* Métodos protegidos */
    this.attach = function (HTMLobject) {
        if (HTMLobject && HTMLobject.appendChild) {
            HTMLobject.appendChild(element);
        }
    };
    this.detach = function () {
        if (element.parentNode && element.parentNode && element.parentNode.removeChild) {
            element.parentNode.removeChild(element);
        }
    };

    /* Métodos públicos */
    this.loading = function () {
        //@TODO ver com mauro qual elemento vai receber a classe loading
    };
    this.title = function (value) {
        if (value === '') {
            title_h1.setAttribute('class', 'hide');
        }
        if (value) {
            title_h1.setAttribute('class', 'title');
            title_h1.innerHTML = value;
        } else {
            return title_h1.innerHTML;
        }
    };
    this.description = function (value) {
        if (value === '') {
            description_div.setAttribute('class', 'hide');
        }
        if (value) {
            description_div.setAttribute('class', 'description');
            description_p.innerHTML = value;
        } else {
            return description_p.innerHTML;
        }
    };
    this.error = function (value) {
        if (value === '') {
            error_div.setAttribute('class', 'hide');
        }
        if (value) {
            error_div.setAttribute('class', 'flash error');
            error_div.innerHTML = value;
        } else {
            return error_div.innerHTML;
        }
    };
    this.footer = function (value) {
        if (value === '') {
            footer_div.setAttribute('class', 'hide');
        }
        if (value) {
            footer_div.setAttribute('class', 'footer');
            footer_div.innerHTML = value;
        } else {
            return footer_div.innerHTML;
        }
    };
    this.form = {
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
                if (cb && that.form.validate()) {
                    cb.apply(app);
                }
            }
        },
        validate : function () {
            var fieldsets = that.form.fieldsets.get(),
                valid = true;

            for (var i in fieldsets) {
                if (!fieldsets[i].validate()) {
                    valid = false;
                }
            }

            return valid;
        },
        fieldsets : new Collection(fieldsets_div, [this.fieldset])
    };
}
