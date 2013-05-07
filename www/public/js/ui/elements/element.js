/*
 * Elemento base de interface do eekit
 *
 * @author: rafael erthal
 * @since: 2013-05
 */

var instances = 0,
    Element;

module.exports(Element = new Class(function (tag, params) {

    var element,
        css;

    if (!tag) {
        throw {
            source     : 'element.js',
            method     : 'constructor',
            message    : 'Element tag must be especified',
            arguments : arguments
        };
    }

    if (tag.constructor === String) {
        /* Construir um novo objeto */
        element = document.createElement(tag);
        element.setAttribute('id', 'sdk-element-' + instances);
        instances++;
    } else {
        /* Objeto ja esta construido */
        element = tag;
    }

    /* Controla o css do elemento
     *
     * @author: rafael erthal
     * @since: 2013-05
     */
    this.css = function (value) {
        if (value) {
            css = value;
            css.apply(element);
        } else {
            return css;
        }
    }

    /* Coloca elemento no nó pai
     *
     * @author: rafael erthal
     * @since: 2013-05
     */
    this.attach = function (parent) {

        if (!parent || !parent.appendChild) {
            throw {
                source     : 'element.js',
                method     : 'attach',
                message    : 'Parent element must exist',
                arguments : arguments
            };
        }

        parent.appendChild(element);

    };

    /* Remove elemento do nó pai
     *
     * @author: rafael erthal
     * @since: 2013-05
     */
    this.detach = function () {

        if (!element.parentNode || !element.parentNode.removeChild) {
            throw {
                source     : 'element.js',
                method     : 'detach',
                message    : 'Parent element must exist',
                arguments : arguments
            };
        }

        element.parentNode.removeChild(element);

    };

    /* Controla um atributo do objeto
     *
     * @author: rafael erthal
     * @since: 2013-05
     */
    this.attribute = function (name) {

        if (!name) {
            throw {
                source     : 'element.js',
                method     : 'attribute',
                message    : 'Attribute name must be especified',
                arguments : arguments
            };
        }

        if (name === 'id') {
            throw {
                source     : 'element.js',
                method     : 'attribute',
                message    : 'You cannot control the object id',
                arguments : arguments
            };
        }

        this.get = function () {

            if (name === 'value') {
                return element.getAttribute(name);
            } else {
                return element.value;
            }

        };

        this.set = function (value) {

            if (!value) {
                throw {
                    source     : 'element.js',
                    method     : 'attribute.set',
                    message    : 'Attribute value must be especified',
                    arguments : arguments
                };
            }

            element.setAttribute(name, value);

        };

        return this;

    };

    /* Controla um evento do objeto
     *
     * @author: rafael erthal
     * @since: 2013-05
     */
    this.event = function (name) {

        if (!name) {
            throw {
                source     : 'element.js',
                method     : 'event',
                message    : 'Event name must be especified',
                arguments : arguments
            };
        }

        this.bind = function (cb, capture) {

            if (!cb || cb.constructor != Function) {
                throw {
                    source     : 'element.js',
                    method     : 'event.bind',
                    message    : 'Event callback must be a function',
                    arguments : arguments
                };
            }

            element.addEventListener(name, cb, capture);

        };

        this.unbind = function (cb, capture) {
            element.removeEventListener(name, cb, capture);
        };

        this.trigger = function () {
            element.dispatchEvent(name);
        };

        return this;

    };

    /* Controla o conteudo html do objeto
     *
     * @author: rafael erthal
     * @since: 2013-05
     */
    this.html = {

        set : function (value) {
            this.detach();
            this.attach(value);
        },

        get : function () {

            var i,
                result = [];

            for (i = 0; i < element.childNodes.length; i++) {
                if (element.childNodes[i].nodeType === 3) {
                    result.push(element.childNodes[i].nodeValue);
                } else if (element.childNodes[i].nodeType === 1) {
                    result.push(new Element(element.childNodes[i]));
                }
            }
            if (result.length === 1) {
                return result[0];
            } else {
                return result;
            }

        },

        attach : function (value) {

            if (!value) {
                throw {
                    source     : 'element.js',
                    method     : 'html.attach',
                    message    : 'Attach element must exist',
                    arguments : arguments
                };
            } else if (value.constructor === Array) {
                for (var i in value) {
                    if (value.hasOwnProperty(i)) {
                        this.attach(value[i]);
                    }
                }
            } else if (value.constructor === String) {
                element.appendChild(document.createTextNode(value.replace(/(<([^>]+)>)/ig, '')));
            } else if (value.attach) {
                value.attach(element);
            } else {
                throw {
                    source     : 'element.js',
                    method     : 'html.attach',
                    message    : 'Attach element must be valid',
                    arguments : arguments
                };
            }

        },

        detach : function (value) {

            if (!value) {
                this.detach(this.get());
            } else if (value.constructor === Array) {
                for (var i in value) {
                    if (value.hasOwnProperty(i)) {
                        this.detach(value[i]);
                    }
                }
            } else if (value.detach) {
                value.detach();
            } else {
                throw {
                    source     : 'element.js',
                    method     : 'html.detach',
                    message    : 'Detach element must be valid',
                    arguments : arguments
                };
            }

        }

    };

    if (params) {
        if (params.html) {
            this.html.attach(params.html);
        }
        if (params.attributes) {
            for (var i in params.attributes) {
                if (params.attributes.hasOwnProperty(i)) {
                    this.attribute(i).set(params.attributes[i]);
                }
            }
        }
        if (params.events) {
            for (var i in params.events) {
                if (params.events.hasOwnProperty(i)) {
                    this.event(i).bind(params.events[i]);
                }
            }
        }
        if (params.css) {
            this.css(params.css);
        }
    }

}));