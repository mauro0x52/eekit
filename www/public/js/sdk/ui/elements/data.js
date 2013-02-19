/** Data
 *
 * @autor : Rafael Erthal
 * @since : 2012-10
 *
 * @description : implementa campo de uma entidade
 */

sdk.modules.ui.data = function (app) {
    return function (params) {
        var parent,
            element = document.createElement('li'),
            legend_div = document.createElement('div'),
            values_ul = document.createElement('ul');
        
        /* CSS */
        element.setAttribute('class', 'field');
        legend_div.setAttribute('class', 'hide');
        values_ul.setAttribute('class', 'values');
        
        /* Hierarquia */
        element.appendChild(legend_div);
        element.appendChild(values_ul);
        
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
                legend_div.setAttribute('class', 'hide');
            }
            if (value) {
                legend_div.setAttribute('class', 'legend');
                legend_div.innerHTML = value;
            } else {
                return legend_div.innerHTML;
            }
        };
        this.values = new Collection(values_ul, [app.ui.value]);
        /* Setando valores iniciais */
        if (params) {
            this.legend(params.legend);
            this.values.add(params.values);
        }
    };
}