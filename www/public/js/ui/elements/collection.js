/*
 * Coleção de elementos HTML dentro de um elemento no sdk
 *
 * @author: rafael erthal
 * @since: 2013-05
 */

var instances = 0,
    Element;

module.exports(Element = new Class(function (element, tags) {

    if (!element) {
        throw {
            source     : 'collection.js',
            method     : 'constructor',
            message    : 'Element must be defined',
            arguments : arguments
        };
    }

    if (!tags || tags.constructor != Array) {
        throw {
            source     : 'collection.js',
            method     : 'constructor',
            message    : 'Tags must be a array',
            arguments : arguments
        };
    }

    /* Adiciona coleção de elementos no objeto
     *
     * @author: rafael erthal
     * @since: 2013-05
     */
    this.add = function (elements) {
        element.html.attach(elements);
    };

    this.get = function () {
        return element.html.get();
    };

    this.remove = function (elements) {
        element.html.detach(elements);
    };

}));