/**
 * Ícones do eekit
 *
 * @author Mauro Ribeiro
 * @since  2013-05
 */

var Element    = module.use('element'),
    Css        = module.use('css'),
    Collection = module.use('collection');

module.exports(new Class(function (params) {

        var parent,
            element = document.createElement('li'),
            image = document.createElement('div'),
            legend = document.createElement('div');

        /* CSS */
        element.setAttribute('class', 'icon');
        image.setAttribute('class', 'hide');
        legend.setAttribute('class', 'hide');

        /* Hierarquia */
        element.appendChild(image);
        element.appendChild(legend);

    var element;

    element = new Element('li', { html : [
        new Element('div')
    ]})
}));

/** Icon
 *
 * @autor : Rafael Erthal
 * @since : 2012-10
 *
 * @description : implementa icone
 */

sdk.modules.ui.icon = function (app) {
    return function (params) {
        var parent,
            element = document.createElement('li'),
            image = document.createElement('div'),
            legend = document.createElement('div');

        /* CSS */
        element.setAttribute('class', 'icon');
        image.setAttribute('class', 'hide');
        legend.setAttribute('class', 'hide');

        /* Hierarquia */
        element.appendChild(image);
        element.appendChild(legend);

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
        this.legend = function (value) {
            if (value === '') {
                legend.setAttribute('class', 'hide');
            }
            if (value) {
                legend.setAttribute('class', 'legend');
                legend.innerHTML = value;
            } else {
                return legend.innerHTML
            }
        };
        this.image = function (value) {
            if (value === '') {
                image.setAttribute('class', 'hide');
            }
            if (value) {
                image.setAttribute('class', 'image icon ' + value);
            } else {
                return image.getAttribute('class').replace('image icon ', '');
            }
        };
        this.visibility = function (value) {
            //@TODO implementar método
        };
        /* Setando valores iniciais */
        if (params) {
            this.legend(params.legend);
            this.image(params.image);
            this.visibility(params.visibility);
        }
    };
}
