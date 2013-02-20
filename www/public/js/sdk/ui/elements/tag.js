/** Tag
 *
 * @autor : Rafael Erthal
 * @since : 2013-01
 *
 * @description : implementa uma tag genérica
 */

sdk.modules.ui.tag = function (app) {
    return function (params) {
        var parent,
            element = document.createElement(params.tag),
            i;

        element.setAttribute('class', 'temp')

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
        this.html = function (value) {
            var content,
                i;

            if (value.constructor === Array) {
                for (i in value) {
                    content = new app.ui.tag(value[i]);
                    content.attach(element, ['temp']);
                }
            } else if (value.constructor === String) {
                element.innerHTML = value;
            } else {
                content = new app.ui.tag(value);
                content.attach(element, ['temp']);
            }
        };
        /* Setando valores iniciais */
        if (params) {
            /* Atributos */
            for (i in params.attributes) {
                element.setAttribute(i, params.attributes[i]);
            }
            /* Eventos */
            for (i in params.events) {
                element.addEventListener(i, params.events[i]);
            }
            /* filhos */
            if (params.html) {
                this.html(params.html);
            }
        }
    };
}