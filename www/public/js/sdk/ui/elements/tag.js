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
                    if (value[i].attach) {
                        value[i].attach(element, ['temp']);
                    } else {
                        content = new app.ui.tag(value[i]);
                        content.attach(element, ['temp']);
                    }
                }
            } else if (value.attach) {
                value.attach(element, ['temp']);
            } else if (value.constructor === String) {
                element.innerHTML = value;
            } else {
                content = new app.ui.tag(value);
                content.attach(element, ['temp']);
            }
        };
        this.attribute = function (name) {
            return {
                get : function () {
                    return element.getAttribute(name);
                },
                set : function (value) {
                    element.setAttribute(name, value);
                }
            };
        };
        this.event = function (name) {
            return {
                bind : function (cb) {
                    element.addEventListener(name, cb, true);
                },
                unbind : function (cb) {
                    element.removeEventListener(name, cb, true);
                },
                trigger : function () {
                    element.dispatchEvent(name);
                }
            };
        };
        this.value = function (value) {
            if (value) {
                element.value = value;
            } else {
                return element.value;
            }
        }
        /* Setando valores iniciais */
        if (params) {
            /* Atributos */
            for (i in params.attributes) {
                this.attribute(i).set(params.attributes[i]);
            }
            /* Eventos */
            for (i in params.events) {
                this.event(i).bind(params.events[i]);
            }
            /* filhos */
            if (params.html) {
                this.html(params.html);
            }
        }
    };
}