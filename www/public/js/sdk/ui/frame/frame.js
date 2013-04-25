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

    /* Elementos específicos de ferramenta */
    this.tag = new sdk.modules.ui.tag(app);

    /* Métodos públicos */
    this.height = function (value) {
        var height = 460,
            width;

        if (document.body && document.body.offsetWidth) {
            height = document.body.offsetHeight;
            width  = document.body.offsetWidth;
        }
        if (document.compatMode=='CSS1Compat' &&
            document.documentElement &&
            document.documentElement.offsetWidth
        ) {
            height = document.documentElement.offsetHeight;
            width  = document.documentElement.offsetWidth;
        }
        if (window.innerWidth && window.innerHeight) {
            height = window.innerHeight;
            width  = window.innerWidth;
        }

        body_div.style.height = '100%';
        body_div.style.width = width;
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
        var content,
            i;
        body_div.innerHTML = '';
        if (value.constructor === Array) {
            for (i in value) {
                if (value[i].attach) {
                    value[i].attach(body_div, ['temp']);
                } else {
                    content = new app.ui.tag(value[i]);
                    content.attach(body_div, ['temp']);
                }
            }
        } else if (value.attach) {
            value.attach(body_div, ['temp']);
        } else {
            content = new app.ui.tag(value);
            content.attach(body_div, ['temp']);
        }
    };
}
