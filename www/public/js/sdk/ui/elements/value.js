/** Data
 *
 * @autor : Rafael Erthal
 * @since : 2012-10
 *
 * @description : implementa campo de uma entidade
 */

sdk.modules.ui.value = function (app) {
    return function (params) {
        var parent,
            element = document.createElement('li'),
            value_div = document.createElement('div');
        
        /* CSS */
        element.setAttribute('class', 'value');
        value_div.setAttribute('class', 'data');
        
        /* Hierarquia */
        element.appendChild(value_div);
        
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
        this.value = function (value) {
            if (value) {
                value_div.innerHTML = value;
            } else {
                return value_div.innerHTML;
            }
        };
        /* Setando valores iniciais */
        if (params) {
            this.value(params.value);
        }
    };
}