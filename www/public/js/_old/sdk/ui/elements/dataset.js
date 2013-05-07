/** Dataset
 *
 * @autor : Rafael Erthal
 * @since : 2012-10
 *
 * @description : implementa dataset de uma entidade
 */

sdk.modules.ui.dataset = function (app) {
    return function (params) {
        var parent,
            element = document.createElement('div'),
            legend_h6 = document.createElement('h6'),
            fields_ul = document.createElement('ul');
        
        /* CSS */
        element.setAttribute('class', 'data-set');
        legend_h6.setAttribute('class', 'hide');
        fields_ul.setAttribute('class', 'fields');
        
        /* Hierarquia */
        element.appendChild(legend_h6);
        element.appendChild(fields_ul);
        
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
                legend_h6.setAttribute('class', 'hide');
            }
            if (value) {
                legend_h6.setAttribute('class', 'legend');
                legend_h6.innerHTML = value;
            } else {
                return legend_h6.innerHTML;
            }
        };
        this.fields = new Collection(fields_ul, [app.ui.data]);
        /* Setando valores iniciais */
        if (params) {
            this.legend(params.legend);
            this.fields.add(params.fields);
        }
    };
}