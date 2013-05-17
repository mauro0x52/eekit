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
        if (elements) {
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