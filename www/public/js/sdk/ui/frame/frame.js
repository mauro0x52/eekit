/** Frame
 *
 * @autor : Rafael Erthal
 * @since : 2013-01
 *
 * @description : implementa um frame livre de UI
 */

sdk.modules.ui.frame = function (app) {
    var element = document.createElement('div'),
        body_div = document.createElement('div');

    /* CSS */
    element.setAttribute('class', 'sheet frame');
    body_div.setAttribute('class', 'body');

    /* Hierarquia */
    element.appendChild(body_div);

    /* Eventos */
    element.addEventListener('click', function () {
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

    /* Métodos públicos */
    this.height = function (value) {
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
    };
    this.loading = function (value) {
        if (value) {
            element.setAttribute('class', 'sheet frame loading');
        } else {
            setTimeout(function () {element.setAttribute('class', 'sheet frame');}, 500);
        }
    };
    this.heading = function (value) {};
    this.html = function (value) {
        if (value) {
            body_div.innerHTML = value
        } else {
            return body_div.innerHTML;
        }
    };
}
