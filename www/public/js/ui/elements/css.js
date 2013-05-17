/*
 * Define os estilos dos elementos do eekit
 *
 * @author Rafael Erthal
 * @since  2013-05
 */

var instances = 0,
    Css;

module.exports(Css = new Class(function (properties) {

    var element = document.createElement('style'),
        name = 'sdk-css-' + instances,
        selectors = [];

    instances++;

    element.type = 'text/css';
    document.getElementsByTagName('head')[0].appendChild(element);

    /* Controla um seletor do objeto
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.selector = function (name) {
        var position;

        if (!name) {
            throw new Error({
                source     : 'css.js',
                method     : 'selector',
                message    : 'Selector name must be especified',
                arguments : arguments
            });
        }

        for (var i in selectors) {
            if (selectors.hasOwnProperty(i)) {
                if (selectors[i].name === name) {
                    position = i;
                }
            }
        }
        if (!position) {
            selectors.push({
                name : name,
                css  : new Css()
            })
        }

        this.get = function () {
            return selectors[position].css;
        };

        this.set = function (value) {

        };

    }

    /* Controla um atributo do objeto
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.property = function (name) {

        if (!name) {
            throw new Error({
                source     : 'css.js',
                method     : 'property',
                message    : 'Property name must be especified',
                arguments : arguments
            });
        }

        this.get = function () {
            return properties[name];
        };

        this.set = function (value) {

            if (!value) {
                throw new Error({
                    source     : 'css.js',
                    method     : 'property',
                    message    : 'Property name must be especified',
                    arguments : arguments
                });
            }

            properties[name] = value;
            render();
        };

        return this;

    };

    /* Método que coloca a classe css no elemento
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.apply = function (value) {

        if (!value) {
            throw new Error({
                source     : 'css.js',
                method     : 'apply',
                message    : 'Value must be a valid element',
                arguments : arguments
            });
        }

        value.className = name;

    }

    /* Método que implementa a classe css no dom
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    var render = function () {
        var css = '.' + name + ' {';

        for (var i in properties) {
            css += i + ' : ' + properties[i] + ';';
        }

        css += '}';

        element.innerHTML = css;
    };

    if (properties) {
        for (var i in properties) {
            if (properties.hasOwnProperty(i)) {
                this.property(i).set(properties[i]);
            }
        }
    }

}));