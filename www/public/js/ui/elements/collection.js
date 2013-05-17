/*
 * Coleção de elementos HTML dentro de um elemento no sdk
 *
 * @author Rafael Erthal
 * @since  2013-05
 */

var instances = 0,
    Element;

module.exports(Element = new Class(function (element, tags) {

    if (!element) {
        throw new Error({
            source    : 'collection.js',
            method    : 'constructor',
            messag    : 'Element must be defined',
            arguments : arguments
        });
    }

    if (!tags || tags.constructor != Array) {
        throw new Error({
            source    : 'collection.js',
            method    : 'constructor',
            message   : 'Tags must be a array',
            arguments : arguments
        });
    }

    /* Adiciona coleção de elementos no objeto
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.add = function (elements) {
        var i,j,
            valid = true, elementValid;

        if (elements) {
            if (elements.constructor === Array) {
                for (i in elements) {
                    elementValid = false;
                    for (j in tags) {
                        if (elements[i].instanceOf(tags[j])) {
                            elementValid = true;
                        }
                    }
                    if (!elementValid) {
                        valid = false;
                    }
                }

            } else {
                valid = false;
                for (j in tags) {
                    if (elements.instanceOf(tags[j])) {
                        valid = true;
                    }
                }
            }
            if (!valid) {
                throw new Error({
                    source    : 'collection.js',
                    method    : 'add',
                    message   : 'Added element must be valid',
                    arguments : arguments
                })
            }
            element.html.attach(elements);
        }
    };

    this.get = function () {
        return element.html.get();
    };

    this.remove = function (elements) {
        element.html.detach(elements);
    };

}));