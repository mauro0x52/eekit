/** appNavigable
 *
 * @autor : Rafael Erthal
 * @since : 2012-11
 *
 * @description : navegção de aplicativos
 */

empreendemia.ui.appNavigable = function (params) {
    var element = document.createElement('li'),
        option_a = document.createElement('a'),
        click_cb,
        href,
        that = this;

    /* CSS */
    element.setAttribute('class', 'sheet');
    option_a.setAttribute('class', 'hide');
    option_a.setAttribute('href', '#');

    /* Hierarquia */
    element.appendChild(option_a);

    /* Eventos */
    option_a.addEventListener('click', function () {
        if (click_cb) {
            click_cb.apply(empreendemia);
        }
    }, true);

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
    this.legend = function (value) {
        if (value === '') {
            option_a.setAttribute('class', 'hide');
        }
        if (value) {
            option_a.setAttribute('class', 'anchor');
            option_a.innerHTML = value;
        } else {
            return option_a.innerHTML
        }
    };
    this.click = function (value) {
        if (value) {
            click_cb = value;
        } else {
            if (click_cb) {
                click_cb.apply(empreendemia);
            }
        }
    };
    this.href = function (value) {
        if (value) {
            option_a.setAttribute('href', '#!/' + value);
            href = value;
        } else {
            return href;
        }
    }
    this.selected = function (value) {
        if (value === true || value === false) {
            if (value) {
                element.setAttribute('class', 'sheet selected');
                empreendemia.routes.set(href);
            } else {
                element.setAttribute('class', 'sheet');
            }
        } else {
            return element.getAttribute('class') === 'sheet selected';
        }
    }
    /* Setando valores iniciais */
    if (params) {
        this.legend(params.legend);
        this.click(params.click);
        this.href(params.href);
    }
}
