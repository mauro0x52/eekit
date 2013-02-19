/** Error
 *
 * @autor : Rafael Erthal
 * @since : 2012-11
 *
 * @description : implementa campo de error
 */

sdk.modules.ui.inputError = function (app) {
    return function (params) {
        var parent,
            element = document.createElement('li');

        /* CSS */
        element.setAttribute('class', 'hide');

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
        this.message = function (value) {
            if (value === '') {
                element.setAttribute('class', 'hide');
            }
            if (value) {
                element.setAttribute('class', 'error');
                element.innerHTML = value;
            } else {
                return element.innerHTML;
            }
        };
        /* Setando valores iniciais */
        if (params) {
            this.message(params.message);
        }
    };
}